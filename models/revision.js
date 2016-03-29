'use strict';

module.exports = function(sequelize, DataTypes) {
    var Revision = sequelize.define('Revision', {
        content: {
            type: DataTypes.STRING(50000),
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                Revision.belongsTo(models.Entry, { foreignKey: { allowNull: false } });
            }
        }
    });

    return Revision;
};
