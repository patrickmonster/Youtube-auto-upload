const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('live_stream_upload_state', {
    index_count: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    twitch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "트위치 고유 id (비디오 정보 수신용)",
      unique: "twitch_id"
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_upload: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "0",
      comment: "업로드 여부"
    },
    upload_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "동영상 id"
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'live_stream_upload_state',
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
