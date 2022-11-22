'use strict';

const Matrix = require('ml-matrix').Matrix;

const GaussianKernel = require('ml-kernel-gaussian');
const PolynomialKernel = require('ml-kernel-polynomial');
const ANOVAKernel = require('./kernels/anova-kernel');
const CauchyKernel = require('./kernels/cauchy-kernel');
const ExponentialKernel = require('./kernels/exponential-kernel');
const HistogramKernel = require('./kernels/histogram-intersection-kernel');
const LaplacianKernel = require('./kernels/laplacian-kernel');
const MultiquadraticKernel = require('./kernels/multiquadratic-kernel');
const RationalKernel = require('./kernels/rational-quadratic-kernel');
const SigmoidKernel = require('ml-kernel-sigmoid');

const kernelType = {
    gaussian: GaussianKernel,
    rbf: GaussianKernel,
    polynomial: PolynomialKernel,
    poly: PolynomialKernel,
    anova: ANOVAKernel,
    cauchy: CauchyKernel,
    exponential: ExponentialKernel,
    histogram: HistogramKernel,
    min: HistogramKernel,
    laplacian: LaplacianKernel,
    multiquadratic: MultiquadraticKernel,
    rational: RationalKernel,
    sigmoid: SigmoidKernel,
    mlp: SigmoidKernel
};

class Kernel {
    constructor(type, options) {
        this.kernelType = type;
        if (type === 'linear') return;

        if (typeof type === 'string') {
            type = type.toLowerCase();

            var KernelConstructor = kernelType[type];
            if (KernelConstructor) {
                this.kernelFunction = new KernelConstructor(options);
            } else {
                throw new Error('unsupported kernel type: ' + type);
            }
        } else if (typeof type === 'object' && typeof type.compute === 'function') {
            this.kernelFunction = type;
        } else {
            throw new TypeError('first argument must be a valid kernel type or instance');
        }
    }

    compute(inputs, landmarks) {
        if (landmarks === undefined) {
            landmarks = inputs;
        }

        if (this.kernelType === 'linear') {
            var matrix = new Matrix(inputs);
            return matrix.mmul(new Matrix(landmarks).transposeView());
        }

        const kernelMatrix = new Matrix(inputs.length, landmarks.length);
        var i, j;
        if (inputs === landmarks) { // fast path, matrix is symmetric
            for (i = 0; i < inputs.length; i++) {
                for (j = i; j < inputs.length; j++) {
                    kernelMatrix[i][j] = kernelMatrix[j][i] = this.kernelFunction.compute(inputs[i], inputs[j]);
                }
            }
        } else {
            for (i = 0; i < inputs.length; i++) {
                for (j = 0; j < landmarks.length; j++) {
                    kernelMatrix[i][j] = this.kernelFunction.compute(inputs[i], landmarks[j]);
                }
            }
        }
        return kernelMatrix;
    }
}

module.exports = Kernel;
