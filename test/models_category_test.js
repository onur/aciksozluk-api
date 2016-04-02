'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');

var models = require('../models');
var Topic = models.Topic;
var Category = models.Category;

describe('models/category', function() {
    var testData = {
        title: 'Example Category'
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
        it('creates a topic', function(done) {
            Category.create(testData).then(function(topic) {
                expect(topic.title).to.equal(testData.title);
                expect(topic.slug).to.equal('example-category');

                done();
            });
        });

        it('fails if title is not unique', function(done) {
            Promise.all([
                Category.create(testData),
                Category.create(testData)
            ]).catch(function(error) {
                expect(error.name).to.equal('SequelizeUniqueConstraintError');

                done();
            });
        });
    });


    it('may have topics', function(done) {
        Promise.props({
            topic: Topic.create(testData),
            category: Category.create(testData)
        }).then(function(results) {
            // addTopic will return a TopicCategory entity but we're only interested in the category
            return results.topic.addCategory(results.category)
                .then(function(topicCategory) { // eslint-disable-line
                    return results.category.getTopics();
                });
        }).then(function(topics) {
            expect(topics).to.have.length.of.at.least(1);
            expect(topics[0].title).to.equal(testData.title);

            done();
        });
    });
});
