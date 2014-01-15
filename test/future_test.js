var Future = require('../src/future').Future;
var a = require('assert');

describe('futurejs', function () {
	describe('then/resolve functions', function () {
		it('should call the then callback after resolve was called', function (done) {
			// prepare env
			var value1 = 1;
			var value2 = 2;

			// create object under test
			var f = new Future();

			// verify
			f.then(function (v1, v2) {
				var err = null;
				try {
					a.equal(v1, value1);
					a.equal(v2, value2);
				} catch (e) {
					err = e;
				} finally {
					done(err);
				}
			});

			// execute
			setImmediate(function () {
				f.resolve(value1, value2);
			});
		});

		it('should call the then callback even if it is defined after resolve was called', function () {
			// prepare env
			var value1 = 1;
			var value2 = 2;

			// create object under test
			var f = new Future();

			// execute
			f.resolve(value1, value2);

			// verify
			f.then(function (v1, v2) {
				a.equal(v1, value1);
				a.equal(v2, value2);
			});
		});

		it('should throw an Error if resolve gets called twice', function(){
			// create object under test
			var f = new Future();

			// execute
			f.resolve();
			var fn = function(){
				f.resolve();
			};

			// verify
			a.throws(fn);
		});

		it('should cleanup the resolver callback after resolve was called', function(){
			// prepare env
			var value1 = 1;
			var value2 = 2;

			// create object under test
			var f = new Future();

			f.then(function(){});

			// verify
			a.notEqual(typeof f.resolver, 'undefined');

			// execute
			f.resolve(value1, value2);

			// verify
			a.equal(typeof f.resolver, 'undefined');
		});

		it('should cleanup the args after the then callback was called', function(){
			// prepare env
			var value1 = 1;
			var value2 = 2;

			// create object under test
			var f = new Future();

			f.resolve(value1, value2);

			// verify
			a.notEqual(typeof f.args, 'undefined');

			// execute
			f.then(function(){});

			// verify
			a.equal(typeof f.args, 'undefined');
		});
	});

	describe('error/reject functions', function () {
		it('should call the error callback after reject was called', function (done) {
			// prepare env
			var value1 = 1;
			var value2 = 2;

			// create object under test
			var f = new Future();

			// verify
			f.error(function (v1, v2) {
				var err = null;
				try {
					a.equal(v1, value1);
					a.equal(v2, value2);
				} catch (e) {
					err = e;
				} finally {
					done(err);
				}
			});

			// execute
			setImmediate(function () {
				f.reject(value1, value2);
			});
		});

		it('should call the error callback even if it is defined after reject was called', function () {
			// prepare env
			var value1 = 1;
			var value2 = 2;

			// create object under test
			var f = new Future();

			// execute
			f.reject(value1, value2);

			// verify
			f.error(function (v1, v2) {
				a.equal(v1, value1);
				a.equal(v2, value2);
			});
		});

		it('should throw an Error if reject gets called twice', function(){
			// create object under test
			var f = new Future();

			// execute
			f.reject();
			var fn = function(){
				f.reject();
			};

			// verify
			a.throws(fn);
		});

		it('should cleanup the rejector callback after reject was called', function(){
			// prepare env
			var value1 = 1;
			var value2 = 2;

			// create object under test
			var f = new Future();

			f.error(function(){});

			// verify
			a.notEqual(typeof f.rejector, 'undefined');

			// execute
			f.reject(value1, value2);

			// verify
			a.equal(typeof f.rejector, 'undefined');
		});

		it('should cleanup the args after the error callback was called', function(){
			// prepare env
			var value1 = 1;
			var value2 = 2;

			// create object under test
			var f = new Future();

			f.reject(value1, value2);

			// verify
			a.notEqual(typeof f.args, 'undefined');

			// execute
			f.error(function(){});

			// verify
			a.equal(typeof f.args, 'undefined');
		});
	});

	describe('reject/resolve', function(){
		it('should throw an Error if both reject and resolve get called', function(){
			// create object under test
			var f1 = new Future();
			var f2 = new Future();

			// execute
			f1.reject();
			var fn1 = function(){
				f1.resolve();
			};
			f2.resolve();
			var fn2 = function(){
				f2.reject();
			};

			// verify
			a.throws(fn1);
			a.throws(fn2);
		});
	});
});