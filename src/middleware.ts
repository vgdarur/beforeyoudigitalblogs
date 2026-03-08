import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            // Only allow admins to access /admin routes
            if (req.nextUrl.pathname.startsWith("/admin")) {
                return token?.role === "ADMIN";
            }
            return !!token;
        },
    },
});

export const config = {
    matcher: [
        "/admin/:path*"
    ],
};
