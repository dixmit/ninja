# Copyright 2023 Dixmit
# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).

from odoo import fields, models


class DashboardNinja(models.Model):

    _name = "dashboard.ninja"
    _description = "Dashboard Ninja"  # TODO

    name = fields.Char()
    data = fields.Serialized()

    def open_dashboard(self):
        self.ensure_one()
        return {
            "type": "ir.actions.client",
            "tag": "action_dashboard_ninja",
            "params": {
                "dashboard_id": self.id,
            },
        }

    def get_dashboard_data(self):
        self.ensure_one()
        result = {"name": self.name}
        if self.data:
            result["info"] = self.data
        return result
