'use strict';

var expect = require('chai').expect;

var secretHelperPath = '../helpers/secret';

var tempEnv = {
    SECRET_KEY: process.env.SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV
};

describe('helpers/secret', function() {

    beforeEach(function() {
        delete require.cache[require.resolve(secretHelperPath)];
    });

    afterEach(function() {
        process.env.SECRET_KEY = tempEnv.SECRET_KEY;
        process.env.NODE_ENV = tempEnv.NODE_ENV;
        if (tempEnv.SECRET_KEY === undefined) {
            delete process.env.SECRET_KEY;
        }
        if (tempEnv.NODE_ENV === undefined) {
            delete process.env.NODE_ENV;
        }
    });


    it('uses simple value on development environment', function() {
        delete process.env.NODE_ENV;
        delete process.env.SECRET_KEY;
        expect(require(secretHelperPath)).to.equal('aciksozluk');
    });


    it('uses SECRET_KEY environment variable if it\'s defined', function() {
        delete process.env.NODE_ENV;
        process.env.SECRET_KEY = 'example';
        expect(require(secretHelperPath)).to.equal('example');
    });


    it('generates random key on test environment', function() {
        process.env.NODE_ENV = 'test';
        expect(require(secretHelperPath)).to.have.length.of.at.least(32);
    });


    it('requires SECRET_KEY environment variable on production environment', function() {
        process.env.NODE_ENV = 'production';
        delete process.env.SECRET_KEY;
        expect(function() { require(secretHelperPath); }).to.throw('SECRET_KEY is not available!');
    });


    it('uses SECRET_KEY environment variable on production environment', function() {
        process.env.NODE_ENV = 'production';
        process.env.SECRET_KEY = 'supersecret';
        expect(require(secretHelperPath)).to.equal('supersecret');
    });
});