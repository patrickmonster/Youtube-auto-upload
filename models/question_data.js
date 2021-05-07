const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('question_data', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_code: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "사용자 확인 코드"
    },
    target: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "출발지"
    },
    context: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "내용"
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "작성시간"
    },
    is_yn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'question_data',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
