module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    question_id: { type: DataTypes.UUID },
    answer_text: { type: DataTypes.TEXT, allowNull: false },
    is_correct: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { timestamps: true });

  Answer.associate = (models) => {
    Answer.belongsTo(models.Question, { foreignKey: 'question_id' });
  };

  return Answer;
};