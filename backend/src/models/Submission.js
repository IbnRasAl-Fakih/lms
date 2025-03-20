module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define('Submission', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID },
    test_id: { type: DataTypes.UUID },
    score: { type: DataTypes.INTEGER },
  }, { timestamps: true });

  Submission.associate = (models) => {
    Submission.belongsTo(models.User, { foreignKey: 'user_id' });
    Submission.belongsTo(models.Test, { foreignKey: 'test_id' });
  };

  return Submission;
};