/** @odoo-module **/

import {getBundle, loadBundle} from "@web/core/assets";
import {registry} from "@web/core/registry";
import {sprintf} from "@web/core/utils/strings";

const actionRegistry = registry.category("actions");

export async function loadDashboardNinja(env, actionName, actionLazyLoader) {
    const desc = await getBundle("dashboard_ninja.o_dashboard");
    await loadBundle(desc);
    if (actionRegistry.get(actionName) === actionLazyLoader) {
        // At this point, the real spreadsheet client action should be loaded and have
        // replaced this function in the action registry. If it's not the case,
        // it probably means that there was a crash in the bundle (e.g. syntax
        // error). In this case, this action will remain in the registry, which
        // will lead to an infinite loop. To prevent that, we push another action
        // in the registry.
        actionRegistry.add(
            actionName,
            () => {
                const msg = sprintf(env._t("%s couldn't be loaded"), actionName);
                env.services.notification.add(msg, {type: "danger"});
            },
            {force: true}
        );
    }
}

export const loadDashboardNinjaAction = async (env, context) => {
    await loadDashboardNinja(env, "action_dashboard_ninja", loadDashboardNinjaAction);
    return {
        ...context,
        target: "current",
        tag: "action_dashboard_ninja",
        type: "ir.actions.client",
    };
};
actionRegistry.add("action_dashboard_ninja", loadDashboardNinjaAction);
