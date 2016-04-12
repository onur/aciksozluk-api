'use strict';

module.exports = function(sequelize, DataTypes) {

    var createRevisionHook = function(entry) {
        return entry.createRevision({
            content: entry.content,
            ip: entry.ip
        });
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
        ip: {
            type: DataTypes.STRING(45)
        },
        totalVoteCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        dailyVoteCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        weeklyVoteCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        monthlyVoteCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        yearlyVoteCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                Entry.belongsTo(models.User, { foreignKey: { allowNull: false } });
                Entry.belongsTo(models.Topic, { foreignKey: { allowNull: false } });
                Entry.hasMany(models.Vote, { foreignKey: { allowNull: false } });
                Entry.hasMany(models.Revision, { foreignKey: { allowNull: false } });
            }
        },
        hooks: {
            beforeCreate: function(entry) {
                entry.getTopic().then(function(topic) {
                    topic.increment('entryCount');
                });
            },
            afterCreate: createRevisionHook,
            afterUpdate: createRevisionHook
        }
    });

    return Entry;
};
