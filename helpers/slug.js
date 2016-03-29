'use strict';

module.exports = function(val) {
    var slug = require('slug');
    slug.defaults.mode ='rfc3986';
    slug.defaults.modes['rfc3986'] = {
        replacement: '-',
        symbols: false,
        remove: null,
        lower: true,
        charmap: slug.charmap,
        multicharmap: slug.multicharmap // replace multi-characters
    };
    return slug(val);
};
