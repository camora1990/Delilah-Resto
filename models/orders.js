module.exports = (sequelize, DataTypes) => {
  return sequelize.define("order", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    order_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      isIn: [
        ["NEW", "CONFIRMED", "PREPARING", "SENT", "CANCELLED", "DELIVERED"],
      ],
      defaultValue: "NEW",
    },
    payment_method: {
      type: DataTypes.STRING(20),
      allowNull: false,
      isIn: [["CARD", "CASH"]],
    },
  });
};
