const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Using Unique Valdidator to check unique username. throws error if not.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
