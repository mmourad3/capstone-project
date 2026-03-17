import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import LifestyleQuestionnaire from "./pages/LifestyleQuestionnaire";
import DormSeekerDashboard from "./pages/DormSeekerDashboard";
import DormProviderDashboard from "./pages/DormProviderDashboard";
import CarpoolDashboard from "./pages/CarpoolDashboard";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

// UniMate Application Routes
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
      { path: "terms", Component: Terms },
      { path: "privacy", Component: Privacy },
      { path: "how-it-works", Component: HowItWorks },
      { path: "login", Component: Login },
      { path: "signup", Component: SignUp },
      { path: "verify-email", Component: VerifyEmail },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "profile", Component: Profile },
      { path: "profile/:userId", Component: ProfilePage }, // Unified profile - shows button based on roles
      { path: "provider-profile/:providerId", Component: ProfilePage }, // Same component, different route
      { path: "lifestyle-questionnaire", Component: LifestyleQuestionnaire },
      { path: "dashboard/dorm-seeker", Component: DormSeekerDashboard },
      { path: "dashboard/dorm-provider", Component: DormProviderDashboard },
      { path: "dashboard/carpool", Component: CarpoolDashboard },
      { path: "*", Component: NotFound }, // Catch-all route for 404
    ],
  },
]);