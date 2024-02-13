/** @odoo-module **/

import {registry} from "@web/core/registry";

const actionRegistry = registry.category("actions");
import {useDraggable} from "@web/core/utils/draggable";
import {useService} from "@web/core/utils/hooks";

const {Component, useSubEnv, useState, useRef, onWillStart, onMounted} = owl;
export class DashboardNinjaHeader extends Component {
    add_item() {
        this.env.onAddItem();
    }
    save() {
        this.env.onSave();
    }
}
DashboardNinjaHeader.template = "dashboard_ninja.DashboardNinjaHeader";
export class ActionDashboardNinjaComponent extends Component {
    setup() {
        super.setup(...arguments);
        this.itemRef = useRef("item");
        this.env.setElement(this.props.recordId, this);
        this.state = useState({
            height: this.env.getHeight(Math.max(1, this.props.record.height)),
            realHeight: Math.max(1, this.props.record.height),
            y: this.env.getHeight(Math.max(0, this.props.record.y)),
            x: Math.max(0, this.props.record.x),
            width: Math.max(1, this.props.record.width),
            draggable: "o_record_draggable",
        });
    }
    increaseHeight() {
        this.state.realHeight += 1;
        this.state.height = this.env.getHeight(this.state.realHeight);
        this.env.updateElementSize(
            this.props.recordId,
            this.state.realHeight,
            this.state.width
        );
    }
    decreaseHeight() {
        this.state.realHeight -= 1;
        this.state.height = this.env.getHeight(this.state.realHeight);
        this.env.updateElementSize(
            this.props.recordId,
            this.state.realHeight,
            this.state.width
        );
    }
    increaseWidth() {
        this.state.width += 1;
        this.env.updateElementSize(
            this.props.recordId,
            this.state.realHeight,
            this.state.width
        );
    }
    decreaseWidth() {
        this.state.width -= 1;
        this.env.updateElementSize(
            this.props.recordId,
            this.state.realHeight,
            this.state.width
        );
    }
}

ActionDashboardNinjaComponent.template =
    "dashboard_ninja.ActionDashboardNinjaComponent";
ActionDashboardNinjaComponent.components = {};
ActionDashboardNinjaComponent.props = {
    record: Object,
    recordId: String,
};

export class ActionDashboardNinja extends Component {
    setup() {
        super.setup(...arguments);
        this.rowHeight = 80;
        this.orm = useService("orm");
        this.router = useService("router");
        this.elements = {};
        useSubEnv({
            getHeight: this.getHeight.bind(this),
            setElement: this.setElement.bind(this),
            updateElementSize: this.updateElementSize.bind(this),
            onSave: this.onSave.bind(this),
            onAddItem: this.onAddItem.bind(this),
        });
        this.rootRef = useRef("root");
        this.width = 0;
        this.height = 0;
        this.model = "dashboard.ninja";

        const params = this.props.action.params || this.props.action.context.params;
        this.dashboardId = params.dashboard_id;
        onMounted(() => {
            this.router.pushState({
                dashboard_id: this.dashboardId,
                model: this.model,
            });
        });
        this.data = useState({
            name: undefined,
            info: {data: {}, nextId: 1},
        });
        onWillStart(async () => {
            for (const [key, value] of Object.entries(
                await this.orm.call(
                    this.model,
                    "get_dashboard_data",
                    [[this.dashboardId]],
                    {context: {bin_size: false}}
                )
            ) || {}) {
                this.data[key] = value;
            }
            this.rows = Math.max(
                ..._.map(this.data.info, (data) => data.y + data.height)
            );
        });
        this.cols = 12;
        useDraggable({
            enable: () => true,
            // Params
            ref: this.rootRef,
            elements: ".o_record_draggable",
            cursor: "move",
            // Hooks
            onDragStart: () => {
                this.height = this.rootRef.el.clientHeight;
                this.width = this.rootRef.el.clientWidth;
                this.cellWidth = this.width / this.cols;
            },
            onDragEnd: this.onDragEnd.bind(this),
            onDrag: this.onDrag.bind(this),
            // eslint-disable-next-line no-empty-function
            onDrop: () => {},
        });
    }
    // eslint-disable-next-line no-empty-function
    onDrag() {}
    onDragEnd(params) {
        const newPosition = this.computePosition(params);
        const elementId = params.element.id;
        const element = this.elements[elementId];
        this.data.info.data[elementId].x = newPosition.x;
        this.data.info.data[elementId].y = newPosition.y;
        element.state.x = newPosition.x;
        element.state.y = this.getHeight(newPosition.y);
    }
    computePosition(params) {
        const left = Math.min(
            this.rootRef.el.clientWidth,
            Math.max(0, params.element.offsetLeft - this.rootRef.el.offsetLeft)
        );
        const top = Math.min(
            this.rootRef.el.clientHeight,
            Math.max(0, params.element.offsetTop - this.rootRef.el.offsetTop)
        );
        return {
            x: Math.round(left / this.cellWidth),
            y: Math.round(top / this.rowHeight),
        };
    }
    setElement(childId, child) {
        this.elements[childId] = child;
    }
    getHeight(value) {
        return this.rowHeight * value;
    }
    updateElementSize(elementId, height, width) {
        console.log(this.data.info.data[elementId]);
        this.data.info.data[elementId].height = height;
        this.data.info.data[elementId].width = width;
        console.log(this.data.info.data[elementId]);
    }
    onSave() {
        this.orm.call(this.model, "write", [
            [this.dashboardId],
            {
                data: this.data.info,
            },
        ]);
    }
    onAddItem() {
        this.data.info.data[this.data.info.nextId] = {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
        };
        this.data.info.nextId += 1;
    }
}
ActionDashboardNinja.template = "dashboard_ninja.ActionDashboardNinja";
ActionDashboardNinja.components = {
    ActionDashboardNinjaComponent,
    DashboardNinjaHeader,
};
actionRegistry.add("action_dashboard_ninja", ActionDashboardNinja, {force: true});
