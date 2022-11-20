import RobustPolynomialRegression from '..';

describe('Robust Polynomial Regression', () => {
    it('Simple squared function', () => {
        var size = 31;
        var x = new Array(size);
        var y = new Array(size);
        for (var i = 0; i < size; i++) {
            x[i] = i;
            y[i] = 2 * i * i + 4 * i + 5;
        }

        var regression = new RobustPolynomialRegression(x, y, 3);
        expect(regression.predict(3)).toBe(35);
        expect(regression.toString(3)).toBe('f(x) = 2.00 * x^2 + 4.00 * x + 5.00');
        expect(regression.toLaTeX(3)).toBe('f(x) = 2.00x^{2} + 4.00x + 5.00');
    });

    it('Squared function with outliers', () => {
        var size = 30;
        var x = new Array(size);
        var y = new Array(size);
        for (var i = 0; i < size; i++) {
            x[i] = i;
            y[i] = 2 * i * i + 4 * i + 5;
        }
        y[4] = y[4] * 100;
        y[10] = y[10] * -100;

        var regression = new RobustPolynomialRegression(x, y, 3);
        expect(regression.predict(3)).toBe(35);
    });

    it('toJSON and load', () => {
        expect(() => RobustPolynomialRegression.load({})).toThrow('not a RobustPolynomialRegression model');

        const regression = RobustPolynomialRegression.load({
            name: 'robustPolynomialRegression',
            degree: 1,
            powers: [1],
            coefficients: [-1]
        });

        expect(regression.predict(1)).toEqual(-1);
        expect(regression.toString(3)).toBe('f(x) = - 1.00 * x');

        const model = regression.toJSON();
        expect(model).toEqual({
            name: 'robustPolynomialRegression',
            degree: 1,
            powers: [1],
            coefficients: [-1]
        });
    });
});
