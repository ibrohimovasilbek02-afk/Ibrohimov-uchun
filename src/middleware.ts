// Middleware disabled for demo mode - no auth required
// Uncomment when you add real authentication

// import { withAuth } from 'next-auth/middleware'
// export default withAuth(...)

export default function middleware() {
  // Allow all requests in demo mode
}

export const config = {
  matcher: [],
}
