const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  difficulty: { type: Number },
  timeToCook: { type: Number },
  rating: { type: Number },
  steps: { type: [] },
  category: { type: String },
  ingredients: { type: [] },
});

module.exports = mongoose.model("Recipe", recipeSchema);
