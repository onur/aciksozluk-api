module.exports = function(sequelize, DataTypes) {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'id',
            field: 'id'
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: 'user name',
            validate: {
                notEmpty: true
            },
            field: 'user_name'
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                isEmail: true
            },
            comment: 'user e-mail address',
            field: 'email'
        },
        gender: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['male', 'female'],
            comment: 'user gender',
            field: 'gender'
        },
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: true,
                isAfter: '1900-01-01'
            },
            comment: 'user birth date. date must be greater than 01.01.1900',
            field: 'birthDate'
        },
        // LOL plaintext, bir auth yöntemine karar verelim, değiştiririz.
        password: {
            type: DataTypes.STRING(15),
            allowNull: false,
            validate: {
                is: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,10}'
            },
            comment: 'minimum 8 and maximum 10 characters, at least 1 Uppercase 1 lowercase'+
                     ' 1 number and 1 special character',
            field: 'password',
            set:  function(v) {
                //hash algoirtmasının belirlenmesi lazım.
                this.setDataValue('password', v);
            }
        },
        lastLoginDate: {
            type: DataTypes.DATE, //timestamps
            allowNull: true,
            validate: {
                isDate: true
            },
            comment: 'user last login time',
            field: 'last_login_date'
        }
    }, {
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'user'
    });
};
