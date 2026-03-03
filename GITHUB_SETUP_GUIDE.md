# 🚀 GitHub Setup Guide for ZYNX CAPITAL

## Step-by-Step Instructions

### Part 1: Prepare Your Local Project (10 minutes)

#### Option A: If You Already Have Files Locally

If you've already downloaded files using DevTools:

```bash
# Navigate to your project
cd path/to/zynx-capital

# Copy .gitignore and README.md from Figma Make to your local folder
# Then skip to Part 2
```

#### Option B: Starting Fresh (Recommended)

1. **Create project folder:**
```bash
# Windows
cd Desktop
mkdir zynx-capital
cd zynx-capital

# Mac/Linux
cd ~/Desktop
mkdir zynx-capital
cd zynx-capital
```

2. **Download all files from Figma Make**
   - Use Browser DevTools method (see FULL_PROJECT_EXPORT.md)
   - Or manually copy-paste each file
   - Save to your local `zynx-capital` folder

3. **Create config files** (from FULL_PROJECT_EXPORT.md):
   - `package.json`
   - `vite.config.ts`
   - `tsconfig.json`
   - `tsconfig.node.json`
   - `.env` (with your Supabase keys)

4. **Copy these files from Figma Make:**
   - `.gitignore` (already created)
   - `README.md` (already created)

---

### Part 2: Initialize Git (5 minutes)

Open terminal in your `zynx-capital` folder:

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: ZYNX CAPITAL prop firm platform"
```

---

### Part 3: Create GitHub Repository (5 minutes)

#### Step 1: Go to GitHub

1. Open [https://github.com](https://github.com)
2. Log in to your account
3. Click the **"+"** icon (top right) → "New repository"

#### Step 2: Configure Repository

Fill in these details:

- **Repository name**: `zynx-capital`
- **Description**: `Premium trading prop firm platform with authentication and funding system`
- **Visibility**: 
  - ✅ **Private** (recommended - keeps your code secret)
  - ⬜ Public (if you want to share)
- **Initialize repository**: 
  - ⬜ **UNCHECK** "Add a README file" (we already have one)
  - ⬜ **UNCHECK** "Add .gitignore" (we already have one)
  - ⬜ **UNCHECK** "Choose a license"

Click **"Create repository"**

---

### Part 4: Connect Local to GitHub (3 minutes)

After creating the repo, GitHub shows you commands. Copy them:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/zynx-capital.git

# Rename branch to main (if needed)
git branch -M main

# Push code to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username!

#### If you get authentication errors:

**Option 1: Use Personal Access Token (Recommended)**

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name it "ZYNX CAPITAL"
4. Select scopes: `repo` (full control)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use token as password when pushing:
   ```bash
   git push -u origin main
   # Username: your_github_username
   # Password: paste_your_token_here
   ```

**Option 2: Use GitHub CLI**

```bash
# Install GitHub CLI
# Windows: winget install --id GitHub.cli
# Mac: brew install gh
# Linux: sudo apt install gh

# Login
gh auth login

# Push code
git push -u origin main
```

---

### Part 5: Verify Upload (1 minute)

1. Go to `https://github.com/YOUR_USERNAME/zynx-capital`
2. You should see all your files! 🎉
3. Check that `.env` is **NOT** visible (it should be ignored)

---

### Part 6: Clone to Any Computer (For Future Use)

Whenever you need the code on a new computer:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/zynx-capital.git
cd zynx-capital

# Install dependencies
npm install

# Create .env file (copy from secure location)
# Add your Supabase and Google keys

# Run project
npm run dev
```

---

## 🎯 Daily Workflow (After Setup)

### Making Changes

```bash
# 1. Make your code changes in VS Code

# 2. See what changed
git status

# 3. Add all changes
git add .

# 4. Commit with message
git commit -m "Add new feature: XYZ"

# 5. Push to GitHub
git push
```

### Getting Latest Code (if working on multiple computers)

```bash
# Pull latest changes
git pull
```

---

## 📋 Common Git Commands

```bash
# Check status (what changed)
git status

# View commit history
git log

# Undo changes to a file
git checkout -- filename.tsx

# Create a new branch (for testing features)
git checkout -b feature-name

# Switch back to main branch
git checkout main

# Merge feature branch into main
git merge feature-name

# Delete branch
git branch -d feature-name
```

---

## ⚠️ Important Notes

### Never Commit These Files:
- `.env` (contains secrets) ✅ Already in .gitignore
- `node_modules/` (too large) ✅ Already in .gitignore
- `dist/` or `build/` (generated files) ✅ Already in .gitignore

### Always Commit These Files:
- All `.tsx`, `.ts`, `.css` files
- `package.json`
- `vite.config.ts`, `tsconfig.json`
- `README.md`, `.gitignore`
- `index.html`

---

## 🚀 Benefits of Using GitHub

✅ **Backup**: Your code is safe in the cloud
✅ **Version Control**: Track every change, undo mistakes
✅ **Collaboration**: Work with team members
✅ **Deployment**: Easy deploy to Vercel/Netlify
✅ **Access Anywhere**: Clone to any computer
✅ **History**: See who changed what and when

---

## 🆘 Troubleshooting

### "fatal: not a git repository"
```bash
# Make sure you're in the right folder
cd path/to/zynx-capital

# Initialize git
git init
```

### "remote origin already exists"
```bash
# Remove old remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/zynx-capital.git
```

### "failed to push some refs"
```bash
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### "Authentication failed"
- Use Personal Access Token (not password)
- Or use GitHub CLI: `gh auth login`

---

## 🎯 Next Steps After GitHub Setup

1. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Add environment variables (.env contents)
   - Deploy! ✨

2. **Set up automatic deployments**:
   - Every `git push` automatically deploys
   - Preview URLs for testing
   - Production URL: `zynx-capital.vercel.app`

3. **Custom domain** (zynx.world):
   - Configure in Vercel settings
   - Point DNS to Vercel

---

## ✅ Quick Checklist

Before you start:
- [ ] Have GitHub account
- [ ] Git installed on computer
- [ ] Project files downloaded from Figma Make
- [ ] `.env` file created (NOT committed)
- [ ] Config files created (`vite.config.ts`, etc.)

After setup:
- [ ] Can see repo on GitHub.com
- [ ] `.env` is NOT visible on GitHub
- [ ] All source files visible on GitHub
- [ ] Can clone to another folder and it works
- [ ] `npm install` and `npm run dev` works after clone

---

**Ready to start? Follow Part 1!** 🚀

Need help at any step? Let me know! 💪
