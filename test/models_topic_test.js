'use strict';

var expect = require('chai').expect;
var Promise = require('bluebird');

var models = require('../models');
var Topic = models.Topic;
var Category = models.Category;

describe('models/topic', function() {
    var testData = {
        title: 'Example Topic'
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
            Topic.create(testData).then(function(topic) {
                expect(topic.title).to.equal(testData.title);
                expect(topic.slug).to.equal('example-topic');
                expect(topic.entryCount).to.equal(0);

                done();
            });
        });

        it('fails if title is not unique', function(done) {
            Promise.all([
                Topic.create(testData),
                Topic.create(testData)
            ]).catch(function(error) {
                expect(error.name).to.equal('SequelizeUniqueConstraintError');

                done();
            });
        });
    });

    it('may belong to categories', function(done) {
        Promise.props({
            topic: Topic.create(testData),
            category: Category.create(testData)
        }).then(function(results) {
            // addCategory will return a TopicCategory entity but we're only interested in the topic
            return results.topic.addCategory(results.category)
                .then(function(topicCategory) { // eslint-disable-line
                    return results.topic.getCategories();
                });
        }).then(function(categories) {
            expect(categories).to.have.length.of.at.least(1);
            expect(categories[0].title).to.equal(testData.title);

            done();
        });
    });
});
