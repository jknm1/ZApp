import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Landing } from "./pages/Landing";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Challenges } from "./pages/Challenges";
import { Wallet } from "./pages/Wallet";
import { Profile } from "./pages/Profile";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsConditions } from "./pages/TermsConditions";
import { RiskDisclosure } from "./pages/RiskDisclosure";
import { ResetPassword } from "./pages/ResetPassword";
import { Referrals } from "./pages/Referrals";
import { TradingJournal } from "./pages/TradingJournal";
import { Education } from "./pages/Education";
import { AdminDashboard } from "./pages/AdminDashboard";
import { WithdrawalRequest } from "./pages/WithdrawalRequest";
import { PayoutHistory } from "./pages/PayoutHistory";
import { ApplicationTracker } from "./pages/ApplicationTracker";
import { TradingCalendar } from "./pages/TradingCalendar";
import { Achievements } from "./pages/Achievements";
import { KYCVerification } from "./pages/KYCVerification";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Landing,
      },
      {
        path: "auth",
        Component: Auth,
      },
      {
        path: "reset-password",
        Component: ResetPassword,
      },
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "challenges",
        Component: Challenges,
      },
      {
        path: "wallet",
        Component: Wallet,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "referrals",
        Component: Referrals,
      },
      {
        path: "journal",
        Component: TradingJournal,
      },
      {
        path: "education",
        Component: Education,
      },
      {
        path: "admin",
        Component: AdminDashboard,
      },
      {
        path: "withdrawal",
        Component: WithdrawalRequest,
      },
      {
        path: "payout-history",
        Component: PayoutHistory,
      },
      {
        path: "application-tracker",
        Component: ApplicationTracker,
      },
      {
        path: "trading-calendar",
        Component: TradingCalendar,
      },
      {
        path: "achievements",
        Component: Achievements,
      },
      {
        path: "kyc",
        Component: KYCVerification,
      },
      {
        path: "privacy",
        Component: PrivacyPolicy,
      },
      {
        path: "terms",
        Component: TermsConditions,
      },
      {
        path: "risk-disclosure",
        Component: RiskDisclosure,
      },
    ],
  },
]);