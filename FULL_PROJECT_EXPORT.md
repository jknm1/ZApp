# 🚀 ZYNX CAPITAL - Complete Project Export

## Quick Setup Commands

```bash
# 1. Create project folder
mkdir zynx-capital
cd zynx-capital

# 2. Initialize project
npm init -y

# 3. Install all dependencies
npm install react react-dom react-router @supabase/supabase-js motion lucide-react @react-oauth/google sonner recharts react-slick slick-carousel

npm install -D @types/react @types/react-dom @types/react-slick vite @vitejs/plugin-react typescript tailwindcss postcss autoprefixer

# 4. Create folder structure
mkdir -p src/app/components/figma src/app/context src/app/lib src/app/pages src/styles public

# 5. Create config files (see below)
```

---

## 📁 File List & URLs

### **To Download Files from Figma Make:**

**Method:** Open each URL in browser, copy content, save to VS Code

| File Path | Figma Make URL |
|-----------|----------------|
| `/index.html` | `[Your current URL]/index.html` |
| `/src/main.tsx` | `[Your current URL]/src/main.tsx` |
| `/src/app/App.tsx` | `[Your current URL]/src/app/App.tsx` |
| `/src/app/routes.ts` | `[Your current URL]/src/app/routes.ts` |
| `/src/app/components/Footer.tsx` | `[Your current URL]/src/app/components/Footer.tsx` |
| `/src/app/components/LiveSupport.tsx` | `[Your current URL]/src/app/components/LiveSupport.tsx` |
| `/src/app/components/ReviewForm.tsx` | `[Your current URL]/src/app/components/ReviewForm.tsx` |
| `/src/app/components/RootLayout.tsx` | `[Your current URL]/src/app/components/RootLayout.tsx` |
| `/src/app/components/SplashScreen.tsx` | `[Your current URL]/src/app/components/SplashScreen.tsx` |
| `/src/app/components/Testimonials.tsx` | `[Your current URL]/src/app/components/Testimonials.tsx` |
| `/src/app/components/figma/ImageWithFallback.tsx` | `[Your current URL]/src/app/components/figma/ImageWithFallback.tsx` |
| `/src/app/context/AuthContext.tsx` | `[Your current URL]/src/app/context/AuthContext.tsx` |
| `/src/app/lib/supabase.ts` | `[Your current URL]/src/app/lib/supabase.ts` |
| `/src/app/pages/Auth.tsx` | `[Your current URL]/src/app/pages/Auth.tsx` |
| `/src/app/pages/Challenges.tsx` | `[Your current URL]/src/app/pages/Challenges.tsx` |
| `/src/app/pages/Dashboard.tsx` | `[Your current URL]/src/app/pages/Dashboard.tsx` |
| `/src/app/pages/Landing.tsx` | `[Your current URL]/src/app/pages/Landing.tsx` |
| `/src/app/pages/PrivacyPolicy.tsx` | `[Your current URL]/src/app/pages/PrivacyPolicy.tsx` |
| `/src/app/pages/Profile.tsx` | `[Your current URL]/src/app/pages/Profile.tsx` |
| `/src/app/pages/RiskDisclosure.tsx` | `[Your current URL]/src/app/pages/RiskDisclosure.tsx` |
| `/src/app/pages/TermsConditions.tsx` | `[Your current URL]/src/app/pages/TermsConditions.tsx` |
| `/src/app/pages/Wallet.tsx` | `[Your current URL]/src/app/pages/Wallet.tsx` |
| `/src/styles/index.css` | `[Your current URL]/src/styles/index.css` |
| `/src/styles/theme.css` | `[Your current URL]/src/styles/theme.css` |
| `/src/styles/fonts.css` | `[Your current URL]/src/styles/fonts.css` |

---

## 📄 Config Files to Create

### `package.json`
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
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router": "^7.1.3",
    "@supabase/supabase-js": "^2.47.10",
    "motion": "^11.15.0",
    "lucide-react": "^0.468.0",
    "@react-oauth/google": "^0.12.1",
    "sonner": "^1.7.1",
    "recharts": "^2.15.0",
    "react-slick": "^0.30.2",
    "slick-carousel": "^1.8.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@types/react-slick": "^0.23.13",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.2",
    "vite": "^6.0.11",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  }
}
```

### `vite.config.ts`
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

### `tsconfig.json`
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

### `tsconfig.node.json`
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

### `.env`
```env
VITE_SUPABASE_URL=https://muhztdszuirjqyujsaot.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_FROM_SUPABASE_DASHBOARD
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

⚠️ **Get your keys from:**
- Supabase: Dashboard → Settings → API → anon/public key
- Google: Google Cloud Console → APIs & Services → Credentials

---

## 🎯 Alternative: Use GitHub

If you want the **absolute easiest method:**

1. I can help you set up a GitHub repository
2. You initialize Git in VS Code
3. Clone the repo
4. Start developing

Would you like me to create a `.gitignore` and Git setup instructions?

---

## ⚡ Fastest Manual Method (15 minutes)

1. **Open Figma Make in browser**
2. **Open VS Code** with new project folder
3. **For each file above:**
   - In Figma: View file → Select All (Ctrl+A) → Copy (Ctrl+C)
   - In VS Code: Create file → Paste (Ctrl+V) → Save
4. **Create config files** (copy from above)
5. **Run:** `npm install` then `npm run dev`

---

## 💡 Pro Tip: Use Multi-Cursor

In VS Code:
1. Create all files at once using terminal
2. Open multiple files (Ctrl+P to search)
3. Use split view (Ctrl+\)
4. Copy-paste in batches

---

## ✅ Verification Checklist

After export:
- [ ] All files created
- [ ] Dependencies installed
- [ ] `.env` configured
- [ ] `npm run dev` works
- [ ] App loads at localhost:3000
- [ ] Can login/signup
- [ ] Dashboard works
- [ ] Reviews load from Supabase

---

## 🚨 Need Help?

If you get stuck at any step, just ask! Common issues:
- Missing dependencies → `npm install`
- Supabase errors → Check `.env` keys
- TypeScript errors → `npm install -D @types/[package]`
- Port conflicts → Change port in `vite.config.ts`

---

**Ready to export? Let me know if you need help with any specific step!** 🚀
