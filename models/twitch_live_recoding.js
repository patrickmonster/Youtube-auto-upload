'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class twitch_live_recoding extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  twitch_live_recoding.init({
    login: DataTypes.TEXT,
    commant: DataTypes.TEXT,
    title: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'twitch_live_recoding',
  });
  return twitch_live_recoding;
};