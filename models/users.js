const mongoose = require("mongoose");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const UsersSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  isActive: { type: Boolean, default:1 },
  isAdmin: { type: Boolean, default:0 },
  hash: String,
  salt: String,
});

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

UsersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName:this.lastName,
    isAdmin:this.isAdmin,
    isActive:this.isActive,
    token: this.generateJWT(),
  };
};
const User = mongoose.model("User",UsersSchema);
module.exports =User; 