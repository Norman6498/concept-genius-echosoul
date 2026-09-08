# Stage 1B — Login / Sign Up

Reference: `visual-references/01B_Login_Signup.png`

Goal: Build a trustworthy authentication experience with clear separation between marketing pages and the private product.

Build Stage 1B of EchoSoul: Login / Sign Up.

Use the supplied Stage 1B visual reference.

Requirements:
- clean split layout on desktop
- immersive EchoSoul visual on one side
- authentication panel on the other
- Sign in and Create account modes
- email/password flow
- OAuth buttons only if real providers are configured; otherwise clearly marked disabled/provider-ready controls
- password visibility control
- forgot password
- terms/privacy links
- clear error states
- loading states
- mobile-first responsive behavior
- accessibility
- no fake authentication
- use the actual Supabase auth architecture already present in the repository

Important:
Do not expose Supabase service-role credentials.
Do not hard-code a user name.
After successful authentication, route the user to onboarding when profile personalization is incomplete, otherwise route to the authenticated application.

Create reusable AuthLayout, AuthForm, OAuthButtons, PasswordField, AuthMessage components.

Keep visual language consistent with Stage 1A.
