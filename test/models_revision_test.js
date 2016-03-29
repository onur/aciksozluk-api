
var expect = require('chai').expect;

describe('models/revision', function() {

    beforeEach(function(done) {
        var models = require('../models');

        // disable logging for tests
        // it's getting extremely explicit
        // you can turn on logging by commenting out next line
        models.sequelize.options.logging = false;

        this.Revision = models.Revision;

        // create a test user and entry to use in all tests
        models.sequelize.sync({ force: true }).bind(this).then(function() {
            models.User.create({
                username: 'example',
                password: 'example',
                email: 'example@example.org'
            }).bind(this).then(function(user) {
                user.createEntry({ content: 'Test' }).bind(this).then(function(entry) {
                    this.entry = entry;
                    done();
                });
            });
        });
    });


    describe('create', function() {
        it('creates a revision', function() {
            return this.Revision.create({
                content: 'test revision content',
                EntryId: this.entry.id
            }).then(function(revision) {
                expect(revision).to.be.ok;
            });
        });


        it('fails to create a revision if there is no entry', function() {
            return this.Revision.create({
                content: 'test revision content'
            }).catch(function(err) {
                expect(err.name).to.equal('SequelizeValidationError');
            });
        });


        it('sets revision times', function() {
            return this.Revision.create({
                content: 'test revision content',
                EntryId: this.entry.id
            }).then(function(revision) {
                expect(revision.createdAt).to.be.ok;
            });
        });
    });
});
