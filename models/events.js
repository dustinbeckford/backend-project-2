/** @format */

// models/Events.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Events extends Model {
		static associate(models) {
			Events.belongsTo(models.CarOwners, { foreignKey: "ownerId" });
		}
	}

	Events.init(
		{
			ownerId: {
				type: DataTypes.INTEGER,
			},
			locations: {
				type: DataTypes.STRING,
			},
			date: {
				type: DataTypes.DATE,
			},
			createdAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
		},
		{
			sequelize,
			modelName: "Events",
		}
	);

	return Events;
};
