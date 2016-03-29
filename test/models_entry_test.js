'use strict';

var expect = require('chai').expect;

describe('models/entry', function() {

    beforeEach(function(done) {
        var models = require('../models');

        // disable logging for tests
        // it's getting extremely explicit
        // you can turn on logging by commenting out next line
        models.sequelize.options.logging = false;

        this.Entry = models.Entry;

        // create a test user to use in all tests
        models.sequelize.sync({ force: true }).bind(this).then(function() {
            models.User.create({
                username: 'example',
                password: 'example',
                email: 'example@example.org'
            }).bind(this).then(function(user) {
                this.user = user;
                done();
            });
        });
    });


    describe('create', function() {
        it('creates an entry', function() {
            return this.Entry.create({
                content: 'test content',
                UserId: this.user.id
            }).bind(this).then(function(entry) {
                expect(entry).to.be.ok;
            });
        });


        it('fails if UserId is not supplied', function() {
            return this.Entry.create({
                content: 'test content'
            }).catch(function(err) {
                expect(err.name).to.equal('SequelizeValidationError');
            });
        });


        it('creates a revision', function() {
            return this.Entry.create({
                content: 'test content',
                UserId: this.user.id
            }).bind(this).then(function(entry) {
                return entry.getRevisions().bind(this).then(function(revisions) {
                    expect(revisions).to.be.ok;
                    expect(revisions).to.have.lengthOf(1);
                    expect(revisions[0].content).to.equal('test content');
                });
            });
        });


        // TODO: Add contentRendered and contentRenderedPlain tests

    });


    it('creates a revision on update', function() {
        return this.Entry.create({
            content: 'test content',
            UserId: this.user.id
        }).bind(this).then(function(entry) {
            // update must create another revision
            return entry.update({
                content: 'another test content'
            }).then(function(entry) {
                return entry.getRevisions().then(function(revisions) {
                    expect(revisions).to.be.ok;
                    expect(revisions).to.have.lengthOf(2);
                    expect(revisions[1].content).to.equal('another test content');
                });
            });
        });
    });

});
