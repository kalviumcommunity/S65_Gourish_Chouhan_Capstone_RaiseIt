import { Link } from "react-router-dom";
import { CircleDot, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const profilePath = `/profile/${user?.id || user?._id || "me"}`;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center text-black">
              <CircleDot className="h-6 w-6" strokeWidth={2.1} />
            </span>
            <span className="leading-none text-2xl font-semibold tracking-tight text-black">
              RaiseIt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/concerns" 
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              Concerns
            </Link>
            <Link 
              to="/community" 
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              Community
            </Link>
            <Link 
              to="/donate" 
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              Donate
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to={profilePath} className="text-sm font-medium text-gray-700 hover:text-black">
                  {user?.name || "Profile"}
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
                    Log in
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/concerns" 
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Concerns
              </Link>
              <Link 
                to="/community" 
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/donate" 
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Donate
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <div className="flex flex-col gap-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <Link to={profilePath} onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-center text-gray-600 hover:text-primary">
                        {user?.name || "Profile"}
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-center text-gray-600 hover:text-primary">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full justify-center bg-primary hover:bg-primary/90">
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
