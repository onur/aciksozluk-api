'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');

var models = require('../models');
var Topic = models.Topic;
var User = models.User;
var Entry = models.Entry;

describe('models/entry', function() {
    var testUser, testTopic, testData;

    // disable logging for tests
    // it's getting extremely explicit
    // you can turn on logging by commenting out next line
    models.sequelize.options.logging = false;

    beforeEach(function(done) {
        models.sequelize.sync({ force: true }).then(function() {
            Promise.props({
                user: User.create({
                    username: 'example',
                    password: 'example',
                    email: 'example@example.org'
                }),
                topic: Topic.create({
                    title: 'example topic'
                })
            }).then(function(results) {
                testUser = results.user;
                testTopic = results.topic;
                
                testData = {
                    content: 'test content',
                    UserId: testUser.id,
                    TopicId: testTopic.id
                };

                done();
            });
        });
    });


    describe('create', function() {
        it('creates an entry', function(done) {
            Entry.create(testData).then(function(entry) {
                expect(entry).to.be.ok;

                done();
            }).catch(done);
        });


        it('fails if UserId is not supplied', function(done) {
            Entry.create({
                content: 'test content'
            }).catch(function(err) {
                expect(err.name).to.equal('SequelizeValidationError');

                done();
            });
        });


        it('creates a revision', function(done) {
            Entry.create(testData)
                .then(function(entry) {
                    return entry.getRevisions();
                })
                .then(function(revisions) {
                    expect(revisions).to.be.ok;
                    expect(revisions).to.have.lengthOf(1);
                    expect(revisions[0].content).to.equal('test content');

                    done();
                });
        });


        it('saves ip in revision', function(done) {
            testData.ip = '127.0.0.1';
            Entry.create(testData).then(function(entry) {
                expect(entry.ip).to.equal('127.0.0.1');
                entry.getRevisions().then(function(revisions) {
                    expect(revisions).to.be.ok;
                    expect(revisions).to.have.lengthOf(1);
                    expect(revisions[0].content).to.equal('test content');
                    expect(revisions[0].ip).to.equal('127.0.0.1');

                    done();
                });
            });
        });


        // TODO: Add contentRendered and contentRenderedPlain tests

    });


    it('creates a revision on update', function(done) {
        Entry.create(testData).then(function(entry) {
            // update must create another revision
            entry.update({
                content: 'another test content'
            }).then(function(entry) {
                entry.getRevisions().then(function(revisions) {
                    expect(revisions).to.be.ok;
                    expect(revisions).to.have.lengthOf(2);
                    expect(revisions[1].content).to.equal('another test content');

                    done();
                });
            });
        });
    });

});
