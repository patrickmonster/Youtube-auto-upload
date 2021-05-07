const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('live_on_channels', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "id값",
      references: {
        model: 'live_on_monits',
        key: 'user_name'
      }
    },
    target_channel: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "알림채널"
    }
  }, {
    sequelize,
    tableName: 'live_on_channels',
    hasTrigger: true,
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
        name: "user_name",
        using: "BTREE",
        fields: [
          { name: "user_name" },
        ]
      },
    ]
  });
};
