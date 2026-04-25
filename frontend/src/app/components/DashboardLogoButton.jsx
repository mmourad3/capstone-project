import { useNavigate } from "react-router";
import { getDashboardPath } from "../utils/navigationHelpers";

export default function RedirectToDashboard({ children, className = "" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const isLoggedIn = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");

    if (isLoggedIn && role) {
      navigate(getDashboardPath(role));
    } else {
      navigate("/");
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
