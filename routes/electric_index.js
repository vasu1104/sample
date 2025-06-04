const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ElectricModel = require("../models/ElectricModel");

router.use(express.static("public"));

// ✅ GET Electric Cars
router.get("/", async function (req, res) {
  let electric_models = await ElectricModel.find();
  res.render("electric_index.hbs", { models: electric_models });
});

// ✅ GET Filtering Electric Cars
router.get("/filter", async function (req, res) {
  let filtered_models;
  const sortBy = req.query.sortBy;

  if (sortBy == "latest") {
    filtered_models = await ElectricModel.find().sort({ year: -1 });
  } else if (sortBy == "highprice") {
    filtered_models = await ElectricModel.find().sort({ price: -1 });
  } else if (sortBy == "lowprice") {
    filtered_models = await ElectricModel.find().sort({ price: 1 });
  } else if (sortBy == "highrange") {
    filtered_models = await ElectricModel.find().sort({ range: -1 });
  } else if (sortBy == "lowrange") {
    filtered_models = await ElectricModel.find().sort({ range: 1 });
  } else if (sortBy == "highperf") {
    filtered_models = await ElectricModel.find().sort({ time60: 1 });
  } else if (sortBy == "lowperf") {
    filtered_models = await ElectricModel.find().sort({ time60: -1 });
  }

  const priceBy = req.query.priceBy;
  if (priceBy != undefined) {
    const priceLt = priceBy.slice(5) + "00000";
    filtered_models = await ElectricModel.find({ price: { $lte: priceLt } }).sort({ price: -1 });
  }

  const year = req.query.year?.slice(4);
  if (year) filtered_models = await ElectricModel.find({ year });

  const yearLt = req.query.yearLt?.slice(4);
  if (yearLt) filtered_models = await ElectricModel.find({ year: { $lte: yearLt } });

  const rangeLt = req.query.rangeLt;
  if (rangeLt) {
    filtered_models = await ElectricModel.find({ range: { $lte: rangeLt } }).sort({ range: -1 });
  }

  res.render("electric_index.hbs", { models: filtered_models });
});

// ✅ GET Booked Model
router.get("/booknow/:id", async function (req, res) {
  const modelid = req.params.id;
  const booked_model = await ElectricModel.findById(modelid);
  res.render("booking.hbs", { model: booked_model });
});

router.get("/filter/booknow/:id", async (req, res) => {
  res.redirect("/electric/booknow/" + req.params.id);
});

module.exports = router;
