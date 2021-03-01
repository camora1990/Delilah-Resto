module.exports = (sequelize, DataTypes)=>{
    return sequelize.define('order_detail',{
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
    })
}