/** @format */

// models/CarOwners.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class CarOwners extends Model {
		static associate(models) {
			CarOwners.hasMany(models.Cars, { foreignKey: "ownerId" });
			CarOwners.hasMany(models.Events, { foreignKey: "ownerId" });
		}
	}

	CarOwners.init(
		{
			username: {
				type: DataTypes.STRING,
			},
			name: {
				type: DataTypes.STRING,
			},
			password: {
				type: DataTypes.STRING,
			},
			car: {
				type: DataTypes.STRING,
			},
			sponsors: {
				type: DataTypes.STRING,
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
			modelName: "CarOwners",
		}
	);

	return CarOwners;
};
