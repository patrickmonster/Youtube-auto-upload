const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('live_stream_upload', {
    user_uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      comment: "youtube 토큰",
      references: {
        model: 'users',
        key: 'user_uuid'
      }
    },
    twitch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "트위치 고유 id",
      unique: "twitch_id"
    },
    context: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "사용자 자동 제목 형식"
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "잔여 횟수"
    }
  }, {
    sequelize,
    tableName: 'live_stream_upload',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_uuid" },
        ]
      },
      {
        name: "twitch_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "twitch_id" },
        ]
      },
    ]
  });
};
