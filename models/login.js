const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('account', {
    username:   {
      type:      Sequelize.DataTypes.STRING,
      allowNull: false
    },
    password:   {
      type:      Sequelize.DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type:         Sequelize.DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    },
    updated_at: {
      type:         Sequelize.DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    },
  })
};
