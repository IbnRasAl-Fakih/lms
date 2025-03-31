module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    test_id: {
      type: DataTypes.UUID
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    question_type: {
      type: DataTypes.ENUM('single_choice', 'multiple_choice', 'text')
    },
  }, { timestamps: true });

  Question.associate = (models) => {
    Question.belongsTo(models.Test, { foreignKey: 'test_id' });
    Question.hasMany(models.Answer, { foreignKey: 'question_id', as: 'answers' });
  };

  return Question;
};