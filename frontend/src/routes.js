import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./app/pages/Home";
import About from "./app/pages/About";
import Contact from "./app/pages/Contact";
import Terms from "./app/pages/Terms";
import Privacy from "./app/pages/Privacy";
import HowItWorks from "./app/pages/HowItWorks";
import Login from "./app/pages/Login";
import SignUp from "./app/pages/SignUp";
import ForgotPassword from "./app/pages/ForgotPassword";
import Profile from "./app/pages/Profile";
import LifestyleQuestionnaire from "./app/pages/LifestyleQuestionnaire";
import DormSeekerDashboard from "./app/pages/DormSeekerDashboard";
import DormProviderDashboard from "./app/pages/DormProviderDashboard";
import CarpoolDashboard from "./app/pages/CarpoolDashboard";
import ProfilePage from "./app/pages/ProfilePage";
import NotFound from "./app/pages/NotFound";

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
      { path: "forgot-password", Component: ForgotPassword },
      { path: "profile", Component: Profile },
      { path: "profile/:userId", Component: ProfilePage }, // Unified profile - shows button based on roles
      { path: "provider-profile/:providerId", Component: ProfilePage }, // Same component, different route
      { path: "lifestyle-questionnaire", Component: LifestyleQuestionnaire },
      { path: "dashboard/dorm-seeker", Component: DormSeekerDashboard },
      { path: "dashboard/dorm-provider", Component: DormProviderDashboard },
      { path: "dashboard/carpool", Component: CarpoolDashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);