exports.ids = ["main~server"];
exports.modules = {

/***/ "./src/board.ts":
/*!**********************!*\
  !*** ./src/board.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.Board = void 0;

__webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");

__webpack_require__(/*! core-js/modules/es7.symbol.async-iterator */ "./node_modules/core-js/modules/es7.symbol.async-iterator.js");

var _grid = __webpack_require__(/*! src/grid */ "./src/grid.ts");

var _bounds = __webpack_require__(/*! src/bounds */ "./src/bounds.ts");

var _square = __webpack_require__(/*! src/square */ "./src/square.ts");

var _lodash = __webpack_require__(/*! lodash */ "lodash");

class Board {
  constructor() {
    this.bounds = new _bounds.Bounds(0, 0, 0, 0);
    this.grid = new _grid.Grid(0, 0);
  }

  reset({
    width,
    height
  }) {
    const grid = new _grid.Grid(width, height),
          squareSize = {
      width: 64,
      height: 64
    },
          gutterSize = {
      width: 6,
      height: 6
    },
          bounds = new _bounds.Bounds(0.5, 0.5, 1 + width * (squareSize.width + gutterSize.width) + gutterSize.width, 1 + height * (squareSize.height + gutterSize.height) + gutterSize.height);

    for (let x = 0; x < width; ++x) {
      for (let y = 0; y < height; ++y) {
        const position = {
          x,
          y
        },
              bounds = new _bounds.Bounds(0.5 + x * (squareSize.width + gutterSize.width) + gutterSize.width, 0.5 + y * (squareSize.height + gutterSize.height) + gutterSize.height, 0.5 + squareSize.width, 0.5 + squareSize.height);
        grid.set({
          x,
          y
        }, new _square.Square(position, bounds));
      }
    }

    Object.assign(this, {
      grid,
      bounds
    });
  }

  get width() {
    const {
      grid: {
        width
      }
    } = this;
    return width;
  }

  get height() {
    const {
      grid: {
        height
      }
    } = this;
    return height;
  }

  get({
    x,
    y
  }) {
    const {
      grid
    } = this;
    return grid.get({
      x,
      y
    });
  }

  boundsCheck({
    x,
    y
  }) {
    const {
      grid
    } = this;
    return grid.boundsCheck({
      x,
      y
    });
  }

  getData() {
    return Object.freeze(Array.from(this.grid).map(sq => sq.empty ? null : sq.color));
  }

  setData(data) {
    for (const [color, square] of (0, _lodash.zip)(data, Array.from(this.grid))) {
      square.color = color;
    }
  }

  getGameState(index) {
    return {
      index,
      data: this.getData()
    };
  }

  getMask() {
    return Object.freeze(Array.from(this.grid).map(sq => sq.enabled));
  }

  setMask(mask) {
    for (const [enabled, square] of (0, _lodash.zip)(mask, Array.from(this.grid))) {
      square.enabled = enabled;
    }
  }

  static fromGame(game, gameState) {
    const board = new Board();
    board.reset(game.size);
    board.setData(gameState.data);
    board.setMask(game.mask);
    return board;
  }

  [Symbol.iterator]() {
    const {
      grid
    } = this;
    return grid[Symbol.iterator]();
  }

  hitTest(pt) {
    for (const square of this) {
      if (square.bounds.hitTest(pt)) {
        return square;
      }
    }

    return null;
  }

}

exports.Board = Board;

/***/ }),

/***/ "./src/bounds.ts":
/*!***********************!*\
  !*** ./src/bounds.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.Bounds = void 0;

class Bounds {
  constructor(left, top, width, height) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }

  get bottom() {
    const {
      top,
      height
    } = this;
    return top + height;
  }

  get right() {
    const {
      left,
      width
    } = this;
    return left + width;
  }

  get center() {
    const {
      left,
      top,
      width,
      height
    } = this,
          x = left + width * .5,
          y = top + height * .5;
    return {
      x,
      y
    };
  }

  get n() {
    const {
      left,
      top,
      width
    } = this,
          x = left + width * .5,
          y = top;
    return {
      x,
      y
    };
  }

  get ne() {
    const {
      left,
      top,
      width
    } = this,
          x = left + width,
          y = top;
    return {
      x,
      y
    };
  }

  get e() {
    const {
      left,
      top,
      width,
      height
    } = this,
          x = left + width,
          y = top + height * .5;
    return {
      x,
      y
    };
  }

  get se() {
    const {
      left,
      top,
      width,
      height
    } = this,
          x = left + width,
          y = top + height;
    return {
      x,
      y
    };
  }

  get s() {
    const {
      left,
      top,
      width,
      height
    } = this,
          x = left + width * .5,
          y = top + height;
    return {
      x,
      y
    };
  }

  get sw() {
    const {
      left,
      top,
      height
    } = this,
          x = left,
          y = top + height;
    return {
      x,
      y
    };
  }

  get w() {
    const {
      left,
      top,
      height
    } = this,
          x = left,
          y = top + height * .5;
    return {
      x,
      y
    };
  }

  get nw() {
    const {
      left,
      top
    } = this,
          x = left,
          y = top;
    return {
      x,
      y
    };
  }

  hitTest({
    x,
    y
  }) {
    const {
      top,
      right,
      bottom,
      left
    } = this;
    return x >= left && x <= right && y >= top && y <= bottom;
  }

}

exports.Bounds = Bounds;

/***/ }),

/***/ "./src/data/colors.yaml":
/*!******************************!*\
  !*** ./src/data/colors.yaml ***!
  \******************************/
/*! exports provided: colors, default */
/***/ (function(module) {

module.exports = {"colors":{"aqua":{"displayName":"Aqua","color":[180,100,50]},"black":{"displayName":"Black","color":[0,0,0]},"blue":{"displayName":"Blue","color":[240,100,50]},"fuschsia":{"displayName":"Fuchsia","color":[300,100,50]},"gray":{"displayName":"Gray","color":[0,0,50]},"green":{"displayName":"Green","color":[120,100,50]},"orange":{"displayName":"Orange","color":[30,100,50]},"pink":{"displayName":"Pink","color":[330,100,50]},"purple":{"displayName":"Purple","color":[270,100,50]},"red":{"displayName":"Red","color":[0,100,50]},"white":{"displayName":"White","color":[0,0,100]},"yellow":{"displayName":"Yellow","color":[60,100,50]}}};

/***/ }),

/***/ "./src/grid.ts":
/*!*********************!*\
  !*** ./src/grid.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.Grid = void 0;

__webpack_require__(/*! core-js/modules/es7.symbol.async-iterator */ "./node_modules/core-js/modules/es7.symbol.async-iterator.js");

function validate(grid, {
  x,
  y
}) {
  if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y)) {
    throw new Error(`(${x}, ${y}) is not valid`);
  }

  if (!grid.boundsCheck({
    x,
    y
  })) {
    throw new Error(`(${x}, ${y}) is out of bounds`);
  }
}

class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Map();
  }

  boundsCheck({
    x,
    y
  }) {
    const {
      width,
      height
    } = this;
    return x >= 0 && x < width && y >= 0 && y < height;
  }

  get({
    x,
    y
  }) {
    validate(this, {
      x,
      y
    });
    const key = JSON.stringify({
      x,
      y
    });
    return this.data.get(key);
  }

  set({
    x,
    y
  }, value) {
    validate(this, {
      x,
      y
    });
    const key = JSON.stringify({
      x,
      y
    });
    this.data.set(key, value);
  }

  [Symbol.iterator]() {
    function* iterator() {
      const {
        width,
        height
      } = this;

      for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
          yield this.get({
            x,
            y
          });
        }
      }
    }

    return iterator.call(this);
  }

}

exports.Grid = Grid;

/***/ }),

/***/ "./src/rule-sets.ts":
/*!**************************!*\
  !*** ./src/rule-sets.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.ruleSetMap = exports.ruleSets = exports.rulesReversed = exports.rulesStandard = void 0;

var _board = __webpack_require__(/*! ./board */ "./src/board.ts");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const directions = [{
  x: 0,
  y: -1
}, {
  x: 1,
  y: -1
}, {
  x: 1,
  y: 0
}, {
  x: 1,
  y: 1
}, {
  x: 0,
  y: 1
}, {
  x: -1,
  y: 1
}, {
  x: -1,
  y: 0
}, {
  x: -1,
  y: -1
}];

function getAffectedSquares(board, position, color) {
  if (!board.boundsCheck(position)) {
    return [];
  }

  const square = board.get(position);

  if (!square || !square.empty || !square.enabled) {
    return [];
  }

  function direction({
    x,
    y
  }, delta) {
    const squares = [];

    for (;;) {
      x += delta.x;
      y += delta.y;

      if (!board.boundsCheck({
        x,
        y
      })) {
        return [];
      }

      const square = board.get({
        x,
        y
      });

      if (!square || square.empty || !square.enabled) {
        return [];
      }

      if (square.color === color) {
        return squares;
      }

      squares.push(square);
    }
  }

  let squares = [square];

  for (const delta of directions) {
    squares = [...squares, ...direction(position, delta)];
  }

  if (squares.length <= 1) {
    return [];
  }

  return squares;
}

class RulesStandard {
  constructor() {
    this.name = 'Standard';
    this.ruleSet = "standard"
    /* standard */
    ;
    this.colors = 2;
    this.boardSize = Object.freeze({
      width: 8,
      height: 8
    });
  }

  isValid(game, gameState, position, color) {
    return getAffectedSquares(_board.Board.fromGame(game, gameState), position, color).length > 0;
  }

  compareScores(score1, score2) {
    return score1 - score2;
  }

  getValidMoves(game, gameState, color) {
    const points = [];
    const {
      size: {
        width,
        height
      }
    } = game;

    for (let x = 0; x < width; ++x) {
      for (let y = 0; y < height; ++y) {
        const point = {
          x,
          y
        };
        if (this.isValid(game, gameState, point, color)) points.push(point);
      }
    }

    return points;
  }

  isGameOver(game, gameState) {
    const {
      colors
    } = this;

    for (let color = 0; color < colors; ++color) {
      if (this.getValidMoves(game, gameState, color).length > 0) return false;
    }

    return true;
  }

  makeMove(game, gameState, position) {
    const {
      turn: prevTurn,
      index: prevIndex
    } = gameState;

    const board = _board.Board.fromGame(game, gameState);

    const squares = getAffectedSquares(board, position, prevTurn);
    if (squares.length === 0) return null;

    for (const square of squares) {
      square.color = prevTurn;
    }

    const index = prevIndex + 1;
    const lastMove = Object.freeze(_objectSpread({}, position));
    const data = board.getData();
    const {
      colors
    } = this;
    let turn = null;

    for (let i = 0; i < colors; ++i) {
      const t = (prevTurn + 1 + i) % colors;

      if (this.getValidMoves(game, {
        turn: t,
        index,
        data,
        lastMove
      }, t).length > 0) {
        turn = t;
        break;
      }
    }

    return {
      turn,
      index,
      data,
      lastMove
    };
  }

  getScore(game, gameState, color) {
    const board = _board.Board.fromGame(game, gameState);

    let score = 0;

    for (const square of board) {
      if (square && square.enabled && square.color === color) {
        ++score;
      }
    }

    return score;
  }

  newGame(gameId) {
    const {
      boardSize
    } = this;
    const board = new _board.Board();
    board.reset(boardSize); // TODO: center? gets ugly with an odd dimension

    board.get({
      x: 3,
      y: 3
    }).color = 0;
    board.get({
      x: 4,
      y: 3
    }).color = 1;
    board.get({
      x: 3,
      y: 4
    }).color = 1;
    board.get({
      x: 4,
      y: 4
    }).color = 0;
    const gameStates = [{
      turn: 0,
      index: 0,
      data: board.getData(),
      lastMove: null
    }];
    return {
      gameId,
      ruleSet: this.ruleSet,
      mask: board.getMask(),
      colors: Object.freeze(['black', 'white']),
      size: Object.freeze(_objectSpread({}, boardSize)),
      gameStates: Object.freeze(gameStates)
    };
  }

}

class RulesReversed extends RulesStandard {
  constructor() {
    super(...arguments);
    this.name = 'Reversed';
    this.ruleSet = "reversed"
    /* reversed */
    ;
  }

  compareScores(score1, score2) {
    return score2 - score1;
  }

}

const rulesStandard = new RulesStandard();
exports.rulesStandard = rulesStandard;
const rulesReversed = new RulesReversed();
exports.rulesReversed = rulesReversed;
const ruleSets = [rulesStandard, rulesReversed];
exports.ruleSets = ruleSets;
const ruleSetMap = new Map();
exports.ruleSetMap = ruleSetMap;

for (const ruleSet of ruleSets) {
  ruleSetMap.set(ruleSet.ruleSet, ruleSet);
}

/***/ }),

/***/ "./src/server/app.ts":
/*!***************************!*\
  !*** ./src/server/app.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.app = void 0;

var _express = _interopRequireDefault(__webpack_require__(/*! express */ "express"));

var _expressCsp = _interopRequireDefault(__webpack_require__(/*! express-csp */ "express-csp"));

var _path = _interopRequireDefault(__webpack_require__(/*! path */ "path"));

var _compression = _interopRequireDefault(__webpack_require__(/*! compression */ "compression"));

var _config = __webpack_require__(/*! data/config.yaml */ "./src/data/config.yaml");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
exports.app = app;

for (const [key, value] of Object.entries(_config.appSettings)) {
  app.set(key, value);
}

if (process.env.R3_SERVICE_HOST) app.set('host', process.env.R3_SERVICE_HOST);
if (process.env.R3_SERVICE_PORT) app.set('port', process.env.R3_SERVICE_PORT);
app.use((0, _compression.default)(), _express.default.static(_path.default.join(__dirname, 'www')));

_expressCsp.default.extend(app, _config.cspPolicy);

app.use(__webpack_require__(/*! body-parser */ "body-parser").json());
app.get('/health', (req, res) => {
  res.writeHead(200);
  res.end();
});

/***/ }),

/***/ "./src/server/game-state.entity.ts":
/*!*****************************************!*\
  !*** ./src/server/game-state.entity.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.GameStateEntity = void 0;

var _typeorm = __webpack_require__(/*! typeorm */ "typeorm");

var _game = __webpack_require__(/*! ./game.entity */ "./src/server/game.entity.ts");

var _point = __webpack_require__(/*! ./point.field */ "./src/server/point.field.ts");

var _metadata = __webpack_require__(/*! ./metadata.field */ "./src/server/metadata.field.ts");

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

let GameStateEntity = class GameStateEntity {};
exports.GameStateEntity = GameStateEntity;

__decorate([(0, _typeorm.PrimaryColumn)('uuid'), __metadata("design:type", String)], GameStateEntity.prototype, "gameId", void 0);

__decorate([(0, _typeorm.PrimaryColumn)({
  type: 'integer'
}), __metadata("design:type", Number)], GameStateEntity.prototype, "index", void 0);

__decorate([(0, _typeorm.Column)(() => _metadata.MetadataField), __metadata("design:type", _metadata.MetadataField)], GameStateEntity.prototype, "meta", void 0);

__decorate([(0, _typeorm.ManyToOne)(() => _game.GameEntity, game => game.gameStates), __metadata("design:type", _game.GameEntity)], GameStateEntity.prototype, "game", void 0);

__decorate([(0, _typeorm.Column)({
  type: 'integer',
  nullable: true
}), __metadata("design:type", Number)], GameStateEntity.prototype, "turn", void 0);

__decorate([(0, _typeorm.Column)(() => _point.PointFieldNull), __metadata("design:type", _point.PointFieldNull)], GameStateEntity.prototype, "lastMove", void 0);

__decorate([(0, _typeorm.Column)({
  type: 'simple-array'
}), __metadata("design:type", Array)], GameStateEntity.prototype, "data", void 0);

exports.GameStateEntity = GameStateEntity = __decorate([(0, _typeorm.Entity)('GameState')], GameStateEntity);

/***/ }),

/***/ "./src/server/game.entity.ts":
/*!***********************************!*\
  !*** ./src/server/game.entity.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.GameEntity = void 0;

var _typeorm = __webpack_require__(/*! typeorm */ "typeorm");

var _gameState = __webpack_require__(/*! ./game-state.entity */ "./src/server/game-state.entity.ts");

var _room = __webpack_require__(/*! ./room.entity */ "./src/server/room.entity.ts");

var _metadata = __webpack_require__(/*! ./metadata.field */ "./src/server/metadata.field.ts");

var _lodash = __webpack_require__(/*! lodash */ "lodash");

var _size = __webpack_require__(/*! server/size.field */ "./src/server/size.field.ts");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

let GameEntity = class GameEntity {
  static toGame(gameEntity) {
    const gameStates = (0, _lodash.sortBy)(gameEntity.gameStates, gs => gs.index);
    return {
      gameId: gameEntity.id,
      size: _objectSpread({}, gameEntity.size),
      colors: [...gameEntity.colors],
      mask: gameEntity.mask.split('').map(m => m === '1'),
      ruleSet: gameEntity.ruleSet,
      gameStates: gameStates.map(gs => ({
        index: gs.index,
        turn: gs.turn,
        data: gs.data.map(v => v === 'x' ? null : parseInt(v, 10)),
        lastMove: gs.lastMove.x == null || gs.lastMove.y == null ? null : _objectSpread({}, gs.lastMove)
      }))
    };
  }

};
exports.GameEntity = GameEntity;

__decorate([(0, _typeorm.PrimaryGeneratedColumn)('uuid'), __metadata("design:type", String)], GameEntity.prototype, "id", void 0);

__decorate([(0, _typeorm.Column)(() => _metadata.MetadataField), __metadata("design:type", _metadata.MetadataField)], GameEntity.prototype, "meta", void 0);

__decorate([(0, _typeorm.Column)('simple-array'), __metadata("design:type", Array)], GameEntity.prototype, "colors", void 0);

__decorate([(0, _typeorm.OneToMany)(() => _gameState.GameStateEntity, gameState => gameState.game, {
  cascade: true
}), __metadata("design:type", Array)], GameEntity.prototype, "gameStates", void 0);

__decorate([(0, _typeorm.Column)(() => _size.SizeField), __metadata("design:type", _size.SizeField)], GameEntity.prototype, "size", void 0);

__decorate([(0, _typeorm.Column)(), __metadata("design:type", String)], GameEntity.prototype, "mask", void 0);

__decorate([(0, _typeorm.OneToOne)(() => _room.RoomEntity, {
  nullable: true
}), __metadata("design:type", _room.RoomEntity)], GameEntity.prototype, "room", void 0);

__decorate([(0, _typeorm.Column)(), __metadata("design:type", String)], GameEntity.prototype, "ruleSet", void 0);

exports.GameEntity = GameEntity = __decorate([(0, _typeorm.Entity)('Game')], GameEntity);

/***/ }),

/***/ "./src/server/login.entity.ts":
/*!************************************!*\
  !*** ./src/server/login.entity.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.LoginEntity = void 0;

var _typeorm = __webpack_require__(/*! typeorm */ "typeorm");

var _user = __webpack_require__(/*! ./user.entity */ "./src/server/user.entity.ts");

var _metadata = __webpack_require__(/*! server/metadata.field */ "./src/server/metadata.field.ts");

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

let LoginEntity = class LoginEntity {};
exports.LoginEntity = LoginEntity;

__decorate([(0, _typeorm.PrimaryGeneratedColumn)('uuid'), __metadata("design:type", String)], LoginEntity.prototype, "id", void 0);

__decorate([(0, _typeorm.Column)(() => _metadata.MetadataField), __metadata("design:type", _metadata.MetadataField)], LoginEntity.prototype, "meta", void 0);

__decorate([(0, _typeorm.Column)(), (0, _typeorm.Index)({
  unique: true
}), __metadata("design:type", String)], LoginEntity.prototype, "username", void 0);

__decorate([(0, _typeorm.Column)(), __metadata("design:type", String)], LoginEntity.prototype, "passwordHash", void 0);

__decorate([(0, _typeorm.OneToOne)(() => _user.UserEntity, user => user.login), __metadata("design:type", _user.UserEntity)], LoginEntity.prototype, "user", void 0);

__decorate([(0, _typeorm.Column)('uuid', {
  nullable: true
}), __metadata("design:type", String)], LoginEntity.prototype, "userId", void 0);

exports.LoginEntity = LoginEntity = __decorate([(0, _typeorm.Entity)('Login')], LoginEntity);

/***/ }),

/***/ "./src/server/main.ts":
/*!****************************!*\
  !*** ./src/server/main.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es6.array.sort */ "./node_modules/core-js/modules/es6.array.sort.js");

__webpack_require__(/*! ./error-handler */ "./src/server/error-handler.ts");

__webpack_require__(/*! ./polyfills */ "./src/server/polyfills.ts");

var _typeorm = __webpack_require__(/*! typeorm */ "typeorm");

var _rxjs = __webpack_require__(/*! rxjs */ "rxjs");

var _operators = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");

var _rxjs2 = __webpack_require__(/*! ./rxjs */ "./src/server/rxjs.ts");

var _validation = __webpack_require__(/*! src/validation */ "./src/validation.ts");

var _game = __webpack_require__(/*! ./game.entity */ "./src/server/game.entity.ts");

var _gameState = __webpack_require__(/*! ./game-state.entity */ "./src/server/game-state.entity.ts");

var _login = __webpack_require__(/*! ./login.entity */ "./src/server/login.entity.ts");

var _room = __webpack_require__(/*! ./room.entity */ "./src/server/room.entity.ts");

var _session = __webpack_require__(/*! ./session.entity */ "./src/server/session.entity.ts");

var _user = __webpack_require__(/*! ./user.entity */ "./src/server/user.entity.ts");

var _ruleSets = __webpack_require__(/*! src/rule-sets */ "./src/rule-sets.ts");

var _app = __webpack_require__(/*! ./app */ "./src/server/app.ts");

var _config = __webpack_require__(/*! data/config.yaml */ "./src/data/config.yaml");

var _colors = __webpack_require__(/*! data/colors.yaml */ "./src/data/colors.yaml");

var _v = _interopRequireDefault(__webpack_require__(/*! uuid/v4 */ "uuid/v4"));

var _moment = _interopRequireDefault(__webpack_require__(/*! moment */ "moment"));

var _assert = _interopRequireDefault(__webpack_require__(/*! assert */ "assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  OPENSHIFT_REDIS_HOST,
  OPENSHIFT_REDIS_PASSWORD,
  OPENSHIFT_REDIS_PORT
} = process.env;

const server = __webpack_require__(/*! http */ "http").Server(_app.app),
      io = __webpack_require__(/*! socket.io */ "socket.io")(server);

io.engine['generateId'] = _v.default;

if (OPENSHIFT_REDIS_HOST) {
  const redis = __webpack_require__(/*! redis */ "redis").createClient,
        adapter = __webpack_require__(/*! socket.io-redis */ "socket.io-redis"),
        pub = redis(OPENSHIFT_REDIS_PORT, OPENSHIFT_REDIS_HOST, {
    auth_pass: OPENSHIFT_REDIS_PASSWORD
  }),
        sub = redis(OPENSHIFT_REDIS_PORT, OPENSHIFT_REDIS_HOST, {
    return_buffers: true,
    auth_pass: OPENSHIFT_REDIS_PASSWORD
  });

  io.adapter(adapter({
    pubClient: pub,
    subClient: sub
  }));
}

function getSocket(sessionId) {
  return Object.entries(io.of('/').connected).filter(([id, socket]) => id === sessionId).map(([id, socket]) => socket)[0] || null;
}

async function getJoinedRoomIds(manager, sessionId) {
  const socket = getSocket(sessionId);
  if (!socket) return [];
  const rooms = await manager.findByIds(_room.RoomEntity, Object.keys(socket.rooms));
  return rooms.map(room => room.id);
}

async function joinRoom(manager, roomId, sessionId) {
  const socket = getSocket(sessionId);
  await new Promise((resolve, reject) => {
    socket.join(roomId, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  await flushJoinedRooms(manager, sessionId);
  await flushUpdate(manager, roomId, sessionId);
  const {
    nick
  } = await manager.findOne(_session.SessionEntity, sessionId, {
    select: ['nick']
  });
  await statusMessage(roomId, `${nick} has joined the room.`);
}

async function flushJoinedRooms(manager, sessionId) {
  const roomIds = await getJoinedRoomIds(manager, sessionId);
  io.to(sessionId).emit('joinedRooms', roomIds);
}

async function flushRooms(manager, sessionId) {
  const rooms = (await manager.find(_room.RoomEntity)).map(_room.RoomEntity.toRoom);
  const emitter = sessionId ? io.to(sessionId) : io;
  emitter.emit('rooms', rooms);
}

async function leaveRoom(manager, sessionId, roomId) {
  const socket = getSocket(sessionId);
  await new Promise((resolve, reject) => {
    socket.leave(roomId, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  await flushJoinedRooms(manager, sessionId);
  const {
    nick
  } = await manager.findOne(_session.SessionEntity, sessionId, {
    select: ['nick']
  });
  await statusMessage(roomId, `${nick} has left the room.`);
}

function statusMessage(message, roomId, sessionId) {
  io.to(sessionId || roomId).emit('message', {
    roomId,
    message
  });
  return true;
}

function chatMessage(user, message, roomId) {
  io.to(roomId).emit('message', {
    roomId,
    user,
    message
  });
  return true;
}

async function flushUpdate(manager, roomId, sessionId) {
  await transaction(manager, async manager => {
    const room = await manager.findOne(_room.RoomEntity, roomId);
    if (!room) return;
    const game = await manager.findOne(_game.GameEntity, room.gameId, {
      relations: ['gameStates']
    });
    if (!game) return;
    io.to(sessionId || room.id).emit('update', _game.GameEntity.toGame(game));
  });
}

async function cleanupRooms(manager) {
  await transaction(manager, async manager => {
    let removed = 0;
    await Promise.all((await manager.find(_room.RoomEntity, {
      select: ['id', 'expires']
    })).map(async room => {
      const clients = await new Promise((resolve, reject) => {
        io.in(room.id).clients((err, clients) => {
          if (err) reject(err);else resolve(clients);
        });
      });

      if (clients.length === 0) {
        if (room.expires) {
          if ((0, _moment.default)(room.expires).isSameOrBefore()) {
            console.log(`Deleting room ${room.id}...`);
            await manager.remove(room);
            ++removed;
          }
        } else {
          const expires = (0, _moment.default)().add(_config.cleanup.rooms.expireSeconds, 's');
          console.log(`Queuing room ${room.id} for deletion ${expires.fromNow()}...`);
          room.expires = expires.toDate();
          await manager.save(room);
        }
      }
    }));
    if (removed) await flushRooms(manager);
  });
}

async function newGame(manager, roomId, ruleSet) {
  statusMessage('New game', roomId);

  const rules = _ruleSets.ruleSetMap.get(ruleSet);

  return await transaction(manager, async manager => {
    const game = rules.newGame((0, _v.default)());
    const gameEntity = await manager.create(_game.GameEntity, {
      id: game.gameId,
      colors: [...game.colors],
      mask: game.mask.map(v => v ? '1' : '0').join(''),
      size: _objectSpread({}, game.size),
      ruleSet: game.ruleSet
    });
    await manager.save(gameEntity);
    await saveGameStates(manager, game);
    await manager.update(_room.RoomEntity, roomId, {
      gameId: gameEntity.id
    });
    flushRooms(manager);
    flushUpdate(manager, roomId);
    return game;
  });
}

async function saveGameStates(manager, game) {
  return await transaction(manager, async manager => {
    await Promise.all(game.gameStates.map(async (gs, index) => {
      let gameState = await manager.findOne(_gameState.GameStateEntity, {
        gameId: game.gameId,
        index
      });
      if (!gameState) gameState = await manager.create(_gameState.GameStateEntity, {
        gameId: game.gameId,
        index
      });
      gameState.turn = gs.turn;
      gameState.data = gs.data.map(v => v == null ? 'x' : String(v));
      gameState.lastMove = _objectSpread({}, gs.lastMove);
      await manager.save(gameState);
    }));
  });
}

const transaction = (() => {
  let m = null;
  return (manager, fn) => {
    (0, _assert.default)(manager);

    if (m) {
      return fn(m);
    } else {
      return manager.transaction(async manager => {
        m = manager;

        try {
          return await fn(m);
        } finally {
          m = null;
        }
      });
    }
  };
})();

async function createRoom(manager, sessionId, name, password) {
  if (!(0, _validation.isValidRoomName)(name)) throw new Error('Invalid room name.');
  return await transaction(manager, async manager => {
    const roomEntity = await manager.create(_room.RoomEntity, {
      name,
      password
    });
    await manager.save(roomEntity);
    await joinRoom(manager, roomEntity.id, sessionId);
    await newGame(manager, roomEntity.id, "standard"
    /* standard */
    );
    return roomEntity;
  });
}

async function makeMove(manager, roomId, position) {
  return await transaction(manager, async manager => {
    const roomEntity = await manager.findOne(_room.RoomEntity, roomId);
    const gameEntity = await manager.findOne(_game.GameEntity, roomEntity.gameId, {
      relations: ['gameStates']
    });

    const rules = _ruleSets.ruleSetMap.get(gameEntity.ruleSet);

    let game = _game.GameEntity.toGame(gameEntity);

    const prevGameState = game.gameStates.slice(-1)[0];
    const nextGameState = rules.makeMove(game, prevGameState, position);

    if (!nextGameState) {
      return false;
    }

    game = _objectSpread({}, game, {
      gameStates: [...game.gameStates, nextGameState]
    });
    await saveGameStates(manager, game);

    if (rules.isGameOver(game, nextGameState)) {
      const scores = Array.from({
        length: rules.colors
      }).map((_, color) => ({
        color: _colors.colors[game.colors[color]].displayName,
        score: rules.getScore(game, nextGameState, color)
      }));
      scores.sort((c1, c2) => {
        const r1 = rules.compareScores(c1.score, c2.score);
        return r1 === 0 ? c1.color.localeCompare(c2.color) : r1;
      });
      const bestScore = scores[0].score;
      const winners = scores.filter(({
        score
      }) => rules.compareScores(score, bestScore));
      let message;

      if (winners.length !== 1) {
        message = 'Draw game.';
      } else {
        message = `${winners[0].color} wins.`;
      }

      await statusMessage(`${message}:\n${scores.map(({
        color,
        score
      }) => `${color}: ${score}`).join('\n')}`, roomId);
    }

    await flushUpdate(manager, roomId);
    return true;
  });
}

(async () => {
  try {
    const {
      manager
    } = await (0, _typeorm.createConnection)(_objectSpread({}, _config.connectionOptions, {
      entities: [_game.GameEntity, _gameState.GameStateEntity, _login.LoginEntity, _room.RoomEntity, _session.SessionEntity, _user.UserEntity]
    }));
    (0, _rxjs.interval)(_moment.default.duration(_config.cleanup.rooms.checkSeconds, 's').asMilliseconds()).subscribe(async () => {
      cleanupRooms(manager);
    });
    let connections = 0;
    (0, _rxjs2.fromNodeEvent)(io, 'connection').subscribe(async socket => {
      console.log(`User connected, ${++connections} connected, ${socket.id}`);
      const disconnecting = (0, _rxjs2.fromNodeEvent)(socket, 'disconnecting').pipe((0, _operators.take)(1));
      const disconnected = (0, _rxjs2.fromNodeEvent)(socket, 'disconnect').pipe((0, _operators.take)(1));

      function handleCallbackEvent(eventName, fn) {
        const result = new _rxjs.Subject();
        (0, _rxjs2.fromNodeEvent)(socket, eventName).pipe((0, _operators.takeUntil)(disconnected), (0, _operators.mergeMap)(([value, callback]) => (0, _rxjs.of)(value).pipe((0, _operators.mergeMap)(value => transaction(manager, async manager => fn(_objectSpread({
          manager
        }, value)))), (0, _operators.tap)({
          next(value) {
            callback(null, value == null ? {} : value);
          },

          error(err) {
            console.error(err);
            callback(err == null ? {} : err.message, null);
          }

        }), (0, _operators.onErrorResumeNext)()))).subscribe(result);
        return result;
      }

      const sessionId = socket.id;
      await manager.save((await manager.create(_session.SessionEntity, {
        id: sessionId,
        nick: 'Guest'
      })));
      disconnecting.subscribe(async () => {
        await transaction(manager, async manager => {
          try {
            const roomIds = await getJoinedRoomIds(manager, sessionId);

            if (roomIds.length > 0) {
              const {
                nick
              } = await manager.findOne(_session.SessionEntity, sessionId, {
                select: ['nick']
              });
              await Promise.all(roomIds.map(roomId => statusMessage(`${nick} has disconnected.`, roomId)));
            }
          } finally {
            manager.delete(_session.SessionEntity, sessionId);
          }
        });
      });
      disconnected.subscribe(async () => {
        console.log(`User disconnected, ${--connections} connected`);
      });
      const commands = {
        async help(roomId) {
          await statusMessage(`Available commands:
/?
/help
/nick <name>
/quit
/who
`, roomId, sessionId);
        },

        async '?'(roomId) {
          await commands.help(roomId);
        },

        async nick(roomId, nick) {
          if (!(0, _validation.isValidNick)(nick)) throw new Error('Invalid nick.');
          let previousNick;
          await transaction(manager, async manager => {
            const session = await manager.findOne(_session.SessionEntity, sessionId);
            const existingSession = (await manager.count(_session.SessionEntity, {
              nick
            })) > 0;
            const existingUser = (await manager.count(_user.UserEntity, {
              nick
            })) > 0;

            if (existingSession || existingUser) {
              throw new Error('Nick is already in use.');
            }

            previousNick = session.nick;
            session.nick = nick;

            if (session.userId) {
              await manager.update(_user.UserEntity, session.userId, {
                nick
              });
            }

            await manager.save(session);
          });
          await statusMessage(`${previousNick} is now known as ${nick}.`, roomId);
        },

        async quit(roomId) {
          await leaveRoom(manager, sessionId, roomId);
        },

        async who(roomId) {
          const clients = await new Promise((resolve, reject) => {
            io.in(roomId).clients((err, clients) => {
              if (err) reject(err);else resolve(clients);
            });
          });
          const sessions = await manager.findByIds(_session.SessionEntity, clients);
          const nicks = sessions.map(s => s.nick).sort();
          await statusMessage(`Users in room:\n${nicks.join('\n')}`, roomId, sessionId);
        }

      };

      async function command(roomId, raw) {
        const [cmd, ...params] = raw.trim().split(/\s+/g);

        try {
          if (!commands.hasOwnProperty(cmd)) throw new Error('Unknown command.');
          const joinedRoomIds = await getJoinedRoomIds(manager, sessionId);
          if (!joinedRoomIds.includes(roomId)) throw new Error('Not in room.');
          await commands[cmd](roomId, ...params);
        } catch (ex) {
          if (ex && ex.message) {
            await statusMessage(ex.message, roomId, sessionId);
          }

          throw ex;
        }
      }

      handleCallbackEvent('makeMove', async ({
        roomId,
        position
      }) => {
        if (!(await makeMove(manager, roomId, position))) throw new Error('Failed to make move.');
      });
      handleCallbackEvent('newGame', async ({
        roomId,
        ruleSet
      }) => {
        const game = await newGame(manager, roomId, ruleSet);
        if (!game) throw new Error('Failed to create game.');
        return {
          game
        };
      });
      handleCallbackEvent('sendMessage', async ({
        roomId,
        message
      }) => {
        if (message.startsWith('/')) {
          await command(roomId, message.slice(1));
          return;
        }

        const {
          nick
        } = await manager.findOne(_session.SessionEntity, sessionId, {
          select: ['nick']
        });
        if (!(await chatMessage(nick, message, roomId))) throw new Error('Failed to send message.');
      });
      handleCallbackEvent('createRoom', async ({
        manager,
        name,
        password
      }) => {
        const roomEntity = await createRoom(manager, sessionId, name, password);
        return _room.RoomEntity.toRoom(roomEntity);
      });
      handleCallbackEvent('joinRoom', async ({
        manager,
        roomId,
        password
      }) => {
        const roomEntity = await manager.findOne(_room.RoomEntity, roomId);
        if (!roomEntity) throw new Error('Failed to join room.');

        if (roomEntity.password) {
          if (!password) throw new Error('Room requires a password.'); // TODO: hash

          if (roomEntity.password !== password) throw new Error('Incorrect password.');
        }

        manager.update(_room.RoomEntity, roomId, {
          expires: null
        });
        await joinRoom(manager, roomId, sessionId);
        return _room.RoomEntity.toRoom(roomEntity);
      });
      handleCallbackEvent('leaveRoom', async ({
        manager,
        roomId
      }) => {
        await leaveRoom(manager, sessionId, roomId);
      });
      flushRooms(manager, sessionId);
    });
  } catch (ex) {
    console.error(ex);
  }
})();

server.listen(_app.app.get('port'), _app.app.get('host'), err => {
  if (err) {
    console.error(err);
    return;
  }

  const {
    address,
    port
  } = server.address();
  console.log(`Process ${process.pid} listening at ${address}:${port}...`);
});

/***/ }),

/***/ "./src/server/metadata.field.ts":
/*!**************************************!*\
  !*** ./src/server/metadata.field.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.MetadataField = void 0;

var _typeorm = __webpack_require__(/*! typeorm */ "typeorm");

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

class MetadataField {}

exports.MetadataField = MetadataField;

__decorate([(0, _typeorm.CreateDateColumn)({
  select: false
}), __metadata("design:type", Date)], MetadataField.prototype, "created", void 0);

__decorate([(0, _typeorm.UpdateDateColumn)({
  select: false
}), __metadata("design:type", Date)], MetadataField.prototype, "updated", void 0);

/***/ }),

/***/ "./src/server/point.field.ts":
/*!***********************************!*\
  !*** ./src/server/point.field.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.PointFieldNull = exports.PointField = void 0;

var _typeorm = __webpack_require__(/*! typeorm */ "typeorm");

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

class PointField {}

exports.PointField = PointField;

__decorate([(0, _typeorm.Column)({
  type: 'integer'
}), __metadata("design:type", Number)], PointField.prototype, "x", void 0);

__decorate([(0, _typeorm.Column)({
  type: 'integer'
}), __metadata("design:type", Number)], PointField.prototype, "y", void 0);

class PointFieldNull {}

exports.PointFieldNull = PointFieldNull;

__decorate([(0, _typeorm.Column)({
  type: 'integer',
  nullable: true
}), __metadata("design:type", Number)], PointFieldNull.prototype, "x", void 0);

__decorate([(0, _typeorm.Column)({
  type: 'integer',
  nullable: true
}), __metadata("design:type", Number)], PointFieldNull.prototype, "y", void 0);

/***/ }),

/***/ "./src/server/room.entity.ts":
/*!***********************************!*\
  !*** ./src/server/room.entity.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.RoomEntity = void 0;

var _typeorm = __webpack_require__(/*! typeorm */ "typeorm");

var _game = __webpack_require__(/*! ./game.entity */ "./src/server/game.entity.ts");

var _metadata = __webpack_require__(/*! server/metadata.field */ "./src/server/metadata.field.ts");

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

let RoomEntity = class RoomEntity {
  static toRoom(roomEntity) {
    return {
      roomId: roomEntity.id,
      gameId: roomEntity.gameId,
      name: roomEntity.name,
      hasPassword: !!roomEntity.password
    };
  }

};
exports.RoomEntity = RoomEntity;

__decorate([(0, _typeorm.PrimaryGeneratedColumn)('uuid'), __metadata("design:type", String)], RoomEntity.prototype, "id", void 0);

__decorate([(0, _typeorm.Column)(() => _metadata.MetadataField), __metadata("design:type", _metadata.MetadataField)], RoomEntity.prototype, "meta", void 0);

__decorate([(0, _typeorm.Column)(), __metadata("design:type", String)], RoomEntity.prototype, "name", void 0);

__decorate([(0, _typeorm.Column)({
  nullable: true
}), __metadata("design:type", Date)], RoomEntity.prototype, "expires", void 0);

__decorate([(0, _typeorm.Column)(), __metadata("design:type", String)], RoomEntity.prototype, "password", void 0);

__decorate([(0, _typeorm.Column)('uuid', {
  nullable: true
}), __metadata("design:type", String)], RoomEntity.prototype, "gameId", void 0);

__decorate([(0, _typeorm.OneToOne)(() => _game.GameEntity, {
  nullable: true
}), (0, _typeorm.JoinColumn)(), __metadata("design:type", _game.GameEntity)], RoomEntity.prototype, "game", void 0);

exports.RoomEntity = RoomEntity = __decorate([(0, _typeorm.Entity)('Room')], RoomEntity);

/***/ }),

/***/ "./src/server/rxjs.ts":
/*!****************************!*\
  !*** ./src/server/rxjs.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.fromNodeEvent = void 0;

var _rxjs = __webpack_require__(/*! rxjs */ "rxjs");

const fromNodeEvent = (target, event) => (0, _rxjs.fromEventPattern)(e => {
  target.addListener(event, e);
}, e => {
  target.removeListener(event, e);
});

exports.fromNodeEvent = fromNodeEvent;

/***/ }),

/***/ "./src/server/session.entity.ts":
/*!**************************************!*\
  !*** ./src/server/session.entity.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.SessionEntity = void 0;

var _typeorm = __webpack_require__(/*! typeorm */ "typeorm");

var _user = __webpack_require__(/*! ./user.entity */ "./src/server/user.entity.ts");

var _metadata = __webpack_require__(/*! server/metadata.field */ "./src/server/metadata.field.ts");

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

let SessionEntity = class SessionEntity {};
exports.SessionEntity = SessionEntity;

__decorate([(0, _typeorm.PrimaryColumn)('uuid'), __metadata("design:type", String)], SessionEntity.prototype, "id", void 0);

__decorate([(0, _typeorm.Column)(() => _metadata.MetadataField), __metadata("design:type", _metadata.MetadataField)], SessionEntity.prototype, "meta", void 0);

__decorate([(0, _typeorm.Column)(), __metadata("design:type", String)], SessionEntity.prototype, "nick", void 0);

__decorate([(0, _typeorm.ManyToOne)(() => _user.UserEntity, userEntity => userEntity.sessions), __metadata("design:type", _user.UserEntity)], SessionEntity.prototype, "user", void 0);

__decorate([(0, _typeorm.Column)('uuid', {
  nullable: true
}), __metadata("design:type", String)], SessionEntity.prototype, "userId", void 0);

exports.SessionEntity = SessionEntity = __decorate([(0, _typeorm.Entity)('Session')], SessionEntity);

/***/ }),

/***/ "./src/server/size.field.ts":
/*!**********************************!*\
  !*** ./src/server/size.field.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.SizeFieldNull = exports.SizeField = void 0;

var _typeorm = __webpack_require__(/*! typeorm */ "typeorm");

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

class SizeField {}

exports.SizeField = SizeField;

__decorate([(0, _typeorm.Column)({
  type: 'integer'
}), __metadata("design:type", Number)], SizeField.prototype, "width", void 0);

__decorate([(0, _typeorm.Column)({
  type: 'integer'
}), __metadata("design:type", Number)], SizeField.prototype, "height", void 0);

class SizeFieldNull {}

exports.SizeFieldNull = SizeFieldNull;

__decorate([(0, _typeorm.Column)({
  type: 'integer',
  nullable: true
}), __metadata("design:type", Number)], SizeFieldNull.prototype, "width", void 0);

__decorate([(0, _typeorm.Column)({
  type: 'integer',
  nullable: true
}), __metadata("design:type", Number)], SizeFieldNull.prototype, "height", void 0);

/***/ }),

/***/ "./src/server/user.entity.ts":
/*!***********************************!*\
  !*** ./src/server/user.entity.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.UserEntity = void 0;

var _typeorm = __webpack_require__(/*! typeorm */ "typeorm");

var _login = __webpack_require__(/*! ./login.entity */ "./src/server/login.entity.ts");

var _session = __webpack_require__(/*! ./session.entity */ "./src/server/session.entity.ts");

var _metadata = __webpack_require__(/*! server/metadata.field */ "./src/server/metadata.field.ts");

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

let UserEntity = class UserEntity {};
exports.UserEntity = UserEntity;

__decorate([(0, _typeorm.PrimaryGeneratedColumn)('uuid'), __metadata("design:type", String)], UserEntity.prototype, "id", void 0);

__decorate([(0, _typeorm.Column)(() => _metadata.MetadataField), __metadata("design:type", _metadata.MetadataField)], UserEntity.prototype, "meta", void 0);

__decorate([(0, _typeorm.Column)({
  unique: true
}), __metadata("design:type", String)], UserEntity.prototype, "nick", void 0);

__decorate([(0, _typeorm.OneToMany)(() => _session.SessionEntity, session => session.user), __metadata("design:type", Array)], UserEntity.prototype, "sessions", void 0);

__decorate([(0, _typeorm.OneToOne)(() => _login.LoginEntity, login => login.user, {
  cascade: true
}), (0, _typeorm.JoinColumn)(), __metadata("design:type", _login.LoginEntity)], UserEntity.prototype, "login", void 0);

exports.UserEntity = UserEntity = __decorate([(0, _typeorm.Entity)('User')], UserEntity);

/***/ }),

/***/ "./src/square.ts":
/*!***********************!*\
  !*** ./src/square.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.Square = void 0;

class Square {
  constructor(position, bounds) {
    this.position = position;
    this.bounds = bounds;
    this.enabled = true;
    this.color = null;
  }

  get empty() {
    return this.color === null;
  }

}

exports.Square = Square;

/***/ }),

/***/ "./src/validation.ts":
/*!***************************!*\
  !*** ./src/validation.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.isValidNick = isValidNick;
exports.isValidRoomName = isValidRoomName;

var _config = __webpack_require__(/*! data/config.yaml */ "./src/data/config.yaml");

function isValidNick(nick) {
  if (!nick) return false;
  if (nick.length > _config.validation.maxNickLength) return false;
  return /^[_a-z][-_a-z0-9]+[_a-z0-9]+/i.test(nick);
}

function isValidRoomName(roomName) {
  if (!roomName) return false;
  if (roomName.length > _config.validation.maxRoomNameLength) return false;
  return true;
}

/***/ })

};;
//# sourceMappingURL=main~server.js.map