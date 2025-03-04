/**
 * @license  Highcharts JS v7.1.0 (2019-04-01)
 *
 * Indicator series type for Highstock
 *
 * (c) 2010-2019 Sebastian Bochan
 *
 * License: www.highcharts.com/license
 */
'use strict';
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        factory['default'] = factory;
        module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
        define('highcharts/indicators/cci', ['highcharts', 'highcharts/modules/stock'], function (Highcharts) {
            factory(Highcharts);
            factory.Highcharts = Highcharts;
            return factory;
        });
    } else {
        factory(typeof Highcharts !== 'undefined' ? Highcharts : undefined);
    }
}(function (Highcharts) {
    var _modules = Highcharts ? Highcharts._modules : {};
    function _registerModule(obj, path, args, fn) {
        if (!obj.hasOwnProperty(path)) {
            obj[path] = fn.apply(null, args);
        }
    }
    _registerModule(_modules, 'indicators/cci.src.js', [_modules['parts/Globals.js']], function (H) {
        /* *
         *
         *  License: www.highcharts.com/license
         *
         * */



        var isArray = H.isArray,
            seriesType = H.seriesType;

        // Utils:
        function sumArray(array) {
            return array.reduce(function (prev, cur) {
                return prev + cur;
            }, 0);
        }

        function meanDeviation(arr, sma) {
            var len = arr.length,
                sum = 0,
                i;

            for (i = 0; i < len; i++) {
                sum += Math.abs(sma - (arr[i]));
            }

            return sum;
        }

        /**
         * The CCI series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.cci
         *
         * @augments Highcharts.Series
         */
        seriesType(
            'cci',
            'sma',
            /**
             * Commodity Channel Index (CCI). This series requires `linkedTo` option to
             * be set.
             *
             * @sample stock/indicators/cci
             *         CCI indicator
             *
             * @extends      plotOptions.sma
             * @since        6.0.0
             * @product      highstock
             * @optionparent plotOptions.cci
             */
            {
                params: {
                    period: 14
                }
            },
            /**
             * @lends Highcharts.Series#
             */
            {
                getValues: function (series, params) {
                    var period = params.period,
                        xVal = series.xData,
                        yVal = series.yData,
                        yValLen = yVal ? yVal.length : 0,
                        TP = [],
                        periodTP = [],
                        range = 1,
                        CCI = [],
                        xData = [],
                        yData = [],
                        CCIPoint, p, len, smaTP, TPtemp, meanDev, i;

                    // CCI requires close value
                    if (
                        xVal.length <= period ||
                        !isArray(yVal[0]) ||
                        yVal[0].length !== 4
                    ) {
                        return false;
                    }

                    // accumulate first N-points
                    while (range < period) {
                        p = yVal[range - 1];
                        TP.push((p[1] + p[2] + p[3]) / 3);
                        range++;
                    }

                    for (i = period; i <= yValLen; i++) {

                        p = yVal[i - 1];
                        TPtemp = (p[1] + p[2] + p[3]) / 3;
                        len = TP.push(TPtemp);
                        periodTP = TP.slice(len - period);

                        smaTP = sumArray(periodTP) / period;
                        meanDev = meanDeviation(periodTP, smaTP) / period;

                        CCIPoint = ((TPtemp - smaTP) / (0.015 * meanDev));

                        CCI.push([xVal[i - 1], CCIPoint]);
                        xData.push(xVal[i - 1]);
                        yData.push(CCIPoint);
                    }

                    return {
                        values: CCI,
                        xData: xData,
                        yData: yData
                    };
                }
            }
        );

        /**
         * A `CCI` series. If the [type](#series.cci.type) option is not
         * specified, it is inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.cci
         * @since     6.0.0
         * @excluding dataParser, dataURL
         * @product   highstock
         * @apioption series.cci
         */

    });
    _registerModule(_modules, 'masters/indicators/cci.src.js', [], function () {


    });
}));