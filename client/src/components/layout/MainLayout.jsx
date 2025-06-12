import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SiteHelperWidget from "../common/SiteHelperWidget";

// Routes where we want to hide certain components
const ROUTES = {
  // Routes where footer should be hidden
  hideFooter: ["/auth", "/login", "/signup", "/forgot-password"],
  // Routes where navbar should be hidden
  hideNavbar: ["/auth", "/login", "/signup", "/forgot-password"],
  // Routes where site helper should be hidden
  hideHelper: ["/auth", "/login", "/signup", "/forgot-password"],
};

export default function MainLayout({ children }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if components should be hidden based on current route
  const shouldHideFooter = ROUTES.hideFooter.includes(currentPath);
  const shouldHideNavbar = ROUTES.hideNavbar.includes(currentPath);
  const shouldHideHelper = ROUTES.hideHelper.includes(currentPath);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Navigation */}
      {!shouldHideNavbar && <Navbar />}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {!shouldHideFooter && <Footer />}

      {/* Site Helper Widget */}
      {!shouldHideHelper && <SiteHelperWidget />}
    </div>
  );
}