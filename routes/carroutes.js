/** @format */

const express = require("express");
const router = express.Router();
const { Car, CarOwners } = require("../models");

// Create a new car
router.post("/cars", async (req, res) => {
	const { make, model, year, type, ownerId } = req.body;
	try {
		const newCar = await Car.create({
			make: make,
			model: model,
			year: year,
			type: type,
			ownerId: ownerId,
		});
		res.status(201).json(newCar);
	} catch (error) {
		res.status(500).json({ error: "Failed to create car" });
	}
});

// Get all cars
router.get("/cars", async (req, res) => {
	try {
		const cars = await Car.findAll({
			include: [{ model: CarOwners }],
		});
		res.json(cars);
	} catch (error) {
		res.status(500).json({ error: "Failed to get cars" });
	}
});

// Get a single car by ID
router.get("/cars/:id", async (req, res) => {
	const carId = req.params.id;
	try {
		const car = await Car.findByPk(carId, {
			include: [{ model: CarOwners }],
		});
		if (car) {
			res.json(car);
		} else {
			res.status(404).json({ error: "Car not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Failed to get car" });
	}
});

// Update a car
router.put("/cars/:id", async (req, res) => {
	const carId = req.params.id;
	const { make, model, year, type, ownerId } = req.body;
	try {
		const car = await Car.findByPk(carId);
		if (car) {
			car.make = make;
			car.model = model;
			car.year = year;
			car.type = type;
			car.ownerId = ownerId;
			await car.save();
			res.json(car);
		} else {
			res.status(404).json({ error: "Car not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Failed to update car" });
	}
});

// Delete a car
router.delete("/cars/:id", async (req, res) => {
	const carId = req.params.id;
	try {
		const car = await Car.findByPk(carId);
		if (car) {
			await car.destroy();
			res.sendStatus(204);
		} else {
			res.status(404).json({ error: "Car not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Failed to delete car" });
	}
});

module.exports = router;
