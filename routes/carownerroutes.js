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
router.post("/update_car_by/:id", async (req, res) => {
  const carId = req.params.id;
  console.log(req.body, "this is body")
  const { make,model,year,type} = req.body;
  console.log(make,model,year,type)
  try {
      const carToEdit = await Cars.findOne({
      
          where:{
            id:carId
          }
         });
      if(carToEdit){
        await carToEdit.set({
          make:make,
          model:model,
          year:year,
          type:type})
          await carToEdit.save()
          
        }
         res.redirect("/owner/dashboard")
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a car owner
router.post("/delete_car_by/:id", async (req, res) => {
  const carId = req.params.id;
  try {
    const car = await Cars.findByPk(carId);
    if (car) {
      await car.destroy();
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "Car owner not found" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to delete car owner" });
  }
});


router.post("/create_car_by/:id", async (req, res) => {
  const ownerId = req.params.id;
  console.log(ownerId)
  try {
    const carOwner = await CarOwners.findByPk(ownerId);
    console.log(carOwner)
    if (carOwner) {
      await car.create({id, make, model, year, type, ownerId});
      // res.render("create/create.ejs", { ownerId });
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "Car owner not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create car" });
  }
});


// Render the update form
router.get("/update_car/:id", async (req, res) => {
  const carId = req.params.id;
  try {
    const car = await Cars.findByPk(carId);
    if (car) {
      res.render("update/update.ejs", { car });
    } else {
      res.status(404).json({ error: "Car not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get car" });
  }
});

// Update a car
router.post("/update_car/:id", async (req, res) => {
  const carId = req.params.id;
  const { make, model, year, type, ownerId } = req.body;
  try {
    const car = await Cars.findByPk(carId);
    console.log(car)
    if (car) {
      car.make = make;
      car.model = model;
      car.year = year;
      car.type = type;
      car.ownerId = ownerId;
      await car.save();
      res.render("/update/update");
    } else {
      res.status(404).json({ error: "Car not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update car" });
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