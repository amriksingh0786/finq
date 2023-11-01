"use strict";
exports.__esModule = true;
exports.metadata = void 0;
var utils_1 = require("@/lib/utils");
require("./globals.css");
var google_1 = require("next/font/google");
var Navabar_1 = require("@/components/Navabar");
var Providers_1 = require("@/components/Providers");
require("react-loading-skeleton/dist/skeleton.css");
var toaster_1 = require("@/components/ui/toaster");
require("simplebar-react/dist/simplebar.min.css");
var inter = google_1.Inter({ subsets: ['latin'] });
exports.metadata = utils_1.constructMetadata();
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "en", className: "light" },
        React.createElement(Providers_1["default"], null,
            React.createElement("body", { className: utils_1.cn('min-h-screen font-sans antialiased grainy', inter.className) },
                React.createElement(toaster_1.Toaster, null),
                React.createElement(Navabar_1["default"], null),
                children))));
}
exports["default"] = RootLayout;
