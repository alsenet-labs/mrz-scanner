'use strict';

module.exports = function (libsvm) {
  const util = require('./util');

  /* eslint-disable camelcase */
  const predict_one = libsvm.cwrap('libsvm_predict_one', 'number', ['number', 'array', 'number']);
  const predict_one_probability = libsvm.cwrap('libsvm_predict_one_probability', 'number', ['number', 'array', 'number', 'number']);
  const add_instance = libsvm.cwrap('add_instance', null, ['number', 'array', 'number', 'number', 'number']);
  const create_svm_nodes = libsvm.cwrap('create_svm_nodes', 'number', ['number', 'number']);
  const train_problem = libsvm.cwrap('libsvm_train_problem', 'number', ['number', 'string']);
  const svm_get_nr_sv = libsvm.cwrap('svm_get_nr_sv', 'number', ['number']);
  const svm_get_nr_class = libsvm.cwrap('svm_get_nr_class', 'number', ['number']);
  const svm_get_sv_indices = libsvm.cwrap('svm_get_sv_indices', null, ['number', 'number']);
  const svm_get_labels = libsvm.cwrap('svm_get_labels', null, ['number', 'number']);
  const svm_free_model = libsvm.cwrap('svm_free_model', null, ['number']);
  const svm_cross_validation = libsvm.cwrap('libsvm_cross_validation', null, ['number', 'string', 'number', 'number']);
  const svm_get_svr_probability = libsvm.cwrap('svm_get_svr_probability', null, ['number']);
  const free_problem = libsvm.cwrap('free_problem', null, ['number']);
  const serialize_model = libsvm.cwrap('serialize_model', 'number', ['number']);
  const deserialize_model = libsvm.cwrap('deserialize_model', 'number', ['string']);

  /* eslint-enable camelcase */

  class SVM {
    /**
         * @constructor
         * @param {object} options
         * @param {number} [options.type=SVM_TYPES.C_SVC] - Type of SVM to perform,
         * @param {number} [options.kernel=KERNEL_TYPES.RBF] - Kernel function,
         * @param {number} [options.degree=3] - Degree of polynomial, for polynomial kernel
         * @param {number} [options.gamma] -  Gamma parameter of the RBF, Polynomial and Sigmoid kernels. Default value is 1/num_features
         * @param {number} [options.coef0=0] - coef0 parameter for Polynomial and Sigmoid kernels
         * @param {number} [options.cost=1] - Cost parameter, for C SVC, Epsilon SVR and NU SVR
         * @param {number} [options.nu=0.5] - For NU SVC and NU SVR
         * @param {number} [options.epsilon=0.1] - For epsilon SVR
         * @param {number} [options.cacheSize=100] - Cache size in MB
         * @param {number} [options.tolerance=0.001] - Tolerance
         * @param {boolean} [options.shrinking=true] - Use shrinking euristics (faster),
         * @param {boolean} [options.probabilityEstimates=false] - weather to train SVC/SVR model for probability estimates,
         * @param {object} [options.weight] - Set weight for each possible class
         * @param {boolean} [options.quiet=true] - Print info during training if false
         */
    constructor(options) {
      this.options = Object.assign({}, options);
      this.model = null;
    }

    /**
         * Trains the SVM model.
         * @param {Array<Array<number>>} samples - The training samples. First level of array are the samples, second
         * level are the individual features
         * @param {Array<number>} labels - The training labels. It should have the same size as the samples. If you are
         * training a classification model, the labels should be distinct integers for each class. If you are training
         * a regression model, each label should be the value of the predicted variable.
         * @throws if SVM instance was instantiated from SVM.load.
         */
    train(samples, labels) {
      if (this._deserialized) throw new Error('Train cannot be called on instance created with SVM.load');
      this.free();
      this.problem = createProblem(samples, labels);
      const command = this.getCommand(samples);
      this.model = train_problem(this.problem, command);
    }

    /**
         * Performs k-fold cross-validation (KF-CV). KF-CV separates the data-set into kFold random equally sized partitions,
         * and uses each as a validation set, with all other partitions used in the training set. Observations left over
         * from if kFold does not divide the number of observations are left out of the cross-validation process. If
         * kFold is one, this is equivalent to a leave-on-out cross-validation
         * @param {Array<Array<number>>} samples - The training samples.
         * @param {Array<number>} labels - The training labels.
         * @param {number} kFold - Number of datasets into which to split the training set.
         * @throws if SVM instance was instantiated from SVM.load.
         * @return {Array<number>} The array of predicted labels produced by the cross validation. Has a size equal to
         * the number of samples provided as input.
         */
    crossValidation(samples, labels, kFold) {
      if (this._deserialized) throw new Error('crossValidation cannot be called on instance created with SVM.load');
      const problem = createProblem(samples, labels);
      const target = libsvm._malloc(labels.length * 8);
      svm_cross_validation(problem, this.getCommand(samples), kFold, target);
      const data = libsvm.HEAPF64.subarray(target / 8, target / 8 + labels.length);
      const arr = Array.from(data);
      libsvm._free(target);
      free_problem(problem);
      return arr;
    }

    /**
         * Free the memory allocated for the model. Since this memory is stored in the memory model of emscripten, it is
         * allocated within an ArrayBuffer and WILL NOT BE GARBARGE COLLECTED, you have to explicitly free it. So
         * not calling this will result in memory leaks. As of today in the browser, there is no way to hook the
         * garbage collection of the SVM object to free it automatically.
         * Free the memory that was created by the compiled libsvm library to.
         * store the model. This model is reused every time the predict method is called.
         */
    free() {
      if (this.problem) {
        free_problem(this.problem);
        this.problem = null;
      }
      if (this.model !== null) {
        svm_free_model(this.model);
        this.model = null;
      }
    }

    getCommand(samples) {
      const options = {};
      Object.assign(options, this.options, {
        gamma: this.options.gamma ? this.options.gamma : 1 / samples[0].length
      });
      return util.getCommand(options);
    }

    /**
         * Predict the label of one sample.
         * @param {Array<number>} sample - The sample to predict.
         * @return {number} - The predicted label.
         */
    predictOne(sample) {
      if (this.model === null) {
        throw new Error('Cannot predict, you must train first');
      }
      return predict_one(this.model, new Uint8Array(new Float64Array(sample).buffer), sample.length);
    }

    /**
         * Predict the label of many samples.
         * @param {Array<Array<number>>} samples - The samples to predict.
         * @return {Array<number>} - The predicted labels.
         */
    predict(samples) {
      let arr = [];
      for (let i = 0; i < samples.length; i++) {
        arr.push(this.predictOne(samples[i]));
      }
      return arr;
    }

    /**
         * Predict the label with probability estimate of many samples.
         * @param {Array<Array<number>>} samples - The samples to predict.
         * @return {Array<object>} - An array of objects containing the prediction label and the probability estimates for each label
         */
    predictProbability(samples) {
      let arr = [];
      for (let i = 0; i < samples.length; i++) {
        arr.push(this.predictOneProbability(samples[i]));
      }
      return arr;
    }

    /** Predict the label with probability estimate.
         * @param {Array<number>} sample
         * @return {object} - An object containing the prediction label and the probability estimates for each label
         */

    predictOneProbability(sample) {
      const labels = this.getLabels();
      const nbLabels = labels.length;
      const estimates = libsvm._malloc(nbLabels * 8);
      const prediction = predict_one_probability(this.model, new Uint8Array(new Float64Array(sample).buffer), sample.length, estimates);
      const estimatesArr = Array.from(libsvm.HEAPF64.subarray(estimates / 8, estimates / 8 + nbLabels));
      const result = {
        prediction,
        estimates: labels.map((label, idx) => ({
          label,
          probability: estimatesArr[idx]
        }))
      };
      libsvm._free(estimates);
      return result;
    }

    /** Predict a regression value with a confidence interval
         * @param {Array<number>} sample
         * @param {number} confidence - A value between 0 and 1. For example, a value 0.95 will give you the 95% confidence interval of the predicted value.
         * @return {object} - An object containing the prediction value and the lower and upper bounds of the confidence interval
         */
    predictOneInterval(sample, confidence) {
      const interval = this._getInterval(confidence);
      const predicted = this.predictOne(sample);
      return {
        predicted,
        interval: [predicted - interval, predicted + interval]
      };
    }

    /** Predict regression values with confidence intervals
         * @param {Array<Array<number>>} samples - An array of samples.
         * @param {number} confidence - A value between 0 and 1. For example, a value 0.95 will give you the 95% confidence interval of the predicted value.
         * @return {Array<object>} - An array of objects each containing the prediction label and the probability estimates for each label
         */
    predictInterval(samples, confidence) {
      const interval = this._getInterval(confidence);
      const predicted = this.predict(samples);
      return predicted.map((pred) => ({
        predicted: pred,
        interval: [pred - interval, pred + interval]
      }));
    }

    _getInterval(confidence) {
      const sigma = svm_get_svr_probability(this.model);
      if (sigma === 0) throw new Error('the model is not a regression with probability estimates');
      if (confidence <= 0 || confidence >= 1) throw new Error('confidence must be greater than 0 and less than 1');
      const p = (1 - confidence) / 2;
      return sigma * Math.sign(p - 0.5) * Math.log2(1 - 2 * Math.abs(p - 0.5));
    }


    /**
         * Get the array of labels from the model. Useful when creating an SVM instance with SVM.load
         * @return {Array<number>} - The list of labels.
         */
    getLabels() {
      const nbLabels = svm_get_nr_class(this.model);
      return getIntArrayFromModel(svm_get_labels, this.model, nbLabels);
    }

    /**
         * Get the indices of the support vectors from the training set passed to the train method.
         * @return {Array<number>} - The list of indices from the training samples.
         */
    getSVIndices() {
      const nSV = svm_get_nr_sv(this.model);
      return getIntArrayFromModel(svm_get_sv_indices, this.model, nSV)
        .map((i) => i - 1);
    }

    /**
         * Uses libsvm's serialization method of the model.
         * @return {string} The serialization string.
         */
    serializeModel() {
      if (!this.model) throw new Error('Cannot serialize model. No model was trained');
      const result = serialize_model(this.model);
      const str = libsvm.Pointer_stringify(result);
      libsvm._free(result);
      return str;
    }

    /**
         * Create a SVM instance from the serialized model.
         * @param {string} serializedModel - The serialized model.
         * @return {SVM} - SVM instance that contains the model.
         */
    static load(serializedModel) {
      const svm = new SVM();
      svm.model = deserialize_model(serializedModel);
      svm._deserialized = true;
      return svm;
    }
  }

  /**
     * SVM classification and regression types
     * @memberof SVM
     * @type {{C_SVC: string, NU_SVC: string, ONE_CLASS: string, EPSILON_SVR: string, NU_SVR: string}}
     * @property C_SVC - The C support vector classifier type
     * @property NU_SVC - The nu support vector classifier type
     * @property ONE_CLASS - The one-class support vector classifier type
     * @property EPSILON_SVR - The epsilon support vector regression type
     * @property NU_SVR - The nu support vector regression type
     */
  SVM.SVM_TYPES = {
    C_SVC: '0', // C support vector classification
    NU_SVC: '1', // NU support vector classification
    ONE_CLASS: '2', // ONE CLASS classification
    EPSILON_SVR: '3', // Epsilon support vector regression
    NU_SVR: '4' // Nu support vector regression
  };


  /**
     * SVM kernel types
     * @memberof SVM
     * @type {{LINEAR: string, POLYNOMIAL: string, RBF: string, SIGMOID: string}}
     * @property LINEAR - Linear kernel
     * @property POLYNOMIAL - Polynomial kernel
     * @property RBF - Radial basis function (gaussian) kernel
     * @property SIGMOID - Sigmoid kernel
     */
  SVM.KERNEL_TYPES = {
    LINEAR: '0',
    POLYNOMIAL: '1',
    RBF: '2', // Radial basis function
    SIGMOID: '3',
    PRECOMPUTED: '4'
  };

  function getIntArrayFromModel(fn, model, size) {
    const offset = libsvm._malloc(size * 4);
    fn(model, offset);
    const data = libsvm.HEAP32.subarray(offset / 4, offset / 4 + size);
    const arr = Array.from(data);
    libsvm._free(offset);
    return arr;
  }

  function createProblem(samples, labels) {
    const nbSamples = samples.length;
    const nbFeatures = samples[0].length;
    const problem = create_svm_nodes(nbSamples, nbFeatures);
    for (let i = 0; i < nbSamples; i++) {
      add_instance(problem, new Uint8Array(new Float64Array(samples[i]).buffer), nbFeatures, labels[i], i);
    }
    return problem;
  }

  return SVM;
};
