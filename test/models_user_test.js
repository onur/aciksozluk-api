
'use strict';

var expect = require('chai').expect;

describe('models/user', function() {

    beforeEach(function() {
        // disable logging for tests
        // it's getting extremely explicit
        // you can turn on logging by commenting out next line
        require('../models').sequelize.options.logging = false;

        var models = require('../models');

        this.testData = {
            username: 'aciksozluk',
            email: 'aciksozluk@aciksozluk.com',
            password: 'myUberPassword)__(*&*44234!!@'
        };
        this.User = models.User;
        return models.sequelize.sync({ force: true });
    });

    describe('create', function() {
        it('creates a user', function() {
            return this.User.create(this.testData).bind(this).then(function(user) {
                expect(user.username).to.equal('aciksozluk');
                expect(user.email).to.equal('aciksozluk@aciksozluk.com');
                expect(user.passwordHash).to.be.ok;
            });
        });


        it('hashes password', function() {
            return this.User.create(this.testData).bind(this).then(function(user) {
                expect(user.passwordHash).to.be.ok;
                expect(user.passwordHash).to.not.equal(this.testData.password);
            });
        });


        it('fails if username is not unique', function() {
            return this.User.create(this.testData).bind(this).then(function() {
                // create second user with same username
                return this.User.create({
                    username: this.testData.username,
                    email: 'anotheremail@example.com',
                    password: this.testData.password
                }).catch(function(error) {
                    expect(error.name).to.equal('SequelizeUniqueConstraintError');
                    expect(error.errors).to.be.ok;
                    expect(error.errors[0].message).to.equal('username must be unique');
                    expect(error.errors[0].path).to.equal('username');
                });
            });
        });


        it('fails if email is not unique', function() {
            return this.User.create(this.testData).bind(this).then(function() {
                // create second user with same username
                return this.User.create({
                    username: 'anotherusername',
                    email: this.testData.email,
                    password: this.testData.password
                }).catch(function(error) {
                    expect(error.name).to.equal('SequelizeUniqueConstraintError');
                    expect(error.errors).to.be.ok;
                    expect(error.errors[0].message).to.equal('email must be unique');
                    expect(error.errors[0].path).to.equal('email');
                });
            });
        });


        it('fails if username is not alphanumeric', function() {
            return this.User.create({
                username: 'SSSEere43@#@#@$##%##$',
                email: this.testData.email,
                password: this.testData.password
            }).catch(function(error) {
                expect(error.name).to.equal('SequelizeValidationError');
                expect(error.errors).to.be.ok;
                expect(error.errors[0].message).to.equal('Validation isAlphanumeric failed');
                expect(error.errors[0].path).to.equal('username');
            });
        });


        it('fails if email is not an email', function() {
            return this.User.create({
                username: this.testData.username,
                email: 'notAnEmail',
                password: this.testData.password
            }).catch(function(error) {
                expect(error.name).to.equal('SequelizeValidationError');
                expect(error.errors).to.be.ok;
                expect(error.errors[0].message).to.equal('Validation isEmail failed');
                expect(error.errors[0].path).to.equal('email');
            });
        });


        it('fails if password length is less than 6 characters', function() {
            // this should pass
            return this.User.create(this.testData).bind(this).then(function(user) {
                expect(user).to.be.ok;

                // this should fail
                return this.User.create({
                    username: 'anotheruser',
                    email: 'anotheremail@email.com',
                    password: '12345'
                }).catch(function(error) {
                    expect(error.name).to.equal('SequelizeValidationError');
                });
            });
        });


        it('fails if password is not provided', function() {
            return this.User.create({
                username: this.testData.username,
                email: this.testData.email
            }).catch(function(error) {
                expect(error.name).to.equal('SequelizeValidationError');
                expect(error.errors[0].path).to.equal('passwordHash');
            });
        });


        it('fails if username is not provided', function() {
            return this.User.create({
                email: this.testData.email,
                password: this.testData.password
            }).catch(function(error) {
                expect(error.name).to.equal('SequelizeValidationError');
                expect(error.errors[0].path).to.equal('username');
            });
        });


        it('fails if email is not provided', function() {
            return this.User.create({
                username: this.testData.username,
                password: this.testData.password
            }).catch(function(error) {
                expect(error.name).to.equal('SequelizeValidationError');
                expect(error.errors[0].path).to.equal('email');
            });
        });


        it('sets default values', function() {
            return this.User.create(this.testData).bind(this).then(function(user) {
                expect(user.registrationDate).to.be.ok;
                expect(Date.now() - 2000 <= Date.parse(user.registrationDate)).to.be.true;

                expect(user.karma).to.equal(0);
            });
        });
    });


    it('compares plaintext password with passwordHash', function() {
        return this.User.create(this.testData).bind(this).then(function(user) {
            var compare = user.comparePassword(this.testData.password);
            expect(compare).to.be.true;
        });
    });


    it('can create entries', function() {
        return this.User.create(this.testData).bind(this).then(function(user) {
            return user.createEntry({ content: 'test entry' }).bind(this).then(function(entry) {
                expect(entry).to.be.ok;
            });
        });
    });

});
