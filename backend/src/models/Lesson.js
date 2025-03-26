module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true 
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title:{
      type: DataTypes.STRING,
      allowNull: false 
    },
    content_type: {
      type: DataTypes.ENUM('text', 'video', 'document'),
      allowNull: false
    },
    content_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    content_text: {
      type: DataTypes.TEXT
    },
  }, { timestamps: true });

  Lesson.associate = (models) => {
    Lesson.belongsTo(models.Module, { foreignKey: 'module_id' });
  };

  return Lesson;
};