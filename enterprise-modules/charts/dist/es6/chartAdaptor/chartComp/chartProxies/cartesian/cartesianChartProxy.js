var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { ChartProxy } from "../chartProxy";
import { _ } from "@ag-grid-community/core";
import { ChartAxisPosition, ChartBuilder, find, GroupedCategoryAxis } from "ag-charts-community";
import { ChartDataModel } from "../../chartDataModel";
var CartesianChartProxy = /** @class */ (function (_super) {
    __extends(CartesianChartProxy, _super);
    function CartesianChartProxy(params) {
        return _super.call(this, params) || this;
    }
    CartesianChartProxy.prototype.getAxisProperty = function (expression) {
        return _.get(this.chartOptions.xAxis, expression, undefined);
    };
    CartesianChartProxy.prototype.setAxisProperty = function (expression, value) {
        _.set(this.chartOptions.xAxis, expression, value);
        _.set(this.chartOptions.yAxis, expression, value);
        var chart = this.chart;
        this.chart.axes.forEach(function (axis) { return _.set(axis, expression, value); });
        chart.performLayout();
        this.raiseChartOptionsChangedEvent();
    };
    CartesianChartProxy.prototype.updateLabelRotation = function (categoryId, isHorizontalChart) {
        if (isHorizontalChart === void 0) { isHorizontalChart = false; }
        var labelRotation = 0;
        var axisKey = isHorizontalChart ? 'yAxis' : 'xAxis';
        if (categoryId !== ChartDataModel.DEFAULT_CATEGORY && !this.chartProxyParams.grouping) {
            var label = this.chartOptions[axisKey].label;
            if (label && label.rotation) {
                labelRotation = label.rotation;
            }
        }
        var axisPosition = isHorizontalChart ? ChartAxisPosition.Left : ChartAxisPosition.Bottom;
        var axis = find(this.chart.axes, function (axis) { return axis.position === axisPosition; });
        if (axis) {
            axis.label.rotation = labelRotation;
        }
    };
    CartesianChartProxy.prototype.getDefaultAxisOptions = function () {
        var fontOptions = this.getDefaultFontOptions();
        var stroke = this.getAxisGridColor();
        var axisColor = "rgba(195, 195, 195, 1)";
        return {
            title: __assign(__assign({}, fontOptions), { enabled: false, fontSize: 14 }),
            line: {
                color: axisColor,
                width: 1,
            },
            tick: {
                color: axisColor,
                size: 6,
                width: 1,
            },
            label: __assign(__assign({}, fontOptions), { padding: 5, rotation: 0 }),
            gridStyle: [{
                    stroke: stroke,
                    lineDash: [4, 2]
                }]
        };
    };
    CartesianChartProxy.prototype.getDefaultCartesianChartOptions = function () {
        var options = this.getDefaultChartOptions();
        options.xAxis = this.getDefaultAxisOptions();
        options.yAxis = this.getDefaultAxisOptions();
        return options;
    };
    CartesianChartProxy.prototype.updateAxes = function (baseAxisType, isHorizontalChart) {
        if (baseAxisType === void 0) { baseAxisType = 'category'; }
        if (isHorizontalChart === void 0) { isHorizontalChart = false; }
        var baseAxis = isHorizontalChart ? this.getYAxis() : this.getXAxis();
        if (!baseAxis) {
            return;
        }
        if (this.chartProxyParams.grouping) {
            if (!(baseAxis instanceof GroupedCategoryAxis)) {
                this.recreateChart();
            }
            return;
        }
        var axisClass = ChartBuilder.toAxisClass(baseAxisType);
        if (baseAxis instanceof axisClass) {
            return;
        }
        var options = this.chartOptions;
        if (isHorizontalChart && !options.yAxis.type) {
            options = __assign(__assign({}, options), { yAxis: __assign(__assign({}, options.yAxis), { type: baseAxisType }) });
        }
        else if (!isHorizontalChart && !options.xAxis.type) {
            options = __assign(__assign({}, options), { xAxis: __assign(__assign({}, options.xAxis), { type: baseAxisType }) });
        }
        this.recreateChart(options);
    };
    CartesianChartProxy.prototype.getXAxis = function () {
        return find(this.chart.axes, function (a) { return a.position === ChartAxisPosition.Bottom; });
    };
    CartesianChartProxy.prototype.getYAxis = function () {
        return find(this.chart.axes, function (a) { return a.position === ChartAxisPosition.Left; });
    };
    return CartesianChartProxy;
}(ChartProxy));
export { CartesianChartProxy };
