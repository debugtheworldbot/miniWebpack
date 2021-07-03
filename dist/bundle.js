
    ;(function(modules){
        function require (id){
            const [fn,mapping] = modules[id]
            function localRequire(path){
                return require(mapping[path])
            }

            const module = {exports:{}}
            fn(localRequire,module,module.exports)
            return module.exports
        }
        require(0)
    })({0:[
            function(require,module,exports){
                "use strict";

var _world = _interopRequireDefault(require("./world.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_world["default"]);
            },
            {"./world.js":1}
        ],1:[
            function(require,module,exports){
                "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _hello = require("./hello.js");

var _default = "".concat(_hello.hello, " from world");

exports["default"] = _default;
            },
            {"./hello.js":2}
        ],2:[
            function(require,module,exports){
                "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hello = void 0;
var hello = "hello";
exports.hello = hello;
            },
            {}
        ],})
  