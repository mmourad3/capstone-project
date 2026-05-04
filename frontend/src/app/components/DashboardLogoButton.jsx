import { useNavigate } from "react-router";
import { getDashboardPath } from "../utils/navigationHelpers";
import { useAuth } from "../contexts/AuthContext";

export default function RedirectToDashboard({ children, className = "" }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (user?.role) {
      navigate(getDashboardPath(user.role));
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
