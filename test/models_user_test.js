'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');

var models = require('../models');
var User = models.User;
var Topic = models.Topic;

describe('models/user', function() {
    var testData = {
        username: 'aciksozluk',
        email: 'aciksozluk@aciksozluk.com',
        password: 'myUberPassword)__(*&*44234!!@'
    };

    // disable logging for tests
    // it's getting extremely explicit
    // you can turn on logging by commenting out next line
    models.sequelize.options.logging = false;

    beforeEach(function(done) {
        models.sequelize.sync({ force: true }).then(function(result) { // eslint-disable-line
            done();
        }).catch(done);
    });

    describe('create', function() {
        it('creates a user', function(done) {
            User.create(testData).then(function(user) {
                expect(user.username).to.equal('aciksozluk');
                expect(user.email).to.equal('aciksozluk@aciksozluk.com');
                expect(user.passwordHash).to.be.ok;

                done();
            }).catch(done);
        });


        it('hashes password', function(done) {
            User.create(testData).then(function(user) {
                expect(user.passwordHash).to.be.ok;
                expect(user.passwordHash).to.not.equal(testData.password);

                done();
            }).catch(done);
        });


        it('fails if username is not unique', function(done) {
            Promise.all([
                User.create(testData),
                User.create({
                    username: testData.username,
                    email: 'anotheremail@example.com',
                    password: testData.password
                })
            ]).catch(function(error) {
                expect(error.name).to.equal('SequelizeUniqueConstraintError');
                expect(error.errors).to.be.ok;
                expect(error.errors[0].message).to.equal('username must be unique');
                expect(error.errors[0].path).to.equal('username');

                done();
            });
        });


        it('fails if email is not unique', function(done) {
            Promise.all([
                User.create(testData),
                User.create({
                    username: 'anotherusername',
                    email: testData.email,
                    password: testData.password
                })
            ]).catch(function(error) {
                expect(error.name).to.equal('SequelizeUniqueConstraintError');
                expect(error.errors).to.be.ok;
                expect(error.errors[0].message).to.equal('email must be unique');
                expect(error.errors[0].path).to.equal('email');

                done();
            });
        });


        it('fails if username is not alphanumeric', function(done) {
            User.create({
                username: 'SSSEere43@#@#@$##%##$',
                email: testData.email,
                password: testData.password
            }).catch(function(error) {
                expect(error.name).to.equal('SequelizeValidationError');
                expect(error.errors).to.be.ok;
                expect(error.errors[0].message).to.equal('Validation isAlphanumeric failed');
                expect(error.errors[0].path).to.equal('username');

                done();
            });
        });


        it('fails if email is not an email', function(done) {
            User.create({
                username: testData.username,
                email: 'notAnEmail',
                password: testData.password
            }).catch(function(error) {
                expect(error.name).to.equal('SequelizeValidationError');
                expect(error.errors).to.be.ok;
                expect(error.errors[0].message).to.equal('Validation isEmail failed');
                expect(error.errors[0].path).to.equal('email');

                done();
            });
        });


        it('fails if password length is less than 6 characters', function(done) {
            Promise.all([
                User.create(testData),
                User.create({
                    username: 'anotheruser',
                    email: 'anotheremail@email.com',
                    password: '12345'
                })
            ]).catch(function(error) {
                expect(error.name).to.equal('SequelizeValidationError');
                done();
            });
        });


        it('fails if password is not provided', function(done) {
            User.create({
                username: testData.username,
                email: testData.email
            }).catch(function(error) {
                expect(error.name).to.equal('SequelizeValidationError');
                expect(error.errors[0].path).to.equal('passwordHash');

                done();
            });
        });


        it('fails if username is not provided', function(done) {
            User.create({
                email: testData.email,
                password: testData.password
            }).catch(function(error) {
                expect(error.name).to.equal('SequelizeValidationError');
                expect(error.errors[0].path).to.equal('username');

                done();
            });
        });


        it('fails if email is not provided', function(done) {
            User.create({
                username: testData.username,
                password: testData.password
            }).catch(function(error) {
                expect(error.name).to.equal('SequelizeValidationError');
                expect(error.errors[0].path).to.equal('email');

                done();
            });
        });


        it('sets default values', function(done) {
            User.create(testData).then(function(user) {
                expect(user.registrationDate).to.be.ok;
                expect(Date.now() - 2000 <= Date.parse(user.registrationDate)).to.be.true;
                expect(user.karma).to.equal(0);

                done();
            });
        });
    });


    describe('user', function() {
        var testUser, testTopic;

        beforeEach(function(done) {
            Promise.props({
                user: User.create(testData),
                topic: Topic.create({
                    title: 'example topic'
                })
            }).then(function(results) {
                testUser = results.user;
                testTopic = results.topic;

                done();
            });
        });


        it('compares plaintext password with passwordHash', function() {
            var comparison = testUser.comparePassword(testData.password);
            expect(comparison).to.be.true;
        });


        it('can create entries', function(done) {
            testUser.createEntry({
                content: 'test entry',
                TopicId: testTopic.id
            }).then(function(entry) {
                expect(entry).to.be.ok;

                done();
            });
        });


        it('can vote for entries', function(done) {
            Promise.all([
                testUser.createEntry({
                    content: 'test entry',
                    TopicId: testTopic.id
                }),
                Promise.promisify(function(entry) {
                    return testUser.createVote({
                        type: 'upvote',
                        EntryId: entry.id
                    });
                })
            ]).then(function(vote) {
                expect(vote).to.be.ok;

                done();
            });
        });
    });
});
