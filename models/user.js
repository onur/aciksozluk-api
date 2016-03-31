'use strict';

var crypto = require('crypto');
var secret = require('../helpers/secret');


module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            },
            unique: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                isEmail: true
            },
            unique: true
        },
        gender: {
            type: DataTypes.ENUM,
            values: ['male', 'female']
        },
        birthDate: {
            type: DataTypes.DATEONLY,
            validate: {
                isDate: true,
                isAfter: '1900-01-01'
            }
        },
        passwordHash: {
            type: DataTypes.STRING(1024),
            allowNull: false
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                isLongEnough: function(val) {
                    if (val.length < 6) {
                        throw new Error('Choose longer password');
                    }
                }
            },
            set: function(plainText) {
                var hash = crypto.pbkdf2Sync(plainText, secret, 10000, 512, 'sha512');
                this.setDataValue('password', plainText);
                this.setDataValue('passwordHash', hash.toString('hex'));
            }
        },
        registrationDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        karma: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        lastLoginDate: {
            type: DataTypes.DATE, //timestamps
            validate: {
                isDate: true
            }
        }
    }, {
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Entry, { foreignKey: { allowNull: false } });
                User.hasMany(models.Vote, { foreignKey: { allowNull: false } });
            }
        },
        instanceMethods: {
            comparePassword: function(plainTextPassword) {
                return this.passwordHash === crypto.pbkdf2Sync(plainTextPassword,
                        secret, 10000, 512, 'sha512').toString('hex');
            }
        }
    });

    return User;
};
