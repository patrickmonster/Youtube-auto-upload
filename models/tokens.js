const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tokens', {
    user_uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_uuid'
      }
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "유효코드(호출빈도가 낮기 때문에 무의미함)"
    },
    expires_in: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "잔여시간"
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    target: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "youtube\/twitch"
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "권한 범위"
    }
  }, {
    sequelize,
    tableName: 'tokens',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "refresh_token", length: 100 },
        ]
      },
      {
        name: "user_uuid",
        using: "BTREE",
        fields: [
          { name: "user_uuid" },
        ]
      },
    ]
  });
};
