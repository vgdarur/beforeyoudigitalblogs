module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/components/layout/Navbar.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "burgerBtn": "Navbar-module__cRh5nW__burgerBtn",
  "header": "Navbar-module__cRh5nW__header",
  "link": "Navbar-module__cRh5nW__link",
  "logo": "Navbar-module__cRh5nW__logo",
  "logoIcon": "Navbar-module__cRh5nW__logoIcon",
  "mobileMenu": "Navbar-module__cRh5nW__mobileMenu",
  "navContainer": "Navbar-module__cRh5nW__navContainer",
  "navLinks": "Navbar-module__cRh5nW__navLinks",
  "searchBar": "Navbar-module__cRh5nW__searchBar",
  "searchBtn": "Navbar-module__cRh5nW__searchBtn",
  "searchInput": "Navbar-module__cRh5nW__searchInput",
});
}),
"[project]/src/components/layout/Navbar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/layout/Navbar.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function Navbar() {
    const { data: session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    const [zipcode, setZipcode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [zipStatus, setZipStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleZipSubmit = async (e)=>{
        e.preventDefault();
        if (!zipcode || zipcode.length < 5) return;
        setZipStatus('saving');
        try {
            await fetch('/api/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    zipcode
                })
            });
            setZipStatus('saved');
            setTimeout(()=>setZipStatus('idle'), 3000);
        } catch  {
            setZipStatus('idle');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `container ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navContainer}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].logo,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: "/logo-v4.png",
                            alt: "AI Deals of America Logo",
                            width: 300,
                            height: 300,
                            style: {
                                width: 'auto',
                                height: '60px',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            },
                            priority: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Navbar.tsx",
                            lineNumber: 36,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Navbar.tsx",
                        lineNumber: 35,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].searchBar,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Search deals, stores, categories...",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].searchInput
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Navbar.tsx",
                                lineNumber: 47,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].searchBtn,
                                children: "Search"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Navbar.tsx",
                                lineNumber: 52,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/Navbar.tsx",
                        lineNumber: 46,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleZipSubmit,
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'var(--surface-hover)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border)',
                            overflow: 'hidden'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                maxLength: 5,
                                placeholder: "Zip Code",
                                value: zipcode,
                                onChange: (e)=>setZipcode(e.target.value.replace(/\D/g, '')),
                                style: {
                                    width: '80px',
                                    padding: '0.5rem',
                                    border: 'none',
                                    background: 'transparent',
                                    outline: 'none',
                                    textAlign: 'center',
                                    fontSize: '0.9rem',
                                    color: 'var(--foreground)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Navbar.tsx",
                                lineNumber: 56,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: zipStatus === 'saving',
                                style: {
                                    padding: '0.5rem 0.75rem',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                },
                                children: zipStatus === 'saving' ? '...' : zipStatus === 'saved' ? '✓' : 'Set'
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Navbar.tsx",
                                lineNumber: 64,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/Navbar.tsx",
                        lineNumber: 55,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navLinks,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/deals",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].link,
                                children: "All Deals"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Navbar.tsx",
                                lineNumber: 70,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/coupons",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].link,
                                children: "Coupons"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Navbar.tsx",
                                lineNumber: 71,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/categories",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].link,
                                children: "Categories"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Navbar.tsx",
                                lineNumber: 72,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '1px',
                                    height: '20px',
                                    backgroundColor: 'var(--border)',
                                    margin: '0 0.5rem'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Navbar.tsx",
                                lineNumber: 74,
                                columnNumber: 21
                            }, this),
                            session ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                },
                                children: [
                                    session.user && session.user.role === 'ADMIN' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/admin/dashboard",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].link,
                                        style: {
                                            color: 'var(--primary)'
                                        },
                                        children: "Admin Dashboard"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Navbar.tsx",
                                        lineNumber: 79,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signOut"])({
                                                callbackUrl: '/'
                                            }),
                                        style: {
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-muted)',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            fontSize: '1rem'
                                        },
                                        children: "Sign Out"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Navbar.tsx",
                                        lineNumber: 83,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/Navbar.tsx",
                                lineNumber: 77,
                                columnNumber: 25
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/login",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].link,
                                children: "Sign In"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Navbar.tsx",
                                lineNumber: 98,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/Navbar.tsx",
                        lineNumber: 69,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].burgerBtn,
                        onClick: ()=>setIsMobileMenuOpen(!isMobileMenuOpen),
                        children: isMobileMenuOpen ? '✕' : '☰'
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Navbar.tsx",
                        lineNumber: 101,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/Navbar.tsx",
                lineNumber: 34,
                columnNumber: 13
            }, this),
            isMobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mobileMenu,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        placeholder: "Search deals, stores, categories...",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].searchInput,
                        style: {
                            backgroundColor: 'var(--surface-hover)',
                            width: '100%',
                            border: '1px solid var(--border)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Navbar.tsx",
                        lineNumber: 108,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/deals",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].link,
                        onClick: ()=>setIsMobileMenuOpen(false),
                        children: "All Deals"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Navbar.tsx",
                        lineNumber: 114,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/coupons",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].link,
                        onClick: ()=>setIsMobileMenuOpen(false),
                        children: "Coupons"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Navbar.tsx",
                        lineNumber: 115,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/categories",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].link,
                        onClick: ()=>setIsMobileMenuOpen(false),
                        children: "Categories"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Navbar.tsx",
                        lineNumber: 116,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/merchants",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].link,
                        onClick: ()=>setIsMobileMenuOpen(false),
                        children: "Popular Merchants"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Navbar.tsx",
                        lineNumber: 117,
                        columnNumber: 21
                    }, this),
                    session ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            session.user && session.user.role === 'ADMIN' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/admin/dashboard",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].link,
                                style: {
                                    color: 'var(--primary)'
                                },
                                onClick: ()=>setIsMobileMenuOpen(false),
                                children: "Admin Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Navbar.tsx",
                                lineNumber: 122,
                                columnNumber: 33
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signOut"])({
                                        callbackUrl: '/'
                                    });
                                    setIsMobileMenuOpen(false);
                                },
                                style: {
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    textAlign: 'left',
                                    padding: 0
                                },
                                children: "Sign Out"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/Navbar.tsx",
                                lineNumber: 126,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/login",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].link,
                        onClick: ()=>setIsMobileMenuOpen(false),
                        children: "Sign In"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Navbar.tsx",
                        lineNumber: 143,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/Navbar.tsx",
                lineNumber: 107,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/Navbar.tsx",
        lineNumber: 33,
        columnNumber: 9
    }, this);
}
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/components/layout/NewsTicker.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewsTicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function NewsTicker() {
    const [news, setNews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchNews = async ()=>{
            try {
                const res = await fetch('https://api.aidealsofamerica.com/api/news/active');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setNews(data[0].message); // Only display the most recent AI banner
                    } else {
                        setNews('🚨 Trending in USA Today: Check out our top deals below!');
                    }
                }
            } catch (error) {
                console.error("Failed to fetch news ticker", error);
            }
        };
        fetchNews();
    }, []);
    const handleBannerClick = ()=>{
        window.open('/trending', '_blank');
    };
    if (!news) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: handleBannerClick,
        style: {
            cursor: 'pointer'
        },
        className: "jsx-a90318b9eef0f0db" + " " + "news-ticker-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "jsx-a90318b9eef0f0db" + " " + "news-ticker-text",
                children: news
            }, void 0, false, {
                fileName: "[project]/src/components/layout/NewsTicker.tsx",
                lineNumber: 39,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "a90318b9eef0f0db",
                children: ".news-ticker-container.jsx-a90318b9eef0f0db{color:#fff;z-index:50;background:linear-gradient(90deg,#1e3a8a 0%,#3b82f6 50%,#8b5cf6 100%);justify-content:center;align-items:center;width:100%;padding:10px 0;font-size:15px;font-weight:700;transition:transform .2s,opacity .2s;display:flex;box-shadow:0 2px 4px #0000001a}.news-ticker-container.jsx-a90318b9eef0f0db:hover{opacity:.95}.news-ticker-container.jsx-a90318b9eef0f0db:active{transform:scale(.99)}.news-ticker-text.jsx-a90318b9eef0f0db{text-align:center}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/NewsTicker.tsx",
        lineNumber: 38,
        columnNumber: 9
    }, this);
}
}),
"[project]/src/components/Providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-ssr] (ecmascript)");
'use client';
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SessionProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/Providers.tsx",
        lineNumber: 6,
        columnNumber: 12
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4856c4ce._.js.map