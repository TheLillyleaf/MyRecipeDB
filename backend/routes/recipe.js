const express = require("express");
const Recipe = require("../models/recipe");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

//Add costs to DB
router.post("", checkAuth, (req, res, next) => {
  const newRecipe = new Recipe({
    name: req.body.name,
    description: req.body.description,
    difficulty: req.body.difficulty,
    timeToCook: req.body.timeToCook,
    rating: req.body.rating,
    steps: req.body.steps,
    category: req.body.category,
    ingredients: req.body.ingredients,
  });

  newRecipe.save().then((createdRecipe) => {
    res.status(201).json({ message: "Recipe Saved", recipe: createdRecipe });
  });
});

router.get("", (req, res, next) => {
  Recipe.find().then((documents) => {
    res
      .status(200)
      .json({ message: "Recipes fetched succesfully", recipes: documents });
  });
});

router.put("/:id", checkAuth, (req, res, next) => {
  const updatedRecipe = {
    name: req.body.name,
    description: req.body.description,
    difficulty: req.body.difficulty,
    timeToCook: req.body.timeToCook,
    rating: req.body.rating,
    steps: req.body.steps,
    category: req.body.category,
    ingredients: req.body.ingredients,
  };
  console.log(updatedRecipe);
  Recipe.findByIdAndUpdate({ _id: req.params.id }, updatedRecipe)
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "update succesful" });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Recipe.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "delete did not work, try again." });
    } else {
      res.status(200).json({ message: "Recipe deleted!" });
    }
  });
});

module.exports = router;
