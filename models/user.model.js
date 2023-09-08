const mongoose = require("mongoose");
const {
  testConnection,
  userConnection,
} = require("../helpers/connections_multi_mongodb");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});


UserSchema.pre("save",async function  (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword= await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isCheckPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    next(error);
  }
}
module.exports = testConnection.model("user", UserSchema);
