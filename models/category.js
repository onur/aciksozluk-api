
'use strict';

var slug = require('../helpers/slug');

module.exports = function(sequelize, DataTypes) {
    var Category = sequelize.define('Category', {
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            set: function(val) {
                this.setDataValue('title', val);
                this.setDataValue('slug', slug(val));
            }
        },
        slug: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING(500)
        }
    }, {
        classMethods: {
            associate: function(models) {
                Category.belongsToMany(models.Topic, { through: 'TopicCategories' });
            }
        }
    });

    return Category;
};
