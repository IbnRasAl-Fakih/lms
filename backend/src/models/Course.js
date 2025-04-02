module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    category: {
      type: DataTypes.STRING
    },
    background_image_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_by: {
      type: DataTypes.UUID
    }
  }, { timestamps: true });

  Course.associate = (models) => {
    Course.belongsTo(models.User, { foreignKey: 'created_by', as: 'instructor' });
    Course.belongsToMany(models.User, {
      through: models.Enrollment,
      foreignKey: 'course_id',
      otherKey: 'user_id',
      as: 'students'
    });
  };

  return Course;
};