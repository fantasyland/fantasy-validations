var daggy = require('daggy'),
    Validation = daggy.taggedSum({
        Success: ['s'],
        Failure: ['f']
    });

function identity(a) {
    return a;
}

// Methods
Validation.prototype.fold = function(f, g) {
    return this.cata({
        Failure: f,
        Success: g
    });
};
Validation.of = Validation.Success;
Validation.prototype.bimap = function(f, g) {
    return this.fold(
        function(a) {
            return Validation.Failure(f(a));
        },
        function(b) {
            return Validation.Success(g(b));
        }
    );
};
Validation.prototype.map = function(f) {
    return this.bimap(identity, f);
};
Validation.prototype.ap = function(b) {
    return this.fold(
        function(f) {
            return Validation.Failure(f);
        },
        function(s) {
            return b.map(s);
        }
    );
};
Validation.prototype.concat = function(b) {
    return this.fold(
        function(f) {
            return b.bimap(
                function(g) {
                    return f.concat(g);
                },
                identity
            );
        },
        function(s) {
            return b.map(function(d) {
                return s.concat(d);
            });
        }
    );
};

// Export
if(typeof module != 'undefined')
    module.exports = Validation;
