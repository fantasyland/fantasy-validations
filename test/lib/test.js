'use strict';

const λ = require('fantasy-check/src/adapters/nodeunit');
const applicative = require('fantasy-check/src/laws/applicative');
const functor = require('fantasy-check/src/laws/functor');
    
const daggy = require('daggy');

const {isInstanceOf} = require('fantasy-helpers');
const {constant, identity} = require('fantasy-combinators');

const Identity = require('fantasy-identities');
const Validation = require('../../fantasy-validations');

const isIdentity = isInstanceOf(Identity);
const isValidation = isInstanceOf(Validation);
const isFailure = isInstanceOf(Validation.Failure);
const isSuccess = isInstanceOf(Validation.Success);
const isFailureOf = isInstanceOf(failureOf);
const isSuccessOf = isInstanceOf(successOf);
const isIdentityOf = isInstanceOf(identityOf);

function inc(a) {
    return a + 1;
}
function equals(a) {
    return (b) => {
        return a.fold(
            (x) => b.fold((y) => x === y, constant(false)),
            (x) => b.fold(constant(false), (y) => x === y)
        );
    };
}
function error(a) {
    return () => {
        throw new Error(a);
    };
}

Identity.prototype.traverse = function(f, p) {
    return p.of(f(this.x));
};

function identityOf(type) {
    const self = this.getInstance(this, identityOf);
    self.type = type;
    return self;
}

function failureOf(type) {
    const self = this.getInstance(this, failureOf);
    self.type = type;
    return self;
}

function successOf(type) {
    const self = this.getInstance(this, successOf);
    self.type = type;
    return self;
}

const λʹ = λ
    .property('applicative', applicative)
    .property('functor', functor)
    .property('equals', equals)
    .property('inc', inc)
    .property('isFailure', isFailure)
    .property('isSuccess', isSuccess)
    .property('Validation', Validation)
    .property('Identity', Identity)
    .property('badFailure', error('Got Failure side'))
    .property('badSuccess', error('Got Success side'))
    .property('isIdentity', isIdentity)
    .property('identityOf', identityOf)
    .method('arb', isIdentityOf, function(a, b) {
        return Identity.of(this.arb(a.type, b - 1));
    })
    .property('failureOf', failureOf)
    .method('arb', isFailureOf, function(a, b) {
        return Validation.Failure(this.arb(a.type, b - 1))
    })
    .property('successOf', successOf)
    .method('arb', isSuccessOf, function(a, b) {
        return Validation.Success(this.arb(a.type, b - 1));
    });


// Export
if(typeof module != 'undefined')
    module.exports = λʹ;
