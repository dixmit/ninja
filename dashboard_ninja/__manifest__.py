# Copyright 2023 Dixmit
# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).

{
    "name": "Dashboard Ninja",
    "summary": """
        Create dashbooards like a ninja""",
    "version": "16.0.1.0.0",
    "license": "AGPL-3",
    "author": "Dixmit,Odoo Community Association (OCA)",
    "website": "https://github.com/dixmit/ninja",
    "depends": [
        "spreadsheet_dashboard",
        "base_sparse_field",
    ],
    "data": [
        "security/dashboard_ninja.xml",
        "views/dashboard_ninja.xml",
    ],
    "demo": [
        "demo/dashboard_ninja.xml",
    ],
    "assets": {
        "dashboard_ninja.o_dashboard": [
            "dashboard_ninja/static/src/bundle/dashboard_ninja.xml",
            "dashboard_ninja/static/src/bundle/dashboard_ninja_action.esm.js",
        ],
        "web.assets_backend": [
            "dashboard_ninja/static/src/bundle/dashboard_ninja.scss",
            "dashboard_ninja/static/src/dashboard_ninja_action.esm.js",
        ],
    },
}
