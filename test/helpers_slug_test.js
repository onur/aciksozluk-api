
'use strict';

var expect = require('chai').expect;
var slug   = require('../helpers/slug');

describe('helpers/slug', function() {

    it('creates slug from values', function() {
        expect(slug('Example Title')).to.equal('example-title');
        expect(slug('EXAMPLE TITLE')).to.equal('example-title');
        expect(slug('EXAMPLE      TITLE')).to.equal('example-title');
        expect(slug('        EXAMPLE      TITLE         ')).to.equal('example-title');
    });


    it('handles turkish characters', function() {
        expect(slug('TÜRKÇE KARAKTER İÇEREN BİR STRING'))
            .to.equal('turkce-karakter-iceren-bir-string');
        expect(slug('çÇğĞıİöÖüÜşŞ')).to.equal('ccggiioouuss');
    });
});
