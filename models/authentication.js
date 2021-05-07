const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('authentication', {
    code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    index_count: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "탐색용 index"
    },
    id: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      comment: "디스코드 고유 id",
      unique: "id"
    },
    youtube_token_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "유저 정보",
      unique: "user_uuid"
    },
    twitch_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "트위치 고유 id"
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'authentication',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "index_count" },
        ]
      },
      {
        name: "id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_uuid",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "youtube_token_id" },
        ]
      },
    ]
  });
};
