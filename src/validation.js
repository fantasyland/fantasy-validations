'use strict';

const daggy = require('daggy');
const {identity} = require('fantasy-combinators');

const Validation = daggy.taggedSum({
    Success: ['s'],
    Failure: ['f']
});

// Methods
Validation.of = Validation.Success;

Validation.prototype.fold = function(f, g) {
    return this.cata({
        Failure: f,
        Success: g
    });
};

Validation.prototype.bimap = function(f, g) {
    return this.fold(
        (a) => Validation.Failure(f(a)),
        (b) => Validation.Success(g(b))
    );
};

Validation.prototype.map = function(f) {
    return this.bimap(identity, f);
};

Validation.prototype.ap = function(b) {
    return this.fold(
        (f1) => {
            return b.fold(
                (f2) => Validation.Failure(f1.concat(f2)),
                (s) => Validation.Failure(f1)
            );
        },
        (s) => b.map(s)
    );
};

Validation.prototype.concat = function(b) {
    return this.fold(
        (f) => {
            return b.bimap(
                (g) => f.concat(g),
                identity
            );
        },
        (s) => b.map((d) => s.concat(d))
    );
};

// Export
if(typeof module != 'undefined')
    module.exports = Validation;
