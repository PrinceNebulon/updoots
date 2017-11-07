module.exports = function(sequelize, DataTypes) {
	var Doot = sequelize.define('doot', {
		title: { type: DataTypes.STRING, allowNull: false },
		body: { type: DataTypes.TEXT, allowNull: false },
		author: { type: DataTypes.STRING(50), allowNull: false },
		upDoots: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
		downDoots: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
	});
	return Doot;
};