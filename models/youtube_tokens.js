const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('youtube_tokens', {
    youtube_id: {
      type: DataTypes.CHAR(24),
      allowNull: false
    },
    youtube_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    expires_in: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "잔여시간"
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "refresh_token"
    }
  }, {
    sequelize,
    tableName: 'youtube_tokens',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "refresh_token",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "refresh_token", length: 103 },
        ]
      },
    ]
  });
};
