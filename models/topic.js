'use strict';

var slug = require('../helpers/slug');

module.exports = function(sequelize, DataTypes) {
    var Topic = sequelize.define('Topic', {
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
            allowNull: false
        },
        entryCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        dailyEntryCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        voteCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        dailyVoteCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                Topic.belongsToMany(models.Category, { through: 'TopicCategories' });
                Topic.hasMany(models.Entry, { foreignKey: { allowNull: false } });
            }
        }
    });

    return Topic;
};
