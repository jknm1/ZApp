# 📋 Quick Copy-Paste Checklist for VS Code

## ✅ Simple 3-Step Process

---

## **Step 1: Create New Project in VS Code**

1. Open VS Code
2. Open Terminal: `Ctrl + ~` (or `Cmd + ~` on Mac)
3. Run these commands:

```bash
mkdir zynx-capital
cd zynx-capital
npm init -y
```

---

## **Step 2: Install All Dependencies**

Copy and paste this entire block into terminal:

```bash
npm install react react-dom react-router @supabase/supabase-js motion lucide-react @react-oauth/google sonner recharts react-slick slick-carousel
npm install -D @types/react @types/react-dom @types/react-slick vite @vitejs/plugin-react typescript tailwindcss postcss autoprefixer
```

---

## **Step 3: Create Files & Copy Content**

### 📁 **Create This Folder Structure:**

```
zynx-capital/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   └── pages/
│   └── styles/
└── public/
```

In VS Code terminal:

```bash
mkdir -p src/app/components/ui src/app/components/figma src/app/context src/app/lib src/app/pages src/styles public
```

---

## **Step 4: Copy These Files from Figma Make**

### ✅ **Method A: Manual Copy (Recommended)**

For each file below:
1. Open file in Figma Make
2. Select All (`Ctrl+A` / `Cmd+A`)
3. Copy (`Ctrl+C` / `Cmd+C`)
4. Create same file in VS Code
5. Paste (`Ctrl+V` / `Cmd+V`)

---

### 📄 **Files to Copy:**

#### **Root Files:**
- [ ] `index.html`
- [ ] `.env` (create new - see below)
- [ ] `package.json` (update - see below)
- [ ] `tsconfig.json` (create new - see below)
- [ ] `vite.config.ts` (create new - see below)

#### **`/src/` folder:**
- [ ] `main.tsx`

#### **`/src/app/` folder:**
- [ ] `App.tsx`
- [ ] `routes.ts`

#### **`/src/app/components/` folder:**
- [ ] `Footer.tsx`
- [ ] `LiveSupport.tsx`
- [ ] `ReviewForm.tsx`
- [ ] `SplashScreen.tsx`
- [ ] `Testimonials.tsx`

#### **`/src/app/components/figma/` folder:**
- [ ] `ImageWithFallback.tsx`

#### **`/src/app/context/` folder:**
- [ ] `AuthContext.tsx`

#### **`/src/app/lib/` folder:**
- [ ] `supabase.ts`

#### **`/src/app/pages/` folder:**
- [ ] `Landing.tsx`
- [ ] `Auth.tsx`
- [ ] `Dashboard.tsx`
- [ ] `Profile.tsx`
- [ ] `Challenges.tsx`
- [ ] `Wallet.tsx`
- [ ] `Support.tsx`
- [ ] `Terms.tsx`
- [ ] `Privacy.tsx`
- [ ] `Contact.tsx`

#### **`/src/styles/` folder:**
- [ ] `index.css`
- [ ] `theme.css`
- [ ] `fonts.css`

---

## **Step 5: Create Config Files**

### 📄 **`.env`** (in root folder)

```env
VITE_SUPABASE_URL=https://muhztdszuirjqyujsaot.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ACTUAL_ANON_KEY_HERE
```

⚠️ **Get your real key from Supabase Dashboard → Settings → API**

---

### 📄 **`vite.config.ts`** (in root folder)

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

---

### 📄 **`tsconfig.json`** (in root folder)

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

---

### 📄 **`tsconfig.node.json`** (in root folder)

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

---

### 📄 **Update `package.json`** (in root folder)

Add these scripts:

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
  }
}
```

---

## **Step 6: Run Your Project!**

```bash
# Start development server
npm run dev
```

Open browser: **http://localhost:3000** 🚀

---

## 🎯 **Quick Test Checklist:**

- [ ] App loads at localhost:3000
- [ ] Landing page displays
- [ ] Can click "Get Started"
- [ ] Auth page loads
- [ ] Can sign up/login
- [ ] Dashboard displays
- [ ] Reviews load
- [ ] Can submit review

---

## ⚠️ **Common Issues:**

### **Module not found errors:**
```bash
npm install
```

### **Supabase connection fails:**
- Check `.env` file exists
- Verify Supabase keys are correct
- Restart server: `Ctrl+C` then `npm run dev`

### **Tailwind styles not working:**
```bash
npm install -D tailwindcss@latest
npm run dev
```

---

## 🎉 **Done!**

Your ZYNX CAPITAL project is now running in VS Code!

**What You Can Do Now:**
- ✅ Edit files locally
- ✅ See changes instantly (hot reload)
- ✅ Use Git for version control
- ✅ Deploy to Vercel/Netlify
- ✅ Share with team
- ✅ Work offline

---

## 💡 **VS Code Tips:**

### **Keyboard Shortcuts:**
- `Ctrl + P` - Quick file search
- `Ctrl + Shift + F` - Search in all files
- `Ctrl + ~` - Toggle terminal
- `Ctrl + B` - Toggle sidebar

### **Recommended Extensions:**
1. ES7+ React/Redux/React-Native snippets
2. Tailwind CSS IntelliSense
3. ESLint
4. Prettier

---

## 📦 **Build for Production:**

```bash
npm run build
```

Your app will be in the `/dist` folder, ready to deploy! 🚀

---

**Need the full detailed guide?** See `EXPORT_TO_VSCODE.md`
