# 🚀 Export ZYNX CAPITAL to VS Code

## 📋 Complete Guide to Running Locally

---

## ✅ **Prerequisites**

Before you start, install these:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **VS Code**
   - Download: https://code.visualstudio.com/

3. **Git** (optional)
   - Download: https://git-scm.com/

---

## 📁 **Project Structure**

Your project uses:
- ⚛️ **React 18** with TypeScript
- 🎨 **Tailwind CSS v4**
- 🗂️ **React Router**
- 🔐 **Supabase** for backend
- 📦 **Vite** for build tool

---

## 🔧 **Step-by-Step Setup**

### **Step 1: Create Project Folder**

```bash
# Create folder
mkdir zynx-capital
cd zynx-capital

# Initialize npm project
npm init -y
```

---

### **Step 2: Install Dependencies**

```bash
npm install react react-dom
npm install -D @types/react @types/react-dom
npm install -D vite @vitejs/plugin-react
npm install -D typescript
npm install -D tailwindcss postcss autoprefixer
npm install react-router
npm install @supabase/supabase-js
npm install motion
npm install lucide-react
npm install @react-oauth/google
npm install sonner
npm install recharts
npm install react-slick slick-carousel
npm install @types/react-slick
```

---

### **Step 3: Create Configuration Files**

#### **`package.json`**

```json
{
  "name": "zynx-capital",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@react-oauth/google": "^0.12.1",
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.344.0",
    "motion": "^10.18.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router": "^7.1.1",
    "recharts": "^2.10.3",
    "sonner": "^1.3.1",
    "react-slick": "^0.30.2",
    "slick-carousel": "^1.8.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@types/react-slick": "^0.23.13",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.3.3",
    "vite": "^5.1.0"
  }
}
```

#### **`tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### **`tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

#### **`vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

#### **`.gitignore`**

```
# Dependencies
node_modules
.pnpm-store

# Build
dist
build

# Environment
.env
.env.local

# IDE
.vscode
.idea

# OS
.DS_Store
Thumbs.db
```

---

### **Step 4: Create Environment File**

Create **`.env`** in root:

```env
VITE_SUPABASE_URL=https://muhztdszuirjqyujsaot.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_eE-67PETmOR4yS8B1OLxdA_l0NSaJ_Y
```

⚠️ **IMPORTANT:** Get your correct keys from Supabase:
1. Go to Supabase Dashboard → Project Settings → API
2. Copy **Project URL** → Use for `VITE_SUPABASE_URL`
3. Copy **anon public** key → Use for `VITE_SUPABASE_ANON_KEY`

---

### **Step 5: Create Project Structure**

```bash
# Create folders
mkdir -p src/app/components
mkdir -p src/app/components/ui
mkdir -p src/app/context
mkdir -p src/app/lib
mkdir -p src/app/pages
mkdir -p src/styles
mkdir -p public
```

---

### **Step 6: Copy All Files**

You need to copy these files from Figma Make to VS Code:

#### **Root Files:**
- `index.html`

#### **`/src/` folder:**
- `main.tsx`

#### **`/src/app/` folder:**
- `App.tsx`
- `routes.ts`

#### **`/src/app/components/` folder:**
- `Footer.tsx`
- `LiveSupport.tsx`
- `ReviewForm.tsx`
- `SplashScreen.tsx`
- `Testimonials.tsx`

#### **`/src/app/context/` folder:**
- `AuthContext.tsx`

#### **`/src/app/lib/` folder:**
- `supabase.ts`

#### **`/src/app/pages/` folder:**
- `Landing.tsx`
- `Auth.tsx`
- `Dashboard.tsx`
- `Profile.tsx`
- `Challenges.tsx`
- `Wallet.tsx`
- `Support.tsx`
- `Terms.tsx`
- `Privacy.tsx`
- `Contact.tsx`

#### **`/src/styles/` folder:**
- `index.css`
- `theme.css`
- `fonts.css`

---

### **Step 7: Update Supabase Config**

Edit `/src/app/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ... rest of file
```

---

### **Step 8: Run Development Server**

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open browser: **http://localhost:3000** 🚀

---

## 🎯 **VS Code Extensions (Recommended)**

Install these extensions:

1. **ES7+ React/Redux/React-Native snippets**
2. **Tailwind CSS IntelliSense**
3. **ESLint**
4. **Prettier - Code formatter**
5. **Path Intellisense**

---

## 🔧 **Common Issues & Fixes**

### **Issue: Module not found**
```bash
npm install
```

### **Issue: Tailwind not working**
```bash
npm install -D tailwindcss@latest postcss autoprefixer
```

### **Issue: Supabase errors**
- Check `.env` file exists
- Verify API keys are correct
- Restart dev server: `npm run dev`

---

## 📦 **Build for Production**

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Output will be in `/dist` folder.

---

## 🚀 **Deploy to Production**

### **Option 1: Vercel**
```bash
npm install -g vercel
vercel
```

### **Option 2: Netlify**
1. Drag `/dist` folder to netlify.com/drop
2. Done!

### **Option 3: GitHub Pages**
```bash
npm install -D gh-pages
# Add to package.json scripts:
# "deploy": "gh-pages -d dist"
npm run build
npm run deploy
```

---

## 📁 **Final Folder Structure**

```
zynx-capital/
├── node_modules/
├── public/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── Footer.tsx
│   │   │   ├── LiveSupport.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── SplashScreen.tsx
│   │   │   └── Testimonials.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── lib/
│   │   │   └── supabase.ts
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── Auth.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Challenges.tsx
│   │   │   ├── Wallet.tsx
│   │   │   ├── Support.tsx
│   │   │   ├── Terms.tsx
│   │   │   ├── Privacy.tsx
│   │   │   └── Contact.tsx
│   │   ├── App.tsx
│   │   └── routes.ts
│   ├── styles/
│   │   ├── index.css
│   │   ├── theme.css
│   │   └── fonts.css
│   └── main.tsx
├── .env
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## ✅ **Checklist**

- [ ] Node.js installed
- [ ] Project folder created
- [ ] Dependencies installed
- [ ] All files copied from Figma Make
- [ ] `.env` file created with Supabase keys
- [ ] `npm run dev` runs successfully
- [ ] App opens at localhost:3000
- [ ] Supabase connection working
- [ ] Can sign up/login
- [ ] Can submit reviews

---

## 🎉 **You're Done!**

Your ZYNX CAPITAL project is now running locally in VS Code!

**Next Steps:**
1. Make changes in VS Code
2. See live updates in browser
3. Commit to Git
4. Deploy to production

---

## 💡 **Pro Tips**

### **Hot Module Replacement (HMR):**
- Changes auto-refresh in browser
- No need to restart server

### **TypeScript Errors:**
- VS Code shows errors inline
- Fix them as you code

### **Git Integration:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

---

## 🆘 **Need Help?**

Common commands:

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

**Your project is now portable and can be edited anywhere!** 🎉
