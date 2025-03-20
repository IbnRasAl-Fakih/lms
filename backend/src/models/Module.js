module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define('Module', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    course_id: { type: DataTypes.UUID },
    title: { type: DataTypes.STRING, allowNull: false },
  }, { timestamps: true });

  Module.associate = (models) => {
    Module.belongsTo(models.Course, { foreignKey: 'course_id' });
  };

  return Module;
};