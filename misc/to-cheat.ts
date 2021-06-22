// Cheat snippets

Object.defineProperty(Object.prototype, 'handleCollisionWithOtherTank_mx4ult$', {
	get: function(this: any): any {
		console.log('Get', this);
		return this.__value__handleCollisionWithOtherTank_mx4ult$;
	},
	set: function(this: any, value: any): void {
		console.log('Set', this, value);

		this.__value__handleCollisionWithOtherTank_mx4ult$__original = value;
		this.__value__handleCollisionWithOtherTank_mx4ult$ = function(this: any, t: any): any {
			console.log('Call', this, t);

			// return this.__value__handleCollisionWithOtherTank_mx4ult$__original(t);
		};
	},
	enumerable: false,
	configurable: true
});

Object.defineProperty(Object.prototype, 'tankCollisionBox', {
	get: function(this: any): any {
		// console.log('Get 1', this);
		return this.__value__tankCollisionBox;
	},
	set: function(this: any, value: any): void {
		console.log('Set 1', this, value);

		this.__value__tankCollisionBox = value;
	},
	enumerable: false,
	configurable: true
});

Object.defineProperty(Object.prototype, 'collidesWithOtherTanks', {
	get: function(this: any): any {
		// console.log('Get 2', this);
		return this.__value__collidesWithOtherTanks;
	},
	set: function(this: any, value: any): void {
		console.log('Set 2', this, value);

		this.__value__collidesWithOtherTanks = false;
		// this.__value__collidesWithOtherTanks = value;
	},
	enumerable: false,
	configurable: true
});

Object.defineProperty(Object.prototype, 'collisionShapes', {
	get: function(this: any): any {
		// console.log('Get 4', this);
		return this.__value__collisionShapes;
	},
	set: function(this: any, value: any): void {
		console.log('Set 4', this, value);

		value.clear();

		this.__value__collisionShapes = value;
	},
	enumerable: false,
	configurable: true
});

Object.defineProperty(Object.prototype, 'mass', {
	get: function(this: any): any {
		// console.log('Get 3', this);
		return this.__value__mass;
	},
	set: function(this: any, value: any): void {
		console.log('Set 3', this, value);

		this.__value__mass = 100000;
		// this.__value__mass = value;
	},
	enumerable: false,
	configurable: true
});
