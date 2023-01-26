const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, Op } = require('sequelize');
const { tableName } = require('./models');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

function validateAndSanitize(data, type="text") {
  switch(type) {
      case 'email':
          data.email = validator.normalizeEmail(data.email);
          if (!validator.isEmail(data.email)) {
              throw new Error('Invalid email address');
          }
          break;
      case 'numeric':
          if (!validator.isNumeric(data.value)) {
              throw new Error('Invalid numeric value');
          }
          break;
      case 'percentage':
          if (!validator.isFloat(data.value, { min: 0, max: 100 })) {
              throw new Error('Invalid percentage value');
          }
          break;
      case 'telephone':
          data.telephone = validator.normalizePhoneNumber(data.telephone);
          if (!validator.isMobilePhone(data.telephone)) {
              throw new Error('Invalid telephone number');
          }
          break;
      case 'text':
          data.text = validator.trim(data.text);
          if (!validator.isLength(data.text, { min: 1, max: 100 })) {
              throw new Error('Invalid text value');
          }
          break;
      default:
          throw new Error('Invalid data type');
  }

  //return the sanitized data
  return data;
}


// Connect to the MySQL database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Define the models for the tables in the database
const modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(file => {
  if (file.indexOf('.js') >= 0) {
    const model = sequelize.import(path.join(modelsPath, file));
  }
});

// Define the routes for the API
app.get('/table/:name', async (req, res) => {
  try {
    let query = {
      attributes: ['*'],
      from: tableName
    };

    // Add a JOIN clause if specified in the query string
    if (req.query.join) {
      query.include = [
        {
          model: sequelize.models[req.query.join],
          as: req.query.as
        }
      ];
    }

    // Add a WHERE clause if specified in the query string
    if (req.query.filter) {
      const filter = JSON.parse(req.query.filter);
      const {column, operator, value} = filter;
      query.where = {
        [column]: {
          [operator]: value
        }
      }
    }

    // Find the data in the specified table
    const data = await sequelize.models[tableName].findAll(query);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/:tableName/:id', (req, res) => {
  // Validate user input and sanitize data
  const id = req.params.id;
  let updateData = req.body;
  updateData = validateAndSanitize(updateData);

  // Update the record in the database
  model.update(updateData, { where: { id: id } }).then(() => {
      res.status(200).send({ message: `Record with id ${id} updated successfully.` });
  }).catch(err => {
      res.status(500).send({ message: `Error updating record with id ${id}: ${err}` });
  });
});

app.post('/:tableName', (req, res) => {
  // Validate user input and sanitize data
  let newData = req.body;
  newData = validateAndSanitize(newData);

  // Insert the new record into the database
  model.create(newData).then(record => {
      res.status(201).send({ message: `Record created successfully with id: ${record.id}` });
  }).catch(err => {
      res.status(500).send({ message: `Error creating new record: ${err}` });
  });
});

app.delete('/:tableName/:id', (req, res) => {
  // Validate user input and sanitize data
  const id = req.params.id;

  // Delete the record from the database
  model.destroy({ where: { id: id } }).then(() => {
      res.status(200).send({ message: `Record with id ${id} deleted successfully.` });
  }).catch(err => {
      res.status(500).send({ message: `Error deleting record with id ${id}: ${err}` });
  });
});



// Start the Express.js server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
