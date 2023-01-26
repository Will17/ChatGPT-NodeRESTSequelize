Node.js MySQL REST API
This project is a REST API that connects to a MySQL database and performs CRUD operations. It uses the Express framework and the Sequelize ORM to interact with the database.

Getting Started
Clone the repository and navigate to the project folder
Copy code
git clone https://github.com/your-username/node-mysql-rest-api.git
cd node-mysql-rest-api
Install the dependencies
Copy code
npm install
Create a .env file in the root of the project and set the following environment variables:
Copy code
DB_HOST=your_db_host
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
Use sequelize-auto to generate the models for your MySQL tables.
Copy code
npm install -g sequelize-auto
sequelize-auto -o "./models" -d database_name -h host -u username -p port -x password
This command will generate models for all the tables in the specified database_name and save them in the models folder.
You can also specify the host, port, username, password and other options as per your configuration.

Start the server
Copy code
npm start
The API will now be available at http://localhost:3000.

API Endpoints
The following endpoints are available for the REST API:

GET /:table - Retrieve all rows from the specified table
GET /:table/:id - Retrieve a single row from the specified table by ID
POST /:table - Insert a new row into the specified table
PUT /:table/:id - Update a single row in the specified table by ID
DELETE /:table/:id - Delete a single row from the specified table by ID
The API supports filtering, sorting and pagination through query parameters.

Safety Measures
The API uses the sequelize ORM and the build-in methods provided by it to prevent SQL injection attacks. Additionally, it validates the user input and sanitizes the data before performing any database operations.

Conclusion
This project provides a basic CRUD interface for any MySQL database and can be easily customized to suit your specific needs. It uses the popular Express framework and Sequelize ORM to handle database operations, and includes safety measures to protect against SQL injection attacks. Feel free to fork the project and make it your own.
