module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    module_id: { type: DataTypes.UUID },
    title: { type: DataTypes.STRING, allowNull: false },
  }, { timestamps: true });

  Test.associate = (models) => {
    Test.belongsTo(models.Module, { foreignKey: 'module_id' });
  };

  return Test;
};