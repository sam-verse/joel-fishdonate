export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="gradient-ocean min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-repeat animate-float floating-pattern"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slideDown">
            Fish Donation Logistics
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90 animate-slideUp">
            Turning Surplus Catch Into Life-Saving Meals
          </p>
          <p className="text-lg md:text-xl mb-8 opacity-80 animate-slideUp">
            AI-powered platform connecting fishing communities worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection("donate")}
              className="gradient-primary px-8 py-3 rounded-lg font-medium text-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              Start Donating
            </button>
            <button 
              onClick={() => scrollToSection("chatbot")}
              className="bg-white bg-opacity-20 backdrop-blur-sm px-8 py-3 rounded-lg font-medium text-lg hover:bg-opacity-30 transition-all duration-300"
            >
              Try AI Assistant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
