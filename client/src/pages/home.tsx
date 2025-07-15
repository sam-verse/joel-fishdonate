import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import ChallengesSection from "../components/sections/ChallengesSection";
import ChatbotSection from "../components/sections/ChatbotSection";
import AlertsSection from "../components/sections/AlertsSection";
import ImpactSection from "../components/sections/ImpactSection";
import DonationForm from "../components/DonationForm";
import Dashboard from "../components/Dashboard";
import ChatBot from "../components/ChatBot";
import AlertSystem from "../components/AlertSystem";
import AppDemo from "../components/AppDemo";

export default function Home() {
  const { user, login, logout } = useAuth();

  const handleLogin = () => {
    // Mock login - in real app, this would integrate with authentication system
    login({
      id: 1,
      name: "John Fisher",
      email: "john@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      role: "user",
      createdAt: new Date(),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      <Header user={user} onLogin={handleLogin} onLogout={logout} />
      <AlertSystem />
      <ChatBot user={user} />
      
      <HeroSection />
      <ChallengesSection />
      <ChatbotSection />
      <AlertsSection />
      
      {/* App Demo Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <AppDemo user={user} />
        </div>
      </section>
      
      {/* Donation Section */}
      <section id="donate" className="py-20 gradient-blue">
        <div className="container mx-auto px-4">
          <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-2xl backdrop-blur-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
              Fish Donation Platform
            </h2>
            <p className="text-lg text-center mb-12 text-gray-600 max-w-4xl mx-auto">
              Connect surplus catch with communities in need. Make a real difference with every donation.
            </p>
            
            <DonationForm user={user} />
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      {user && (
        <section id="dashboard" className="py-20 gradient-ocean">
          <div className="container mx-auto px-4">
            <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-2xl backdrop-blur-lg">
              <Dashboard user={user} />
            </div>
          </div>
        </section>
      )}

      <ImpactSection />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <i className="fas fa-fish text-primary text-2xl mr-2"></i>
                <span className="text-xl font-bold">FishDonate</span>
              </div>
              <p className="text-gray-400">
                Connecting fishing communities worldwide through technology and compassion.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">AI Assistant</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Donation Platform</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Alert System</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FishDonate. All rights reserved. Built with ❤️ for fishing communities worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
