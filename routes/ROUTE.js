const express = require("express");
const dynamicRouter = express.Router();
const mongoose = require("mongoose");
const verifToken = require("../middelwares/VerifToken");

const { PartenershipName } = require("../models/Partnership.model");
const { SpaceName } = require("../models/SpaceModel");
const { ReviewName } = require("../models/ReviewModel");
const { CategoryName } = require("../models/CategoryModel");
const { FavoriesName } = require("../models/FavorisModel");
const { ServiceName } = require("../models/ServiceModel");
const uploadImageToCloudinary = require("../middelwares/imageMiddleware");

let models = [
  "User",
  "Partnership",
  "Space",
  "Review",
  "Category",
  "Favories",
  "Service",
];

const middlewareFunctions = {
  User: [],
  Partnership: [],
  Favories: [],
  Service: [],
};
const middlewareFunctionsPost = {
  User: [],
  Partnership: [],
  Service: [uploadImageToCloudinary],
  Category: [verifToken.isUser],
};

models.forEach((modelName) => {
  // Get the model
  const Model = mongoose.model(modelName);
  const middlewares = middlewareFunctions[modelName] || [];
  const middlewaresPost = middlewareFunctionsPost[modelName] || [];
  // Create
  dynamicRouter.post(`/${modelName}/add`, middlewaresPost, async (req, res) => {
    const newModel = new Model(req.body);
    try {
      await newModel.save();
      res.status(201).send(newModel);
    } catch (error) {
      res.status(400).send(error);
    } 
  });

  // Read
  dynamicRouter.get(`/${modelName}/getAll`, middlewares, async (req, res) => {
    try {
      models = await Model.find({});

      res.status(200).send(models);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  dynamicRouter.get(
    `/${modelName}/getOne/:id`,
    middlewares,
    async (req, res) => {
      try {
        models = await Model.findById(req.params.id);

        if (models) {
          res.status(200).send(models);
        } else {
          res.status(404).send("Not found");
        }
      } catch (error) {
        res.status(500).send(error);
      }
    }
  );

  // Update
  dynamicRouter.put(
    `/${modelName}/update/:id`,
    middlewaresPost,
    async (req, res) => {
      console.log("5555555555");

      try {
        console.log(req.params.id);
        console.log(req.body);
        const model = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!model) {
          return res.status(404);
        }

        return res.status(200).send(model);
      } catch (error) {
        return res.status(400).send(error);
      }
    }
  );

  // Delete
  dynamicRouter.delete(
    `/${modelName}/delete/:id`,
    middlewaresPost,
    async (req, res) => {
      try {
        const model = await Model.findByIdAndDelete(req.params.id);
        if (!model) {
          return res.status(404).send();
        }
        res.status(200).send(model);
      } catch (error) {
        res.status(500).send(error);
      }
    }
  );
});

module.exports = dynamicRouter;
