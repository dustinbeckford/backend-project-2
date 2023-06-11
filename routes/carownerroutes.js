const express = require("express");
const router = express.Router();
const { CarOwners } = require("../models");
const bcrypt = require("bcrypt");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const cookieParser = require("cookie-parser")
const { Cars } = require("../models");


router.use(cookieParser())
// Create a new car owner
router.post("/create_owners", async (req, res) => {
  const { name, car, sponsors, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCarOwner = await CarOwners.create({
      name: name,
      car: car,
      sponsors: sponsors,
      username: username,
      password: hashedPassword,
    });
    res.status(201).json(newCarOwner);
  } catch (error) {
    res.status(500).json({ error: "Failed to create car owner" });
  }
});

// Get all car owners
router.get("/get_all_owners", async (req, res) => {
  try {
    const carOwners = await CarOwners.findAll();
    res.json(carOwners);
  } catch (error) {
    res.status(500).json({ error: "Failed to get car owners" });
  }
});

// Get a single car owner by ID
router.get("/get_owners_by/:id", async (req, res) => {
  const carOwnerId = req.params.id;
  try {
    const carOwner = await CarOwners.findByPk(carOwnerId);
    if (carOwner) {
      res.json(carOwner);
    } else {
      res.status(404).json({ error: "Car owner not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get car owner" });
  }
});

// Update a car owner
router.put("/update_owner_by/:id", async (req, res) => {
  const carOwnerId = req.params.id;
  const { name, car, sponsors, username, password } = req.body;
  try {
    const carOwner = await CarOwners.findByPk(carOwnerId);
    if (carOwner) {
      const hashedPassword = await bcrypt.hash(password, 10);
      carOwner.name = name;
      carOwner.car = car;
      carOwner.sponsors = sponsors;
      carOwner.username = username;
      carOwner.password = hashedPassword;
      await carOwner.save();
      res.json(carOwner);
    } else {
      res.status(404).json({ error: "Car owner not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update car owner" });
  }
});

// Delete a car owner
router.delete("/delete_owner_by/:id", async (req, res) => {
  const carOwnerId = req.params.id;
  try {
    const carOwner = await CarOwners.findByPk(carOwnerId);
    if (carOwner) {
      await carOwner.destroy();
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "Car owner not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete car owner" });
  }
});

// Dashboard Route
router.get("/dashboard", cookieJwtAuth, async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in user's ID

    const cars = await Cars.findAll({
      where: {
        ownerId: userId,
      },
    });
    const carOwner = await CarOwners.findByPk(userId); // Fetch car owner information for the logged-in user
    res.render("dashboard/dashboard.ejs", {
      cars: cars,
      carOwners: [carOwner], // Wrap carOwner in an array
    });
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
});

module.exports = router;