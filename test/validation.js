'use strict';

const λ = require('./lib/test');
const applicative = λ.applicative;
const functor = λ.functor;
const identity = λ.identity;
const Validation = λ.Validation;

exports.validation = {

    // Applicative Functor tests
    'All (Applicative)': applicative.laws(λ)(Validation, identity),
    'Identity (Applicative)': applicative.identity(λ)(Validation, identity),
    'Composition (Applicative)': applicative.composition(λ)(Validation, identity),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(Validation, identity),
    'Interchange (Applicative)': applicative.interchange(λ)(Validation, identity),

    // Functor tests
    'All (Functor)': functor.laws(λ)(Validation.of, identity),
    'Identity (Functor)': functor.identity(λ)(Validation.of, identity),
    'Composition (Functor)': functor.composition(λ)(Validation.of, identity),
};
