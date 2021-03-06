'use strict';

var Future = function() {
    this.resolved = false;
    this.rejected = false;

    return this;
};

Future.prototype.then = function(cb) {
    if (this.resolved) {
        cb.apply(undefined, this.args);
	    this.args = undefined;
    } else {
        this.resolver = cb;
    }
    return this;
};

Future.prototype.resolve = function() {
    if (this.resolved || this.rejected) {
        throw new Error('A future can be rejected or resolved only once!');
    } else {
        if (typeof this.resolver !== 'undefined') {
            this.resolver.apply(undefined, arguments);
	        this.resolver = undefined;
            this.resolved = true;
        } else {
            this.resolved = true;
            this.args = Array.prototype.splice.call(arguments, 0);
        }
    }
};

Future.prototype.error = function(cb) {
    if (this.rejected) {
        cb.apply(undefined, this.args);
	    this.args = undefined;
    } else {
        this.rejector = cb;
    }
    return this;
};

Future.prototype.reject = function() {
    if (this.resolved || this.rejected) {
        throw new Error('A future can be rejected or resolved only once!');
    } else {
        if (typeof this.rejector !== 'undefined') {
            this.rejector.apply(undefined, arguments);
	        this.rejector = undefined;
            this.rejected = true;
        } else {
            this.rejected = true;
            this.args = Array.prototype.splice.call(arguments, 0);
        }
    }
};

var Mock = function(config) {
    this.args = [];
    // TODO: find better way to remove first argument!
    for (var i = 1; i < arguments.length; i++) {
        this.args.push(arguments[i]);
    }
    this.config = config || {};
};

Mock.prototype.then = function(cb) {
    if (!this.config.callError) {
        cb.apply(undefined, this.args);
    }
    return this;
};

Mock.prototype.error = function(cb) {
    if (this.config.callError) {
        cb.apply(undefined, this.args);
    }
    return this;
};

module.exports = {Future:Future, Mock:Mock};
