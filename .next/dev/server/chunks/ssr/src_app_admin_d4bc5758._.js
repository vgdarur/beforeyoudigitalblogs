module.exports = [
"[project]/src/app/admin/page.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "adminLayout": "page-module__OmXfwq__adminLayout",
  "avatar": "page-module__OmXfwq__avatar",
  "content": "page-module__OmXfwq__content",
  "divider": "page-module__OmXfwq__divider",
  "logo": "page-module__OmXfwq__logo",
  "logoutBtn": "page-module__OmXfwq__logoutBtn",
  "mainContent": "page-module__OmXfwq__mainContent",
  "nav": "page-module__OmXfwq__nav",
  "navLink": "page-module__OmXfwq__navLink",
  "pageTitle": "page-module__OmXfwq__pageTitle",
  "sidebar": "page-module__OmXfwq__sidebar",
  "sidebarFooter": "page-module__OmXfwq__sidebarFooter",
  "sidebarHeader": "page-module__OmXfwq__sidebarHeader",
  "topbar": "page-module__OmXfwq__topbar",
  "userInfo": "page-module__OmXfwq__userInfo",
  "userName": "page-module__OmXfwq__userName",
  "userProfile": "page-module__OmXfwq__userProfile",
  "userRole": "page-module__OmXfwq__userRole",
  "viewSiteBtn": "page-module__OmXfwq__viewSiteBtn",
});
}),
"[project]/src/app/admin/LogoutButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LogoutButton",
    ()=>LogoutButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/admin/page.module.css [app-ssr] (css module)");
'use client';
;
;
;
function LogoutButton() {
    const handleLogout = async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signOut"])({
            callbackUrl: '/login'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleLogout,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].logoutBtn,
        children: "Logout"
    }, void 0, false, {
        fileName: "[project]/src/app/admin/LogoutButton.tsx",
        lineNumber: 12,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=src_app_admin_d4bc5758._.js.map