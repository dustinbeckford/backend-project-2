/** @format */

"use strict";
const { Events } = require("pg");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Eventcarowners extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Eventcarowners.belongsTo(models.Events, { foreignKey: "eventid" });
			Eventcarowners.belongsTo(models.CarOwners, { foreignKey: "ownerid" });
		}
	}
	Eventcarowners.init(
		{
			eventid: DataTypes.INTEGER,
			ownerid: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Eventcarowners",
		}
	);
	return Eventcarowners;
};
