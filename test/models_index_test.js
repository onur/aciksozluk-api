'use strict';

var expect = require('chai').expect;

var tempEnv = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL
};

describe('models/index', function() {
    afterEach(function() {
        delete require.cache[require.resolve('../models')];
        process.env.DATABASE_URL = tempEnv.DATABASE_URL;
        process.env.NODE_ENV = tempEnv.NODE_ENV;
        if (tempEnv.DATABASE_URL === undefined) {
            delete process.env.DATABASE_URL;
        }
        if (tempEnv.NODE_ENV === undefined) {
            delete process.env.NODE_ENV;
        }
    });

    it('returns the user model', function() {
        var models = require('../models');
        expect(models.User).to.be.ok;
    });

    it('returns the topic model', function() {
        var models = require('../models');
        expect(models.Topic).to.be.ok;
    });

    it('uses environment variable for production environment', function() {
        process.env.NODE_ENV = 'production';
        process.env.DATABASE_URL = 'postgres://username:password@localhost/aciksozluk';
        var models = require('../models');
        expect(models).to.be.ok;
    });

    it('returns the entry model', function() {
        var models = require('../models');
        expect(models.Entry).to.be.ok;
    });

    it('returns the revision model', function() {
        var models = require('../models');
        expect(models.Revision).to.be.ok;
    });
});
