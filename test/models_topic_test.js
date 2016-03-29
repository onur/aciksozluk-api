'use strict';

var expect = require('chai').expect;

describe('models/topic', function() {

    beforeEach(function(done) {
        // disable logging for tests
        // it's getting extremely explicit
        // you can turn on logging by commenting out next line
        require('../models').sequelize.options.logging = false;

        this.testData = {
            title: 'Example Topic'
        };

        var models = require('../models');

        this.Topic = models.Topic;
        this.Category = models.Category;
        models.sequelize.sync({ force: true }).then(function() {
            done();
        });
    });


    describe('create', function() {
        it('creates a topic', function() {
            return this.Topic.create(this.testData).bind(this).then(function(topic) {
                expect(topic.title).to.equal(this.testData.title);
                expect(topic.slug).to.equal('example-topic');
                expect(topic.entryCount).to.equal(0);
            });
        });

        it('fails if title is not unique', function() {
            return this.Topic.create(this.testData).bind(this).then(function() {
                this.Topic.create(this.testData).catch(function(error) {
                    expect(error.name).to.equal('SequelizeUniqueConstraintError');
                });
            });
        });
    });



    it('may belongs to categories', function() {
        return this.Topic.create(this.testData).bind(this).then(function(topic) {
            return this.Category.create(this.testData).bind(this).then(function(category) {
                return topic.addCategory(category).bind(this).then(function() {
                    return topic.getCategories().bind(this).then(function(categories) {
                        expect(categories).to.have.length.of.at.least(1);
                        expect(categories[0].title).to.equal(this.testData.title);
                    });
                });
            });
        });
    });
});
