import { createBrowserRouter } from "react-router";
import { Landing } from "./pages/Landing";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Challenges } from "./pages/Challenges";
import { Wallet } from "./pages/Wallet";
import { Profile } from "./pages/Profile";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsConditions } from "./pages/TermsConditions";
import { RiskDisclosure } from "./pages/RiskDisclosure";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/auth",
    Component: Auth,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/challenges",
    Component: Challenges,
  },
  {
    path: "/wallet",
    Component: Wallet,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/privacy",
    Component: PrivacyPolicy,
  },
  {
    path: "/terms",
    Component: TermsConditions,
  },
  {
    path: "/risk-disclosure",
    Component: RiskDisclosure,
  },
]);