const Game = function () {
    this.world = new Game.World();
    this.update = function () {
        this.world.update();
    };
};

Game.prototype = { constructor: Game };

// Collider //
Game.Collider = function() {
    this.collide = function(value, object, tile_x, tile_y, tile_size) {
        switch(value) {
            case  1: this.collidePlatformTop       (object, tile_y            ); break;
            case  2: this.collidePlatformRight     (object, tile_x + tile_size); break;
            case  3: if (this.collidePlatformTop   (object, tile_y            )) return;
                     this.collidePlatformRight     (object, tile_x + tile_size); break;
            case  4: this.collidePlatformBottom    (object, tile_y + tile_size); break;
            case  5: if (this.collidePlatformTop   (object, tile_y            )) return;
                     this.collidePlatformBottom    (object, tile_y + tile_size); break;
            case  6: if (this.collidePlatformRight (object, tile_x + tile_size)) return;
                     this.collidePlatformBottom    (object, tile_y + tile_size); break;
            case  7: if (this.collidePlatformTop   (object, tile_y            )) return;
                     if (this.collidePlatformRight (object, tile_x + tile_size)) return;
                     this.collidePlatformBottom    (object, tile_y + tile_size); break;
            case  8: this.collidePlatformLeft      (object, tile_x            ); break;
            case  9: if (this.collidePlatformTop   (object, tile_y            )) return;
                     this.collidePlatformLeft      (object, tile_x            ); break;
            case 10: if (this.collidePlatformLeft  (object, tile_x            )) return;
                     this.collidePlatformRight     (object, tile_x + tile_size); break;
            case 11: if (this.collidePlatformTop   (object, tile_y            )) return;
                     if (this.collidePlatformLeft  (object, tile_x            )) return;
                     this.collidePlatformRight     (object, tile_x + tile_size); break;
            case 12: if (this.collidePlatformLeft  (object, tile_x            )) return;
                     this.collideObjectBottom      (object, tile_y + tile_size); break;
            case 13: if (this.collidePlatformTop   (object, tile_y            )) return;
                     if (this.collidePlatformLeft  (object, tile_x            )) return;
                     this.collidePlatformBottom    (object, tile_y + tile_size); break;
            case 14: if (this.collidePlatformLeft  (object, tile_x            )) return;
                     if (this.collidePlatformRight (object, tile_x + tile_size)) return;
                     this.collidePlatformBottom    (object, tile_y + tile_size); break;
            case 15: if (this.collidePlatformTop   (object, tile_y            )) return;
                     if (this.collidePlatformLeft  (object, tile_x            )) return;
                     if (this.collidePlatformRight (object, tile_x + tile_size)) return;
                     this.collidePlatformBottom    (object, tile_y + tile_size); break;
        };
    }
};

Game.Collider.prototype = {
    constructor: Game.Collider,
    
    collidePlatformBottom: function (object, tile_bottom) {
        if (object.getTop() < tile_bottom && object.getOldTop() >= tile_bottom) {
            object.setTop(tile_bottom);
            object.velocity_y = 0;
            return true;
        } return false;
    },
    collidePlatformLeft: function (object, tile_left) {
        if (object.getRight() > tile_left && object.getOldRight() <= tile_left) {
            object.setRight(tile_left - 0.01);
            object.velocity_x = 0;
            return true;
        } return false;
    },
    collidePlatformRight: function (object, tile_right) {
        if (object.getLeft() < tile_right && object.getOldLeft() >= tile_right) {
            object.setLeft(tile_right);
            object.velocity_x = 0;
            return true;
        } return false;
    },
    collidePlatformTop: function (object, tile_top) {
        if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {
            object.setBottom(tile_top - 0.01);
            object.velocity_y = 0;
            object.jumping = false;
            return true;
        } return false;
    }
};
// Collider.end //

// Object //
Game.Object = function (x, y, width, height) {
    this.x      = x;
    this.y      = y;
    this.width  = width;
    this.height = height;
};

Game.Object.prototype = {
    constructor: Game.Object,

    getBottom:    function ()  { return this.y + this.height;       },
    getCenterX:   function ()  { return this.x + this.width  * 0.5; },
    getCenterY:   function ()  { return this.y + this.height * 0.5; },
    getLeft:      function ()  { return this.x;                     },
    getRight:     function ()  { return this.x + this.width;        },
    getTop:       function ()  { return this.y;                     },
    setBottom:    function (y) { this.y = y - this.height;          },
    setCenterX:   function (x) { this.x = x - this.width  * 0.5;    },
    setCenterY:   function (y) { this.y = y - this.height * 0.5;    },
    setLeft:      function (x) { this.x = x;                        },
    setRight:     function (x) { this.x = x - this.width;           },
    setTop:       function (y) { this.y = y;                        },
};
// Object.end //

// Moving Object //
Game.MovingObject = function(width, height, x, y, velocity_max) {
    Game.Object.call(this, x, y, width, height);

    this.jumping      = false;
    this.velocity_max = velocity_max;
    this.velocity_x   = 0;
    this.velocity_y   = 0;
    this.x_old        = x;
    this.y_old        = y;
};

Game.MovingObject.prototype = {
    getOldBottom:    function ()  { return this.y_old + this.height;       },
    getOldCenterX:   function ()  { return this.x_old + this.width  * 0.5; },
    getOldCenterY:   function ()  { return this.y_old + this.height * 0.5; },
    getOldLeft:      function ()  { return this.x_old;                     },
    getOldRight:     function ()  { return this.x_old + this.width;        },
    getOldTop:       function ()  { return this.y_old;                     },
    setOldBottom:    function (y) { this.y_old = y - this.height;          },
    setOldCenterX:   function (x) { this.x_old = x - this.width  * 0.5;    },
    setOldCenterY:   function (y) { this.y_old = y - this.height * 0.5;    },
    setOldLeft:      function (x) { this.x_old = x;                        },
    setOldRight:     function (x) { this.x_old = x - this.width;           },
    setOldTop:       function (y) { this.y_old = y;                        },
};

Object.assign(Game.MovingObject.prototype, Game.Object.prototype);
Game.MovingObject.prototype.constructor = Game.MovingObject;
// Moving Object.end //

// Animator //
Game.Animator = function (frame_set, delay) {
    this.count       = 0;
    this.delay       = (delay >= 1) ? delay : 1;
    this.frame_set   = frame_set;
    this.frame_index = 0;
    this.frame_value = frame_set[0];
    this.mode        = "pause";
};

Game.Animator.prototype = {
    constructor: Game.Animator,

    animate: function() {
        switch (this.mode) {
            case "loop" : this.loop(); break;
            case "pause":              break;
        }
    },

    changeFrameSet(frame_set, mode, delay = 10, frame_index = 0) {
        if (this.frame_set === frame_set) { return; }

        this.count       = 0;
        this.delay       = delay;
        this.frame_set   = frame_set;
        this.frame_index = frame_index;
        this.frame_value = frame_set[frame_index];
        this.mode        = mode;
    },

    loop: function () {
        this.count ++;

        while(this.count > this.delay) {
            this.count -= this.delay;
            this.frame_index = (this.frame_index < this.frame_set.length - 1) ? this.frame_index + 1 : 0;
            this.frame_value = this.frame_set[this.frame_index];
        }
    }
};
// Animator.end//


// Player //
Game.Player = function (x, y) {
    Game.Object.call(this, 100, 50, 16, 16);
    Game.Animator.call(this,Game.Player.prototype.frame_sets["idle-left"], 10);
    this.jumping     =        true;           // Player's Jumping State
    this.shooting    =       false;           // Player's Shooting State

    this.bullets     = new Array();           // Player's Bullets

    this.direction_x =          -1;           // Player's X Direction
    this.direction_y =           0;           // Player's Y Direction
    this.velocity_x  =           0;           // Player's X Velocity
    this.velocity_y  =           0;           // Player's Y Velocity
};

Game.Player.prototype = {
    constructor: Game.Player,
    frame_sets: {
        "idle-left"  : [0],
        "move-left"  : [1, 2],
        "jump-left"  : [3],
        "fall-left"  : [4],
        "idle-right" : [5],
        "move-right" : [6, 7],
        "jump-right" : [8],
        "fall-right" : [9],
    },

    jump: function () {
        if (!this.jumping) {
            this.jumping = true;
            this.velocity_y -= 5;
        }
    },

    shoot: function () {
        if(!this.shooting) {
            switch(this.direction_x + "," + this.direction_y) {
                case "-1,-1":
                    this.shooting = true;
                    // this.bullets.push(new Game.Projectile(this.x, this.y));
                    break;
                case "-1,0":
                    this.shooting = true;
                    // this.bullets.push(new Game.Projectile(this.x, (this.y + this.height) / 2));
                    break;
                case "-1,1":
                    this.shooting = true;
                    // this.bullets.push(new Game.Projectile(this.x, this.y + this.height));
                case "0,-1":
                    this.shooting = true;
                    // this.bullets.push(new Game.Projectile((this.x + this.width) / 2, this.y));
                    break;
                case "0,1":
                    if (this.jumping) {
                        this.shooting = true;
                        // this.bullets.push(new Game.Projectile((this.x + this.width) / 2, this.y + this.height));
                    }
                    break;
                case "1,-1":
                    this.shooting = true;
                        // this.bullets.push(new Game.Projectile(this.x + this.width, this.y));
                case "1,0":
                    this.shooting = true;
                    // this.bullets.push(new Game.Projectile(this.x + this.width, (this.y + this.height) / 2));
                    break;
                case " 1,1":
                    this.shooting = true;
                    // this.bullets.push(new Game.Projectile(this.x + this.width, this.y + this.height));
                    break;
            };
        };
    },

    upAction: function () {
        this.direction_y  =   -1;
    },

    moveLeft: function () {
        this.direction_x  =   -1;
        this.velocity_x  -=  0.3;
    },
    moveRight: function (frame_set) {
        this.direction_x  =    1;
        this.velocity_x  +=  0.3;
    },

    downAction: function() {
        this.direction_y  =    1;
    },

    updateAnimation: function () {
        if (this.velocity_y < 0) {
        
            if (this.direction_x < 0) this.changeFrameSet(this.frame_sets["jump-left"], "pause");
            else this.changeFrameSet(this.frame_sets["jump-right"], "pause");
        
        } else if (this.velocity_y > 0) {

            if (this.direction_x < 0) this.changeFrameSet(this.frame_sets["fall-left"], "pause");
            else this.changeFrameSet(this.frame_sets["fall-right"], "pause");

        } else if (this.direction_x < 0) {
        
            if (this.velocity_x < -0.1) this.changeFrameSet(this.frame_sets["move-left"], "loop", 10);
            else this.changeFrameSet(this.frame_sets["idle-left"], "pause");
        
        } else if (this.direction_x > 0) {

            if (this.velocity_x > 0.1) this.changeFrameSet(this.frame_sets["move-right"], "loop", 12);
            else this.changeFrameSet(this.frame_sets["idle-right"], "pause");
        
        }
        this.animate();
    },

    updatePosition: function (gravity, friction) {
        this.x_old = this.x;
        this.y_old = this.y;

        this.velocity_x *= friction;
        this.velocity_y += gravity;

        this.x    += this.velocity_x;
        this.y    += this.velocity_y;
    },
};

Object.assign(Game.Player.prototype, Game.MovingObject.prototype);
Object.assign(Game.Player.prototype, Game.Animator.prototype);
Game.Player.prototype.constructor = Game.Player;
// Player end //

// Bullet //
// Game.Projectile = function (x, y) {
//     Game.Object.call(this, x, y, dx, dy);

//     this.lifespan    = 180;

//     this.color = "#cfb737";
//     this.direction_x = dx;
//     this.direction_y = dy;
//     this.velocity_x  = 0;
//     this.velocity_y  = 0;
// }

// Object.assign(Game.Projectile.prototype, Game.MovingObject.prototype);
// Game.Projectile.prototype = {
//     constructor: Game.Projectile,

//     updatePosition: function () {
//         this.x = this.velocity_x;
//         this.y = this.velocity_y;
//     },

//     expire: function () {
//         if(this.lifespan < 1) {
//             this.lifespan -= 1;
//         } else {
//             Game.Player.bullets.remove(this.lifespan = 0);
//         }
//     },
// };
// Bullet end //

// TileSet //
Game.TileSet = function (columns, tile_size) {
    this.columns   = columns;
    this.tile_size = tile_size;
    
    let f = Game.Frame;

    this.frames = [new f(  0,  16,  16,  16,   0,   0),                                       // idle-left
                   new f( 16,  16,  16,  16,   0,   0), new f(  32,  16,  16,  16,   0,   0), // move-right
                   new f( 48,  16,  16,  16,   0,   0),                                       // jump-left
                   new f( 64,  16,  16,  16,   0,   0),                                       // fall-left
                   new f(  0,  32,  16,  16,   0,   0),                                       // idle-right
                   new f( 16,  32,  16,  16,   0,   0), new f(  32,  32,  16,  16,   0,   0), // move-left
                   new f( 48,  32,  16,  16,   0,   0),                                       // jump-right
                   new f( 64,  32,  16,  16,   0,   0),                                       // fall-right
    ];
};

Game.TileSet.prototype = { constructor: Game.TileSet };
// Tile Set.end //

// Tile Set Frame //
Game.Frame = function (x, y, width, height, offset_x, offset_y) {
    this.x        = x;
    this.y        = y;
    this.width    = width;
    this.height   = height;
    this.offset_x = offset_x;
    this.offset_y = offset_y;
};

Game.Frame.prototype = { constructor: Game.Frame };
// Tile Set Frame.end //

// World //
Game.World = function (friction = 0.9, gravity = 0.5) {
    this.collider = new Game.Collider();
    
    this.friction = friction;
    this.gravity  = gravity;

    this.columns  = 16;
    this.rows     = 9;

    this.tile_set = new Game.TileSet(5, 16);
    this.player   = new Game.Player(100, 20);

    this.bullets  = new Array();

    this.zone_id  = "00";

    this.height   = this.tile_set.tile_size * this.rows;
    this.width    = this.tile_set.tile_size * this.columns;
};

Game.World.prototype = {
    constructor: Game.World,

    collideObject: function (object) {
        // Declare Variables
        var bottom, left, right, top, value;

        // Top-Left Corner
        top   = Math.floor(object.getTop()  / this.tile_set.tile_size);
        left  = Math.floor(object.getLeft() / this.tile_set.tile_size);
        value = this.collision_map[top * this.columns + left];
        this.collider.collide(value, object, left * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);

        // Top-Right Corner
        top   = Math.floor(object.getTop()   / this.tile_set.tile_size);
        right = Math.floor(object.getRight() / this.tile_set.tile_size);
        value = this.collision_map[top * this.columns + right];
        this.collider.collide(value, object, right * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);

        // Bottom-Left Corner
        bottom = Math.floor(object.getBottom()  / this.tile_set.tile_size);
        left   = Math.floor(object.getLeft()    / this.tile_set.tile_size);
        value  = this.collision_map[bottom * this.columns + left];
        this.collider.collide(value, object, left * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);

        // Bottom-Right Corner
        bottom = Math.floor(object.getBottom()   / this.tile_set.tile_size);
        right  = Math.floor(object.getRight()    / this.tile_set.tile_size);
        value  = this.collision_map[bottom * this.columns + right];
        this.collider.collide(value, object, right * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);
    },

    setup: function (zone) {
        this.graphical_map = zone.graphical_map;
        this.collision_map = zone.collision_map;
        this.columns       = zone.columns;
        this.rows          = zone.rows;
        this.zone_id       = zone.zone_id;
    },

    update: function () {
        this.player.updatePosition(this.gravity, this.friction);

        this.collideObject(this.player);

        this.player.updateAnimation();
    }
};
// World end //