module.exports = (sequelize, DataTypes) => {
    const Certificate = sequelize.define('Certificate', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      course_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      issued_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  
    Certificate.associate = (models) => {
      Certificate.belongsTo(models.User, { foreignKey: 'user_id' });
      Certificate.belongsTo(models.Course, { foreignKey: 'course_id' });
    };
  
    return Certificate;
};  