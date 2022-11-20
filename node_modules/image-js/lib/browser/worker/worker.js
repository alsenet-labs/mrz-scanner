'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webWorkerManager = require('web-worker-manager');

var _webWorkerManager2 = _interopRequireDefault(_webWorkerManager);

var _extend = require('./extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Worker {
  constructor() {
    this._url = null;
    this._deps = [null];
  }
  checkUrl() {
    if (this._url === null) {
      throw new Error('image worker must be initialized with an URL');
    }
  }
  get url() {
    return this._url;
  }
  set url(value) {
    if (typeof value !== 'string') {
      throw new TypeError('worker URL must be a string');
    }
    this._url = value;
    this._deps[0] = value;
  }
  static extendMethod(name, method) {
    let manager;
    let url;
    let runner = {};
    function run(...args) {
      if (!manager) {
        this.checkUrl();
        url = this.url;
        manager = new _webWorkerManager2.default(method.work, { deps: url });
        runner.manager = manager;
      }
      return method.run.call(runner, ...args);
    }
    run.reset = function () {
      if (manager) {
        manager.terminate();
        manager = new _webWorkerManager2.default(method.work, { deps: url });
        runner.manager = manager;
      }
    };
    Worker.prototype[name] = run;
  }
}

(0, _extend2.default)(Worker);

exports.default = new Worker();