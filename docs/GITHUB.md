# EchoSoul — GitHub Setup Guide

## Repository

| Property | Value |
|----------|-------|
| Repository name | `concept-genius-echosoul` |
| Visibility | **Private** |
| Default branch | `main` |
| Organization | Personal account (Concept Genius owner) |

---

## Initial Setup (already done if you're reading this)

### 1. Create the private repository on GitHub

Go to [github.com/new](https://github.com/new):
- Repository name: `concept-genius-echosoul`
- Visibility: **Private**
- Do NOT initialize with README, .gitignore, or license (project already has them)

### 2. Connect local project

```bash
cd /path/to/ECHOSOUL

git init
git config user.name "Your Name"
git config user.email "your-noreply@users.noreply.github.com"

git remote add origin git@github.com:<username>/concept-genius-echosoul.git
git branch -M main
```

### 3. Verify before committing

```bash
# Check what will be committed
git status

# Search for any leaked secrets
git grep -r "sk-" --cached
git grep -r "service_role" --cached
```

### 4. First commit and push

```bash
git add .
git commit -m "chore: establish EchoSoul infrastructure"
git push -u origin main
```

---

## Verifying the remote

```bash
git remote -v
# Should show: origin  git@github.com:<username>/concept-genius-echosoul.git
```

---

## GitHub noreply email

GitHub provides a noreply email to protect your personal email address.
Find it at: [github.com/settings/emails](https://github.com/settings/emails)

Format: `<user-id>+<username>@users.noreply.github.com`

Use this in your git config so commits don't expose your personal email:

```bash
git config user.email "<user-id>+<username>@users.noreply.github.com"
```

---

## Security recommendations

- Enable **branch protection** on `main`:
  GitHub → Repository → Settings → Branches → Add rule
  - Require pull request reviews before merging
  - Require status checks to pass
  
- Enable **secret scanning** (free for private repos):
  Settings → Security → Secret scanning → Enable

- Enable **push protection** (blocks accidental secret commits):
  Settings → Security → Secret scanning → Push protection

- Consider enabling **Dependabot alerts** for dependency vulnerabilities

---

## What must never be committed

See [SECURITY.md](SECURITY.md) for the full list.

Short version:
- `.env` / `.env.local` / any file with real credentials
- OpenRouter API key
- Supabase service-role key
- Private keys, certificates, passwords
