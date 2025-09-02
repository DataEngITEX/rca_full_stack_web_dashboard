import { useState, useEffect } from "react";
import { Home, Download, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const [active, setActive] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth(); // 👈 get logout from AuthContext

  // Sync active state with current path on refresh or navigation
  useEffect(() => {
    if (location.pathname === "/") {
      setActive("home");
    } else {
      setActive(location.pathname.replace("/", ""));
    }
  }, [location]);

  const handleNavClick = (page) => {
    setActive(page);
    navigate(page === "home" ? "/" : `/${page}`);
  };

  const navItemClass = (page) =>
    `flex items-center justify-center p-4 transition-colors duration-200 cursor-pointer rounded-lg ${
      active === page
        ? "bg-gray-700 text-white"
        : "hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <div className="flex flex-col items-center py-8 space-y-8 h-screen fixed w-20 bg-gray-800 text-white shadow-lg rounded-r-xl">
      {/* Home */}
      <div
        className={navItemClass("home")}
        onClick={() => handleNavClick("home")}
        title="Home"
      >
        <Home className="h-7 w-7" />
      </div>

      {/* Process */}
      <div
        className={navItemClass("process")}
        onClick={() => handleNavClick("process")}
        title="Process"
      >
        <Download className="h-7 w-7" />
      </div>

      {/* Logout button at bottom */}
      <div
        className="flex items-center justify-center p-4 mt-auto transition-colors duration-200 cursor-pointer rounded-lg hover:bg-red-600 hover:text-white"
        onClick={logout} // 👈 call logout directly
        title="Logout"
      >
        <LogOut className="h-7 w-7" />
      </div>
    </div>
  );
};

export default Sidebar;
