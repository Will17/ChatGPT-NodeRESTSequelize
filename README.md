# ChatGPT-NodeRESTSequelize

A REST API for interacting with a MySQL database using Node.js and Sequelize.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- A MySQL database
- Sequelize

### Installing

1. Clone the repository
git clone https://github.com/your-username/project-name.git

Copy code
2. Install the dependencies
npm install

Copy code
3. Create a `.env` file in the root of the project and set the following environment variables:
DB_HOST=your-host
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=your-database-name

Copy code
4. Run the migration to create the necessary tables
npm run migrate

Copy code
5. Start the server
npm start

Copy code

## Routes

### GET

Retrieve data from a table in the database.

GET /table/:name

Copy code

#### Query Parameters

- `join`: The name of the table to join with.
- `filter`: A JSON object containing the filters to apply to the query. The object should have the following format:
{
"and": [
{
"column": "column_name",
"operator": "comparison_operator",
"value": "value"
},
{
"column": "column_name",
"operator": "comparison_operator",
"value": "value"
}
]
}

### POST

Insert data into a table in the database.

POST /table/:name


#### Body

A JSON object containing the data to insert into the table.

### PUT

Update data in a table in the database.

PUT /table/:name/:id

#### Body

A JSON object containing the data to update in the table.

### DELETE

Delete a record from a table in the database.

DELETE /table/:name/:id

## Built With

- [Node.js](https://nodejs.org/) - The JavaScript runtime
- [Sequelize](https://sequelize.org/) - A Node.js ORM for MySQL

## Authors

- **Will17** - [Github Profile](https://github.com/Will17)

## License

This project is licensed under the MIT License.
