'use strict';

module.exports = function(sequelize, DataTypes) {

    var createRevisionHook = function(entry) {
        return entry.createRevision({ content: entry.content });
    };

    var Entry = sequelize.define('Entry', {
        content: {
            type: DataTypes.STRING(50000),
            allowNull: false,
            set: function(val) {
                // TODO: render content here
                this.setDataValue('content', val);
                this.setDataValue('contentRendered', val);
                this.setDataValue('contentRenderedPlain', val);
            }
        },
        contentRendered: {
            type: DataTypes.STRING(60000),
            allowNull: false
        },
        contentRenderedPlain: {
            type: DataTypes.STRING(60000),
            allowNull: false
        },
        votes: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                Entry.belongsTo(models.User, { foreignKey: { allowNull: false } });
                Entry.belongsTo(models.Topic, { foreignKey: { allowNull: false } });
                Entry.hasMany(models.Revision, { foreignKey: { allowNull: false } });
            }
        },
        hooks: {
            afterCreate: createRevisionHook,
            afterUpdate: createRevisionHook
        }
    });

    return Entry;
};
