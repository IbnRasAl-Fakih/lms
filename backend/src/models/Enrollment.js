module.exports = (sequelize, DataTypes) => {
    const Enrollment = sequelize.define('Enrollment', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      course_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      enrolled_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });

    Enrollment.associate = (models) => {
        Enrollment.belongsTo(models.User, {
          foreignKey: 'user_id',
          as: 'student'
        });
      
        Enrollment.belongsTo(models.Course, {
          foreignKey: 'course_id',
          as: 'course'
        });
      };
  
    return Enrollment;
};
  