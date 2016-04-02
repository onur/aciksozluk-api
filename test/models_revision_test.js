
var expect = require('chai').expect;
var Promise = require('bluebird');

var models = require('../models');
var User = models.User;
var Topic = models.Topic;
var Revision = models.Revision;

describe('models/revision', function() {

    var testEntry;

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
                return results.user.createEntry({
                    content: 'Test',
                    TopicId: results.topic.id
                });
            }).then(function(entry) {
                testEntry = entry;

                done();
            });
        });
    });


    describe('create', function() {
        it('creates a revision', function(done) {
            Revision.create({
                content: 'test revision content',
                EntryId: testEntry.id
            }).then(function(revision) {
                expect(revision).to.be.ok;

                done();
            });
        });


        it('fails to create a revision if there is no entry', function(done) {
            Revision.create({
                content: 'test revision content'
            }).catch(function(err) {
                expect(err.name).to.equal('SequelizeValidationError');

                done();
            });
        });


        it('sets revision times', function(done) {
            Revision.create({
                content: 'test revision content',
                EntryId: testEntry.id
            }).then(function(revision) {
                expect(revision.createdAt).to.be.ok;

                done();
            });
        });
    });
});
