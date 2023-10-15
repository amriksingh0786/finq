"use client";
"use strict";
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
exports.__esModule = true;
var lucide_react_1 = require("lucide-react");
var react_pdf_1 = require("react-pdf");
require("react-pdf/dist/Page/AnnotationLayer.css");
require("react-pdf/dist/Page/TextLayer.css");
var use_toast_1 = require("./ui/use-toast");
react_pdf_1.pdfjs.GlobalWorkerOptions.workerSrc = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/" + react_pdf_1.pdfjs.version + "/pdf.worker.js";
var react_resize_detector_1 = require("react-resize-detector");
var button_1 = require("./ui/button");
var input_1 = require("./ui/input");
var react_1 = require("react");
var zod_1 = require("zod");
var react_hook_form_1 = require("react-hook-form");
var zod_2 = require("@hookform/resolvers/zod");
var utils_1 = require("@/lib/utils");
var dropdown_menu_1 = require("./ui/dropdown-menu");
var simplebar_react_1 = require("simplebar-react");
var PdfFullscreen_1 = require("./PdfFullscreen");
var PdfRenderer = function (_a) {
    var url = _a.url;
    var toast = use_toast_1.useToast().toast;
    var _b = react_1.useState(), numPages = _b[0], setNumPages = _b[1];
    var _c = react_1.useState(1), currPage = _c[0], setCurrPage = _c[1];
    var _d = react_resize_detector_1.useResizeDetector(), width = _d.width, ref = _d.ref;
    var _e = react_1.useState(1), scale = _e[0], setScale = _e[1];
    var _f = react_1.useState(0), rotate = _f[0], setRotate = _f[1];
    var CustomPageValidator = zod_1.z.object({
        page: zod_1.z.string().refine(function (num) {
            return Number(num) > 0 && Number(num) <= numPages;
        })
    });
    var _g = react_hook_form_1.useForm({
        defaultValues: {
            page: "1"
        },
        resolver: zod_2.zodResolver(CustomPageValidator)
    }), register = _g.register, handleSubmit = _g.handleSubmit, errors = _g.formState.errors, watch = _g.watch, setValue = _g.setValue;
    var handlePageSubmit = function (_a) {
        var page = _a.page;
        setCurrPage(Number(page));
    };
    return (React.createElement("div", { className: "w-full bg-white rounded-md shadow flex flex-col items-center" },
        React.createElement("div", { className: "flex h-14 w-full border-b border-zinc-200 items-center justify-between p-2" },
            React.createElement("div", { className: "flex items-center gap-1 5" },
                React.createElement(button_1.Button, { disabled: currPage <= 1, onClick: function () {
                        setCurrPage(function (prev) { return (prev - 1 > 1 ? prev - 1 : prev); });
                        setValue("page", String(currPage - 1));
                    }, "aria-label": "previous page", variant: "ghost" },
                    React.createElement(lucide_react_1.ChevronDown, { className: "h-4 w-4" })),
                React.createElement("div", { className: "flex items-center gap-1 5" },
                    React.createElement(input_1.Input, __assign({}, register("page"), { className: utils_1.cn('w-12 h-8', errors.page && "focus-visible:ring-red-500"), onKeyDown: function (e) {
                            if (e.key === "Enter") {
                                console.log("enter");
                                handleSubmit(handlePageSubmit)();
                            }
                        } })),
                    React.createElement("p", { className: "text-zinc-700 text-sm space-x-1" },
                        React.createElement("span", null, "/"),
                        React.createElement("span", null, numPages !== null && numPages !== void 0 ? numPages : "x"))),
                React.createElement(button_1.Button, { disabled: numPages === currPage || undefined, onClick: function () {
                        setCurrPage(function (prev) {
                            return prev + 1 > numPages ? numPages : prev + 1;
                        });
                        setValue("page", String(currPage + 1));
                    }, "aria-label": "previous page", variant: "ghost" },
                    React.createElement(lucide_react_1.ChevronUp, { className: "h-4 w-4" }))),
            React.createElement("div", { className: "space-x-2" },
                React.createElement(dropdown_menu_1.DropdownMenu, null,
                    React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
                        React.createElement(button_1.Button, { className: 'gap-1.5', "aria-label": "Zoom", variant: 'ghost' },
                            React.createElement(lucide_react_1.Search, { className: "h-4 w-4" }),
                            scale * 100,
                            "% ",
                            React.createElement(lucide_react_1.ChevronDown, { className: "h-3 w-3 opacity-50" }))),
                    React.createElement(dropdown_menu_1.DropdownMenuContent, null,
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { onSelect: function () { return setScale(1); } }, "100%"),
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { onSelect: function () { return setScale(1.5); } }, "150%"),
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { onSelect: function () { return setScale(2); } }, "200%"),
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { onSelect: function () { return setScale(2.5); } }, "250%"))),
                React.createElement(button_1.Button, { variant: 'ghost', "aria-label": "rotate 90 degrees", onClick: function () { return setRotate(function (prev) { return prev + 90; }); } },
                    React.createElement(lucide_react_1.RotateCw, { className: "h-4 w-4" })),
                React.createElement(PdfFullscreen_1["default"], { fileUrl: url }))),
        React.createElement("div", { className: "flex-1 w-full max-h-screen" },
            React.createElement(simplebar_react_1["default"], { autoHide: false, className: "max-h-[calc(100vh-10rem)]" },
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
                        }, file: url, className: "max-h-full" },
                        React.createElement(react_pdf_1.Page, { pageNumber: currPage, width: width ? width : 1, scale: scale, rotate: rotate })))))));
};
exports["default"] = PdfRenderer;
