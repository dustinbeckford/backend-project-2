/** @format */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Events } = require("../models");

// Create a new event
router.post("/create_events", async (req, res) => {
	const { name, date, locations, ownerId } = req.body;
	const newEvent = await Events.create({
		name: name,
		date: date,
		locations: locations,
		ownerId: ownerId,
	});
	res.send(newEvent);
});

// Get all events
router.get("/events", async (req, res) => {
	try {
		const events = await Event.findAll();
		res.json(events);
	} catch (error) {
		res.status(500).json({ error: "Failed to get events" });
	}
});

// Get a single event by ID
router.get("/events/:id", async (req, res) => {
	const eventId = req.params.id;
	try {
		const event = await Event.findByPk(eventId);
		if (event) {
			res.json(event);
		} else {
			res.status(404).json({ error: "Event not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Failed to get event" });
	}
});

// Update an event
router.put("/events/:id", async (req, res) => {
	const eventId = req.params.id;
	const { name, date, location } = req.body;
	try {
		const event = await Event.findByPk(eventId);
		if (event) {
			event.name = name;
			event.date = date;
			event.location = location;
			await event.save();
			res.json(event);
		} else {
			res.status(404).json({ error: "Event not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Failed to update event" });
	}
});

// Delete an event
router.delete("/events/:id", async (req, res) => {
	const eventId = req.params.id;
	try {
		const event = await Event.findByPk(eventId);
		if (event) {
			await event.destroy();
			res.sendStatus(204);
		} else {
			res.status(404).json({ error: "Event not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Failed to delete event" });
	}
});

module.exports = router;
