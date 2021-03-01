module.exports = (sequelize, DataTypes) => {
  return sequelize.define("dish", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name_dish:{
        type: DataTypes.STRING(50),
        allowNull: false
    },
    price:{
        type: DataTypes.DECIMAL(6,2),
        allowNull: false,
        notNull: true
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: false
    }
  });
};
