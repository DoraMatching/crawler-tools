'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class articleModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  articleModel.init({
    title: DataTypes.STRING,
    path: DataTypes.STRING,
    tags: DataTypes.STRING,
    htmlContent: DataTypes.STRING,
    textContent: DataTypes.STRING,
    from: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'articleModel',
  });
  return articleModel;
};