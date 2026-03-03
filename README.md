# ZYNX CAPITAL 💎

A premium trading prop firm platform with complete authentication, dashboard, and funding application system.

![ZYNX CAPITAL](https://img.shields.io/badge/ZYNX-CAPITAL-ff1493?style=for-the-badge)

## 🌟 Features

- **Complete Authentication System**: Sign up, sign in, Google OAuth
- **Real-time Dashboard**: Account balance, wallet tracking, MT5 credentials
- **Funding Applications**: Apply for free funding through challenges
- **Reviews & Testimonials**: Community-driven feedback system
- **Legal Pages**: Terms, Privacy Policy, Risk Disclosure
- **Responsive Design**: iOS-inspired smooth animations
- **Dark/White/Pink Theme**: Premium floating design elements

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Authentication + Database)
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: Formspree integration

## 📦 Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Supabase account
- Google OAuth credentials (optional)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/zynx-capital.git
cd zynx-capital
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://muhztdszuirjqyujsaot.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Get your keys:**
- **Supabase**: [Dashboard](https://supabase.com) → Project Settings → API → `anon/public` key
- **Google OAuth**: [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials

### 4. Set up Supabase Database

Run these SQL commands in your Supabase SQL Editor:

#### Create Profiles Table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### Create Reviews Table
```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

## 📁 Project Structure

```
zynx-capital/
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── components/     # React components
│   │   │   ├── figma/     # Figma-specific components
│   │   │   ├── Footer.tsx
│   │   │   ├── LiveSupport.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── SplashScreen.tsx
│   │   │   └── Testimonials.tsx
│   │   ├── context/       # React Context (Auth)
│   │   ├── lib/           # Utilities (Supabase client)
│   │   ├── pages/         # Page components
│   │   │   ├── Landing.tsx
│   │   │   ├── Auth.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Challenges.tsx
│   │   │   ├── Wallet.tsx
│   │   │   ├── TermsConditions.tsx
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   └── RiskDisclosure.tsx
│   │   ├── App.tsx        # Main app component
│   │   └── routes.ts      # React Router configuration
│   ├── styles/            # Global styles
│   │   ├── index.css
│   │   ├── theme.css
│   │   └── fonts.css
│   └── main.tsx           # Entry point
├── .env                   # Environment variables (create this)
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🧪 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins: `http://localhost:3000`
6. Add authorized redirect URIs: `http://localhost:3000`
7. Copy Client ID to `.env`

### Supabase Configuration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing
3. Go to Settings → API
4. Copy Project URL and `anon/public` key
5. Add to `.env` file
6. Run SQL commands from Quick Start section

### Formspree Integration

The app uses Formspree for funding applications:
- Endpoint: `https://formspree.io/f/mqelrneo`
- All form submissions go to your configured email

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Add environment variables in Netlify dashboard
```

## 📱 Features Breakdown

### Authentication
- Email/Password sign up and login
- Google OAuth integration
- Protected routes
- Persistent sessions
- Profile management

### Dashboard
- Account balance display
- Wallet overview
- MT5 login credentials
- Quick actions (deposit, withdraw, trade)
- Account statistics

### Challenges
- View available funding challenges
- Apply for funding
- Track challenge progress
- Challenge requirements and rules

### Reviews System
- Submit testimonials
- Star ratings (1-5)
- Persistent storage in Supabase
- Display community reviews
- User-specific review management

### Wallet
- Multiple withdrawal methods:
  - Cryptocurrency (BTC/USDT)
  - Neteller
  - PayPal
- Deposit options
- Transaction history

## 🎨 Customization

### Colors
Edit `/src/styles/theme.css` to customize the color scheme:
- Primary: Pink (#ff1493)
- Background: Dark gradient
- Text: White/Gray scale

### Animations
Motion animations configured in components. Adjust timing in individual component files.

## 📄 License

This project is private and proprietary to ZYNX CAPITAL.

## 🆘 Support

For issues or questions:
- Email: support@zynx.world
- Instagram: [@zynxcapital](https://instagram.com/zynxcapital)

## 🔗 Links

- Website: [zynx.world](https://zynx.world)
- Instagram: [@zynxcapital](https://instagram.com/zynxcapital)

---

**Built with ❤️ by ZYNX CAPITAL Team**
