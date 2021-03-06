/**
 * @ag-grid-community/core - Advanced Data Grid / Data Table supporting Javascript / React / AngularJS / Web Components
 * @version v23.0.2
 * @link http://www.ag-grid.com/
 * @license MIT
 */
"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var agCheckbox_1 = require("../widgets/agCheckbox");
var context_1 = require("../context/context");
var component_1 = require("../widgets/component");
var events_1 = require("../events");
var componentAnnotations_1 = require("../widgets/componentAnnotations");
var rowNode_1 = require("../entities/rowNode");
var utils_1 = require("../utils");
var CheckboxSelectionComponent = /** @class */ (function (_super) {
    __extends(CheckboxSelectionComponent, _super);
    function CheckboxSelectionComponent() {
        return _super.call(this, "<div class=\"ag-selection-checkbox\"><ag-checkbox role=\"presentation\" ref=\"eCheckbox\"></ag-checkbox></div>") || this;
    }
    CheckboxSelectionComponent.prototype.onDataChanged = function () {
        // when rows are loaded for the second time, this can impact the selection, as a row
        // could be loaded as already selected (if user scrolls down, and then up again).
        this.onSelectionChanged();
    };
    CheckboxSelectionComponent.prototype.onSelectableChanged = function () {
        this.showOrHideSelect();
    };
    CheckboxSelectionComponent.prototype.onSelectionChanged = function () {
        var state = this.rowNode.isSelected();
        this.eCheckbox.setValue(state, true);
    };
    CheckboxSelectionComponent.prototype.onCheckedClicked = function () {
        var groupSelectsFiltered = this.gridOptionsWrapper.isGroupSelectsFiltered();
        var updatedCount = this.rowNode.setSelectedParams({ newValue: false, groupSelectsFiltered: groupSelectsFiltered });
        return updatedCount;
    };
    CheckboxSelectionComponent.prototype.onUncheckedClicked = function (event) {
        var groupSelectsFiltered = this.gridOptionsWrapper.isGroupSelectsFiltered();
        var updatedCount = this.rowNode.setSelectedParams({ newValue: true, rangeSelect: event.shiftKey, groupSelectsFiltered: groupSelectsFiltered });
        return updatedCount;
    };
    CheckboxSelectionComponent.prototype.init = function (params) {
        var _this = this;
        this.rowNode = params.rowNode;
        this.column = params.column;
        this.onSelectionChanged();
        // we don't want the row clicked event to fire when selecting the checkbox, otherwise the row
        // would possibly get selected twice
        this.addGuiEventListener('click', function (event) { return utils_1._.stopPropagationForAgGrid(event); });
        // likewise we don't want double click on this icon to open a group
        this.addGuiEventListener('dblclick', function (event) { return utils_1._.stopPropagationForAgGrid(event); });
        this.addDestroyableEventListener(this.eCheckbox, agCheckbox_1.AgCheckbox.EVENT_CHANGED, function (params) {
            if (params.selected) {
                _this.onUncheckedClicked(params.event || {});
            }
            else {
                _this.onCheckedClicked();
            }
        });
        this.addDestroyableEventListener(this.rowNode, rowNode_1.RowNode.EVENT_ROW_SELECTED, this.onSelectionChanged.bind(this));
        this.addDestroyableEventListener(this.rowNode, rowNode_1.RowNode.EVENT_DATA_CHANGED, this.onDataChanged.bind(this));
        this.addDestroyableEventListener(this.rowNode, rowNode_1.RowNode.EVENT_SELECTABLE_CHANGED, this.onSelectableChanged.bind(this));
        this.isRowSelectableFunc = this.gridOptionsWrapper.getIsRowSelectableFunc();
        var checkboxVisibleIsDynamic = this.isRowSelectableFunc || this.checkboxCallbackExists();
        if (checkboxVisibleIsDynamic) {
            this.addDestroyableEventListener(this.eventService, events_1.Events.EVENT_DISPLAYED_COLUMNS_CHANGED, this.showOrHideSelect.bind(this));
            this.showOrHideSelect();
        }
    };
    CheckboxSelectionComponent.prototype.showOrHideSelect = function () {
        // if the isRowSelectable() is not provided the row node is selectable by default
        var selectable = this.rowNode.selectable;
        // checkboxSelection callback is deemed a legacy solution however we will still consider it's result.
        // If selectable, then also check the colDef callback. if not selectable, this it short circuits - no need
        // to call the colDef callback.
        if (selectable && this.checkboxCallbackExists()) {
            selectable = this.column.isCellCheckboxSelection(this.rowNode);
        }
        // show checkbox if both conditions are true
        this.setDisplayed(selectable);
    };
    CheckboxSelectionComponent.prototype.checkboxCallbackExists = function () {
        // column will be missing if groupUseEntireRow=true
        var colDef = this.column ? this.column.getColDef() : null;
        return colDef && typeof colDef.checkboxSelection === 'function';
    };
    __decorate([
        context_1.Autowired('gridOptionsWrapper')
    ], CheckboxSelectionComponent.prototype, "gridOptionsWrapper", void 0);
    __decorate([
        context_1.Autowired('eventService')
    ], CheckboxSelectionComponent.prototype, "eventService", void 0);
    __decorate([
        componentAnnotations_1.RefSelector('eCheckbox')
    ], CheckboxSelectionComponent.prototype, "eCheckbox", void 0);
    return CheckboxSelectionComponent;
}(component_1.Component));
exports.CheckboxSelectionComponent = CheckboxSelectionComponent;

//# sourceMappingURL=checkboxSelectionComponent.js.map
