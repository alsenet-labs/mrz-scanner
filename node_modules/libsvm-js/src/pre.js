'use strict';

let Module;
(function () {
  function getCurrentPathBrowser() {
    if (
      typeof WorkerGlobalScope !== 'undefined' &&
      self instanceof WorkerGlobalScope
    ) {
      return self.location.href;
    }
    var sc = document.getElementsByTagName('script');

    for (var idx = 0; idx < sc.length; idx++) {
      var s = sc.item(idx);

      if (s.src && s.src.match(/libsvm\.js$/)) {
        return s.src;
      }
    }
    return window.location.href;
  }
  function getModuleForBrowser() {
    let URL;
    if (
      typeof WorkerGlobalScope !== 'undefined' &&
      self instanceof WorkerGlobalScope
    ) {
      URL = self.URL;
    } else {
      URL = window.URL;
    }
    var resolve;
    var promise = new Promise((res, rej) => {
      resolve = res;
    });
    var path = getCurrentPathBrowser();
    var Module = {
      locateFile(url) {
        return new URL(url, path).href;
      },
      onRuntimeInitialized() {
        resolve();
      },
      load() {
        return promise;
      }
    };
    return Module;
  }
  function getModuleForNode() {
    var resolve;
    var promise = new Promise((res) => {
      resolve = res;
    });
    var Module = {
      locateFile(url) {
        return `${__dirname}/${url}`;
      },
      onRuntimeInitialized() {
        resolve();
      },
      load() {
        return promise;
      }
    };
    return Module;
  }

  if (typeof window === 'undefined' && typeof self === 'undefined') {
    Module = getModuleForNode();
  } else {
    Module = getModuleForBrowser();
  }
})();
