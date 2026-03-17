import { useNavigate } from "react-router";

export function RedirectToDashboard({ isLoggedIn, userType, children, className }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (isLoggedIn && userType) {
      e.preventDefault();
      
      // Redirect to appropriate dashboard based on user type
      switch (userType) {
        case "dorm-seeker":
          navigate("/dashboard/dorm-seeker");
          break;
        case "dorm-provider":
          navigate("/dashboard/dorm-provider");
          break;
        case "carpool":
          navigate("/dashboard/carpool");
          break;
        default:
          navigate("/");
      }
    } else {
      // If not logged in, navigate to home
      navigate("/");
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
