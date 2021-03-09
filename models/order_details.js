module.exports = (sequelize, DataTypes) => {
  return sequelize.define("order_detail", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    dish_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
      notNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      require: true,
    },
    total: { type: DataTypes.DECIMAL(6, 2), allowNull: false, notNull: true },
  });
};
