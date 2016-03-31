'use strict';

module.exports = function(sequelize, DataTypes) {
    var Vote = sequelize.define('Vote', {
        type: {
            type: DataTypes.ENUM('upvote', 'downvote'),
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                Vote.belongsTo(models.User,
                        { foreignKey: { allowNull: false, unique: 'compositeIndex' } });
                Vote.belongsTo(models.Entry,
                        { foreignKey: { allowNull: false, unique: 'compositeIndex' } });
            }
        }
    });

    return Vote;
};
