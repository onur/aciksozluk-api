
'use strict';

var expect = require('chai').expect;

describe('models/category', function() {

    beforeEach(function(done) {
        // disable logging for tests
        // it's getting extremely explicit
        // you can turn on logging by commenting out next line
        require('../models').sequelize.options.logging = false;

        this.testData = {
            title: 'Example Category'
        };

        var models = require('../models');

        this.Category = models.Category;
        this.Topic = models.Topic;
        models.sequelize.sync({ force: true }).then(function() {
            done();
        });
    });


    describe('create', function() {
        it('creates a topic', function() {
            return this.Category.create(this.testData).bind(this).then(function(topic) {
                expect(topic.title).to.equal(this.testData.title);
                expect(topic.slug).to.equal('example-category');
            });
        });

        it('fails if title is not unique', function() {
            return this.Category.create(this.testData).bind(this).then(function() {
                return this.Category.create(this.testData).catch(function(error) {
                    expect(error.name).to.equal('SequelizeUniqueConstraintError');
                });
            });
        });
    });


    it('may have topics', function() {
        return this.Category.create(this.testData).bind(this).then(function(category) {
            return this.Topic.create(this.testData).bind(this).then(function(topic) {
                return category.addTopic(topic).bind(this).then(function() {
                    return category.getTopics().bind(this).then(function(topics) {
                        expect(topics).to.have.length.of.at.least(1);
                        expect(topics[0].title).to.equal(this.testData.title);
                    });
                });
            });
        });
    });
});
