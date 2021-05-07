const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('live_on_servers', {
    target: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      comment: "권한전용채널"
    },
    parent: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "서버",
      unique: "parent"
    }
  }, {
    sequelize,
    tableName: 'live_on_servers',
    hasTrigger: true,
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "target" },
        ]
      },
      {
        name: "parent",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "parent" },
        ]
      },
    ]
  });
};
