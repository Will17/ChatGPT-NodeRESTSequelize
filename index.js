const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, Op } = require('sequelize');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

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
const User = sequelize.define('user', {
  name: Sequelize.STRING,
  email: Sequelize.STRING
});

const Company = sequelize.define('company', {
  name: Sequelize.STRING
});

// Define the associations between the models
User.belongsTo(Company);
Company.hasMany(User);

// Sync the models with the database
sequelize.sync();

// Define the routes for the API
app.get('/table/:name', async (req, res) => {
  try {
    const tableName = req.params.name;
    let query = {
      attributes: ['*'],
      from: tableName
    };

    // Add a JOIN clause if specified in the query string
    if (req.query.join) {
      query.include = [{
        model: req.query.join,
        required: true
      }];
    }

    // Add a WHERE clause for filtering columns if specified in the query string
    if (req.query.filter) {
      const filter = JSON.parse(req.query.filter);
      query.where = {
        [Op.and]: filter.map((condition) => {
      let whereCondition = {};
      whereCondition[condition.column] = {
        [condition.operator]: condition.value
      };
      return whereCondition;
    })
  };
}

const data = await sequelize.query(
  'SELECT * FROM ' + tableName + ' WHERE ' + where + ';',
  { type: sequelize.QueryTypes.SELECT }
);

res.json(data);
        } catch (error) {
    res.status(500).json({ error });
  }
});

app.post('/table/:name', async (req, res) => {
  try {
    const tableName = req.params.name;
    const data = req.body;
    const model = tableName === 'users' ? User : Company;
    await model.create(data);
    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.put('/table/:name/:id', async (req, res) => {
  try {
    const tableName = req.params.name;
    const id = req.params.id;
    const data = req.body;
    const model = tableName === 'users' ? User : Company;
    await model.update(data, { where: { id } });
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.delete('/table/:name/:id', async (req, res) => {
  try {
    const tableName = req.params.name;
    const id = req.params.id;
    const model = tableName === 'users' ? User : Company;
    await model.destroy({ where: { id } });
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});


