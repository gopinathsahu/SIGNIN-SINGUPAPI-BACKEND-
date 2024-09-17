const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto=require('crypto');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: [20, "the maximum length of the name is 20 character"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      maxLength: [
        40,
        "the maximum length of the email address is 40 character",
      ],
      lowercase: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      maxLength: [
        10,
        "the maximum length of the contact number is 20 character",
      ],
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, " the minimum length of the password is 8 character"],
      trim: true,
      select: false,
    },

    forgetPasswordToken: {
      type: String,
    },
    forgetPasswordExpiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});
userSchema.methods = {
  jwtToken() {
    return JWT.sign({ id: this._id, email: this.email }, process.env.SECRET, {
      expiresIn: "24h",
    });
  },
  getForgetPasswordToken() {
    const forgotToken = crypto.randomBytes(20).toString('hex');
    this.forgetPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');
      
    this.forgetPasswordExpiryDate = Date.now() + 60 * 60 * 1000;
    return forgotToken;
  },
};
module.exports = mongoose.model("User", userSchema);
