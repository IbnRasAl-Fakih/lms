module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'instructor', 'student'),
      defaultValue: 'student',
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, { timestamps: true });

  User.associate = (models) => {
    User.belongsToMany(models.Course, {
      through: models.Enrollment,
      foreignKey: 'user_id',
      otherKey: 'course_id',
      as: 'enrolledCourses'
    });
    User.hasMany(models.Course, { foreignKey: 'created_by', as: 'createdCourses' });
  };

  return User;
};
