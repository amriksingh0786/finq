"use strict";
exports.__esModule = true;
var react_1 = require("react");
var dialog_1 = require("./ui/dialog");
var button_1 = require("./ui/button");
var lucide_react_1 = require("lucide-react");
var simplebar_react_1 = require("simplebar-react");
var use_toast_1 = require("./ui/use-toast");
var react_resize_detector_1 = require("react-resize-detector");
var react_pdf_1 = require("react-pdf");
var PdfFullscreen = function (_a) {
    var fileUrl = _a.fileUrl;
    var _b = react_1.useState(false), isOpen = _b[0], setIsOpen = _b[1];
    var toast = use_toast_1.useToast().toast;
    var _c = react_1.useState(), numPages = _c[0], setNumPages = _c[1];
    var _d = react_1.useState(1), currPage = _d[0], setCurrPage = _d[1];
    var _e = react_resize_detector_1.useResizeDetector(), width = _e.width, ref = _e.ref;
    return (React.createElement(dialog_1.Dialog, { open: isOpen, onOpenChange: function (v) {
            if (!v)
                setIsOpen(v);
        } },
        React.createElement(dialog_1.DialogTrigger, { onClick: function () { return setIsOpen(true); }, asChild: true },
            React.createElement(button_1.Button, { variant: "ghost", "aria-label": "fullscreen", className: "gap-1.5" },
                React.createElement(lucide_react_1.Expand, { className: "h-4 w-4" }))),
        React.createElement(dialog_1.DialogContent, { className: "max-w-7xl w-full" },
            React.createElement(simplebar_react_1["default"], { autoHide: false, className: "'max-h-[calc(100vh-10rem)] mt-6" },
                React.createElement("div", { ref: ref },
                    React.createElement(react_pdf_1.Document, { loading: React.createElement("div", { className: "flex justify-center " },
                            React.createElement(lucide_react_1.Loader2, { className: "my-24 h-6 w-6 animate-spin" })), onLoadError: function () {
                            return toast({
                                title: "Error loading PDF",
                                description: "Please try again later",
                                variant: "destructive"
                            });
                        }, onLoadSuccess: function (_a) {
                            var numPages = _a.numPages;
                            return setNumPages(numPages);
                        }, file: fileUrl, className: "max-h-full" }, new Array(numPages).fill(0).map(function (_, i) { return (React.createElement(react_pdf_1.Page, { key: i, pageNumber: i + 1, width: width ? width : 1 })); })))))));
};
exports["default"] = PdfFullscreen;
