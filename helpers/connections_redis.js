const { createClient } = require("redis");

const client = createClient();

client.on("error", function(err) {
  console.log("Redis Client Error", err);
});

client.on("connected", function() {
  console.log("Redis Client Connected")
});

client.on("ready", function(){
  console.log("Redis Client Ready")
});

client.connect();
module.exports = client;