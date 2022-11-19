[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

# [DEMO](https://mljs.github.io/libsvm/)

Port of to port libsvm v3.22 using [emscripten](https://github.com/kripken/emscripten) , for usage in the browser or nodejs. 2 build targets: asm and WebAssembly.

What is libsvm?
libsvm is a [c++ library](https://github.com/cjlin1/libsvm) developped by Chih-Chung Chang and Chih-Jen Lin that allows to do support vector machine (aka SVM) classification and regression.

Resources about libsvm:
- [libsvm website](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)
- [libsvm github repository](https://github.com/cjlin1/libsvm)
- [Wikipedia article](https://en.wikipedia.org/wiki/Support_vector_machine)
- Chih-Chung Chang and Chih-Jen Lin, LIBSVM : a library for support vector machines. ACM Transactions on Intelligent Systems and Technology, 2:27:1--27:27, 2011.



# Usage
## Install
```bash
npm install libsvm-js
```

## Load in nodejs
The main entry point loads the WebAssembly build and is asynchronous.
```js
require('libsvm-js').then(SVM => {
    const svm = new SVM(); // ...
});
```

There is an alternative entry point if you want to use asm build. This entrypoint is synchronous.
```js
const SVM = require('libsvm-js/asm');
const svm = new SVM(); // ...
```

## Load in the browser
The npm package contains a bundle for the browser that works with AMD and browser globals. There is one bundle for the asm build and another for the web assembly build. They are located in the `dist/browser` directory of the package. You can load them into your web page with a `script` tag. For the web assembly module, make sure that the libsvm.wasm file is served from the same relative path as the js file.

## Basic usage
This example illustrates how to use the library to train and use an SVM classifier.
```js

async function xor() {
    const SVM = await
    require('libsvm-js');
    const svm = new SVM({
        kernel: SVM.KERNEL_TYPES.RBF, // The type of kernel I want to use
        type: SVM.SVM_TYPES.C_SVC,    // The type of SVM I want to run
        gamma: 1,                     // RBF kernel gamma parameter
        cost: 1                       // C_SVC cost parameter
    });

    // This is the xor problem
    //
    //  1  0
    //  0  1
    const features = [[0, 0], [1, 1], [1, 0], [0, 1]];
    const labels = [0, 0, 1, 1];
    svm.train(features, labels);  // train the model
    const predictedLabel = svm.predictOne([0.7, 0.8]);
    console.log(predictedLabel) // 0
}

xor().then(() => console.log('done!'));
```

# Benchmarks
You can compare the performance of the library in various environments. Run `npm run benchmark` to run the benchmarks with native c/c++ code and with the compiled code with your local version of node.js. For browser performance, go to the [web benchmark page](https://mljs.github.io/libsvm/#benchmarks).

Speed is mainly affected by the javascript engine that compiles it. Since WebAssembly has been stabilized and is an optimization phase, more recent engines are almost always faster.

Speed is also affected by the version of emscripten that generated the build or the options used in the build. I will try to keep up with any improvement that might significantly impact the performance.

## Cross-validation benchmark
I report the results here for the cross-validation benchmark on the iris dataset to get a feeling for how performance compares on different platforms. There are other benchmarks that can be run from the terminal in node.js or in the browser. The performance results are given relative to how they run natively (with compiled c++ code). The benchmarks only consider runtime performance, not load and parse performance.

| Platform | Rel asm perf | Rel wasm perf |
| --- | --- | --- |
| Native | 100% | 100% |
| Node.js 8.1.2 | 34.2% | 52.6% |
| Node.js v7.10.0 | 14.4% | N/A |
| Chrome 59.0.3071.115  | 36.2% | 51.3% |
| Firefox 54.0 | 35.5% | 70.4% |


# What are asm and WebAssembly ?
From [asmjs.org](http;//asmjs.org)
> asm is an optimizable subset of javascript.

From [webassembly.org](http://webassembly.org)
> WebAssembly or wasm is a new portable, size- and load-time-efficient format suitable for compilation to the web

# Should I use asm or WebAssembly ?
Both. You should try to use WebAssembly first and fall back to asm in order to support all browsers.

WebAssembly is currently supported in the latest stable versions of Chrome, Firefox and on preview versions of Safari and Edge.

# API Documentation
<a name="SVM"></a>

## SVM
**Kind**: global class  

* [SVM](#SVM)
    * [new SVM(options)](#new_SVM_new)
    * _instance_
        * [.train(samples, labels)](#SVM+train)
        * [.crossValidation(samples, labels, kFold)](#SVM+crossValidation) ⇒ <code>Array.&lt;number&gt;</code>
        * [.free()](#SVM+free)
        * [.predictOne(sample)](#SVM+predictOne) ⇒ <code>number</code>
        * [.predict(samples)](#SVM+predict) ⇒ <code>Array.&lt;number&gt;</code>
        * [.predictProbability(samples)](#SVM+predictProbability) ⇒ <code>Array.&lt;object&gt;</code>
        * [.predictOneProbability(sample)](#SVM+predictOneProbability) ⇒ <code>object</code>
        * [.predictOneInterval(sample, confidence)](#SVM+predictOneInterval) ⇒ <code>object</code>
        * [.predictInterval(samples, confidence)](#SVM+predictInterval) ⇒ <code>Array.&lt;object&gt;</code>
        * [.getLabels()](#SVM+getLabels) ⇒ <code>Array.&lt;number&gt;</code>
        * [.getSVIndices()](#SVM+getSVIndices) ⇒ <code>Array.&lt;number&gt;</code>
        * [.serializeModel()](#SVM+serializeModel) ⇒ <code>string</code>
    * _static_
        * [.SVM_TYPES](#SVM.SVM_TYPES) : <code>Object</code>
        * [.KERNEL_TYPES](#SVM.KERNEL_TYPES) : <code>Object</code>
        * [.load(serializedModel)](#SVM.load) ⇒ [<code>SVM</code>](#SVM)

<a name="new_SVM_new"></a>

### new SVM(options)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  |  |
| [options.type] | <code>number</code> | <code>SVM_TYPES.C_SVC</code> | Type of SVM to perform, |
| [options.kernel] | <code>number</code> | <code>KERNEL_TYPES.RBF</code> | Kernel function, |
| [options.degree] | <code>number</code> | <code>3</code> | Degree of polynomial, for polynomial kernel |
| [options.gamma] | <code>number</code> |  | Gamma parameter of the RBF, Polynomial and Sigmoid kernels. Default value is 1/num_features |
| [options.coef0] | <code>number</code> | <code>0</code> | coef0 parameter for Polynomial and Sigmoid kernels |
| [options.cost] | <code>number</code> | <code>1</code> | Cost parameter, for C SVC, Epsilon SVR and NU SVR |
| [options.nu] | <code>number</code> | <code>0.5</code> | For NU SVC and NU SVR |
| [options.epsilon] | <code>number</code> | <code>0.1</code> | For epsilon SVR |
| [options.cacheSize] | <code>number</code> | <code>100</code> | Cache size in MB |
| [options.tolerance] | <code>number</code> | <code>0.001</code> | Tolerance |
| [options.shrinking] | <code>boolean</code> | <code>true</code> | Use shrinking euristics (faster), |
| [options.probabilityEstimates] | <code>boolean</code> | <code>false</code> | weather to train SVC/SVR model for probability estimates, |
| [options.weight] | <code>object</code> |  | Set weight for each possible class |
| [options.quiet] | <code>boolean</code> | <code>true</code> | Print info during training if false |

<a name="SVM+train"></a>

### svM.train(samples, labels)
Trains the SVM model.

**Kind**: instance method of [<code>SVM</code>](#SVM)  
**Throws**:

- if SVM instance was instantiated from SVM.load.


| Param | Type | Description |
| --- | --- | --- |
| samples | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> | The training samples. First level of array are the samples, second level are the individual features |
| labels | <code>Array.&lt;number&gt;</code> | The training labels. It should have the same size as the samples. If you are training a classification model, the labels should be distinct integers for each class. If you are training a regression model, each label should be the value of the predicted variable. |

<a name="SVM+crossValidation"></a>

### svM.crossValidation(samples, labels, kFold) ⇒ <code>Array.&lt;number&gt;</code>
Performs k-fold cross-validation (KF-CV). KF-CV separates the data-set into kFold random equally sized partitions,
and uses each as a validation set, with all other partitions used in the training set. Observations left over
from if kFold does not divide the number of observations are left out of the cross-validation process. If
kFold is one, this is equivalent to a leave-on-out cross-validation

**Kind**: instance method of [<code>SVM</code>](#SVM)  
**Returns**: <code>Array.&lt;number&gt;</code> - The array of predicted labels produced by the cross validation. Has a size equal to
the number of samples provided as input.  
**Throws**:

- if SVM instance was instantiated from SVM.load.


| Param | Type | Description |
| --- | --- | --- |
| samples | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> | The training samples. |
| labels | <code>Array.&lt;number&gt;</code> | The training labels. |
| kFold | <code>number</code> | Number of datasets into which to split the training set. |

<a name="SVM+free"></a>

### svM.free()
Free the memory allocated for the model. Since this memory is stored in the memory model of emscripten, it is
allocated within an ArrayBuffer and WILL NOT BE GARBARGE COLLECTED, you have to explicitly free it. So
not calling this will result in memory leaks. As of today in the browser, there is no way to hook the
garbage collection of the SVM object to free it automatically.
Free the memory that was created by the compiled libsvm library to.
store the model. This model is reused every time the predict method is called.

**Kind**: instance method of [<code>SVM</code>](#SVM)  
<a name="SVM+predictOne"></a>

### svM.predictOne(sample) ⇒ <code>number</code>
Predict the label of one sample.

**Kind**: instance method of [<code>SVM</code>](#SVM)  
**Returns**: <code>number</code> - - The predicted label.  

| Param | Type | Description |
| --- | --- | --- |
| sample | <code>Array.&lt;number&gt;</code> | The sample to predict. |

<a name="SVM+predict"></a>

### svM.predict(samples) ⇒ <code>Array.&lt;number&gt;</code>
Predict the label of many samples.

**Kind**: instance method of [<code>SVM</code>](#SVM)  
**Returns**: <code>Array.&lt;number&gt;</code> - - The predicted labels.  

| Param | Type | Description |
| --- | --- | --- |
| samples | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> | The samples to predict. |

<a name="SVM+predictProbability"></a>

### svM.predictProbability(samples) ⇒ <code>Array.&lt;object&gt;</code>
Predict the label with probability estimate of many samples.

**Kind**: instance method of [<code>SVM</code>](#SVM)  
**Returns**: <code>Array.&lt;object&gt;</code> - - An array of objects containing the prediction label and the probability estimates for each label  

| Param | Type | Description |
| --- | --- | --- |
| samples | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> | The samples to predict. |

<a name="SVM+predictOneProbability"></a>

### svM.predictOneProbability(sample) ⇒ <code>object</code>
Predict the label with probability estimate.

**Kind**: instance method of [<code>SVM</code>](#SVM)  
**Returns**: <code>object</code> - - An object containing the prediction label and the probability estimates for each label  

| Param | Type |
| --- | --- |
| sample | <code>Array.&lt;number&gt;</code> | 

<a name="SVM+predictOneInterval"></a>

### svM.predictOneInterval(sample, confidence) ⇒ <code>object</code>
Predict a regression value with a confidence interval

**Kind**: instance method of [<code>SVM</code>](#SVM)  
**Returns**: <code>object</code> - - An object containing the prediction value and the lower and upper bounds of the confidence interval  

| Param | Type | Description |
| --- | --- | --- |
| sample | <code>Array.&lt;number&gt;</code> |  |
| confidence | <code>number</code> | A value between 0 and 1. For example, a value 0.95 will give you the 95% confidence interval of the predicted value. |

<a name="SVM+predictInterval"></a>

### svM.predictInterval(samples, confidence) ⇒ <code>Array.&lt;object&gt;</code>
Predict regression values with confidence intervals

**Kind**: instance method of [<code>SVM</code>](#SVM)  
**Returns**: <code>Array.&lt;object&gt;</code> - - An array of objects each containing the prediction label and the probability estimates for each label  

| Param | Type | Description |
| --- | --- | --- |
| samples | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> | An array of samples. |
| confidence | <code>number</code> | A value between 0 and 1. For example, a value 0.95 will give you the 95% confidence interval of the predicted value. |

<a name="SVM+getLabels"></a>

### svM.getLabels() ⇒ <code>Array.&lt;number&gt;</code>
Get the array of labels from the model. Useful when creating an SVM instance with SVM.load

**Kind**: instance method of [<code>SVM</code>](#SVM)  
**Returns**: <code>Array.&lt;number&gt;</code> - - The list of labels.  
<a name="SVM+getSVIndices"></a>

### svM.getSVIndices() ⇒ <code>Array.&lt;number&gt;</code>
Get the indices of the support vectors from the training set passed to the train method.

**Kind**: instance method of [<code>SVM</code>](#SVM)  
**Returns**: <code>Array.&lt;number&gt;</code> - - The list of indices from the training samples.  
<a name="SVM+serializeModel"></a>

### svM.serializeModel() ⇒ <code>string</code>
Uses libsvm's serialization method of the model.

**Kind**: instance method of [<code>SVM</code>](#SVM)  
**Returns**: <code>string</code> - The serialization string.  
<a name="SVM.SVM_TYPES"></a>

### SVM.SVM_TYPES : <code>Object</code>
SVM classification and regression types

**Kind**: static property of [<code>SVM</code>](#SVM)  
**Properties**

| Name | Description |
| --- | --- |
| C_SVC | The C support vector classifier type |
| NU_SVC | The nu support vector classifier type |
| ONE_CLASS | The one-class support vector classifier type |
| EPSILON_SVR | The epsilon support vector regression type |
| NU_SVR | The nu support vector regression type |

<a name="SVM.KERNEL_TYPES"></a>

### SVM.KERNEL_TYPES : <code>Object</code>
SVM kernel types

**Kind**: static property of [<code>SVM</code>](#SVM)  
**Properties**

| Name | Description |
| --- | --- |
| LINEAR | Linear kernel |
| POLYNOMIAL | Polynomial kernel |
| RBF | Radial basis function (gaussian) kernel |
| SIGMOID | Sigmoid kernel |

<a name="SVM.load"></a>

### SVM.load(serializedModel) ⇒ [<code>SVM</code>](#SVM)
Create a SVM instance from the serialized model.

**Kind**: static method of [<code>SVM</code>](#SVM)  
**Returns**: [<code>SVM</code>](#SVM) - - SVM instance that contains the model.  

| Param | Type | Description |
| --- | --- | --- |
| serializedModel | <code>string</code> | The serialized model. |


# LICENSE
BSD-3-Clause

[npm-image]: https://img.shields.io/npm/v/libsvm-js.svg?style=flat-square
[npm-url]: https://npmjs.org/package/libsvm-js
[download-image]: https://img.shields.io/npm/dm/libsvm-js.svg?style=flat-square
[download-url]: https://npmjs.org/package/libsvm-js
