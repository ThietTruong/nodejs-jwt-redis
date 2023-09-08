const mongoose = require("mongoose");
require("dotenv").config();
/**
 * Creates a new MongoDB connection.
 *
 * @param {string} uri - The MongoDB connection URI.
 * @returns {object} - The created connection object.
 */
function newConnection(uri) {
  // Create a new MongoDB connection
  const connection = mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Log a message when the connection is established
  connection.on("connected", function () {
    console.log(`Mongodb connected:: ${this.name}`);
  });

  // Log a message when the connection is disconnected
  connection.on("disconnected", function () {
    console.log(`Mongodb disconnected:: ${this.name}`);
  });

  // Log an error message when there is an error in the connection
  connection.on("error", function (err) {
    console.log(`Mongodb error:: ${JSON.stringify(err)}`);
  });

  // Return the created connection object
  return connection;
}

// make new connection
const testConnection = newConnection(process.env.URI_MONGODB_TEST);
// const userConnection = newConnection(process.env.URI_MONGODB_USERS);

module.exports = { testConnection };
