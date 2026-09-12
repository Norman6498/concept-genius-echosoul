# ECHOSOUL — MANUAL ACTIONS REQUIRED (EXTERNAL SETUP)

The following actions must be performed outside the code repository in third-party dashboards or hosting providers to complete production deployment.

---

## 1. Supabase Dashboard Configuration

### A. Configure Custom SMTP (Eliminates Supabase Email Rate Limits)
- **Location**: Supabase Dashboard -> Project Settings -> Authentication -> SMTP Settings
- **Action**: Enable Custom SMTP and provide credentials for Resend, SendGrid, Postmark, or AWS SES.
- **Rationale**: Default Supabase shared pool limits email signups and OTP codes to 3-4 emails per hour. A custom SMTP provider ensures unlimited, instantaneous delivery of 6-digit login codes.

### B. Production Site URL & Redirect URLs
- **Location**: Supabase Dashboard -> Authentication -> URL Configuration
- **Site URL**: `https://echosoul.app` (or your custom production domain)
- **Redirect URLs**: Add `https://echosoul.app/api/auth/callback`, `https://echosoul.app/onboarding`, `https://echosoul.app/app`

### C. Enable Leaked Password Protection (HaveIBeenPwned Integration)
- **Location**: Supabase Dashboard -> Project `echosoul` (`bblkonxcqymwkngpmvjc`) -> Authentication -> Attack Protection / Password Security (or Providers -> Email)
- **Action**: Toggle **"Prevent use of leaked passwords"** to **Enabled**.
- **Rationale**: Resolves advisor warning `auth_leaked_password_protection`. Supabase Auth verifies passwords against HaveIBeenPwned.org to reject compromised credentials upon signup and password change (Requires Pro Plan).

---

## 2. Vercel / Production Hosting Environment Variables

Ensure the following production environment variables are configured in your Vercel Project Settings:

| Variable Name | Description | Example / Required Value |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | `https://bblkonxcqymwkngpmvjc.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anonymous Key | *(Existing anon key from .env.local)* |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Secret Service Role Key | *(Existing service-role key from .env.local)* |
| `OPENROUTER_API_KEY` | OpenRouter API Key for AI inference | *(Existing OpenRouter key)* |
| `NEXT_PUBLIC_APP_URL` | Canonical production URL | `https://echosoul.app` |

---

## 3. Domain & DNS Configuration

- **Custom Domain**: Connect your domain in Vercel Dashboard -> Settings -> Domains.
- **DNS Records**: Add CNAME or A records as indicated by Vercel for your Apex and www domains.
- **SSL**: Automatic Let's Encrypt SSL will be provisioned by Vercel upon DNS propagation.