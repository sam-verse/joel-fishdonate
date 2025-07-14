import { useState } from "react";
import { User } from "@shared/schema";

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Header({ user, onLogin, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed w-full top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <i className="fas fa-fish text-white text-2xl mr-3"></i>
            <span className="text-white font-bold text-xl">FishDonate</span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => scrollToSection("home")}
                className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("chatbot")}
                className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
              >
                AI Assistant
              </button>
              <button
                onClick={() => scrollToSection("donate")}
                className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
              >
                Donate
              </button>
              <button
                onClick={() => scrollToSection("alerts")}
                className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
              >
                Alerts
              </button>
              {user && (
                <button
                  onClick={() => scrollToSection("dashboard")}
                  className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {/* Download Project Button */}
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/api/export/project';
                  link.download = 'fish-donation-logistics-app.zip';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-opacity-30 transition-all flex items-center space-x-2"
                title="Download complete project as ZIP file"
              >
                <i className="fas fa-download"></i>
                <span>Download</span>
              </button>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-white text-sm">Welcome, {user.name}</span>
                  <button
                    onClick={onLogout}
                    className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLogin}
                  className="gradient-primary text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-md"
            >
              <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => scrollToSection("home")}
              className="text-white hover:bg-white hover:bg-opacity-20 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("chatbot")}
              className="text-white hover:bg-white hover:bg-opacity-20 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              AI Assistant
            </button>
            <button
              onClick={() => scrollToSection("donate")}
              className="text-white hover:bg-white hover:bg-opacity-20 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              Donate
            </button>
            <button
              onClick={() => scrollToSection("alerts")}
              className="text-white hover:bg-white hover:bg-opacity-20 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              Alerts
            </button>
            {user && (
              <button
                onClick={() => scrollToSection("dashboard")}
                className="text-white hover:bg-white hover:bg-opacity-20 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
