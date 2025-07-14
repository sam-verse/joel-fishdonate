export default function ChatbotSection() {
  const features = [
    {
      icon: "🗣️",
      title: "Multilingual Support",
      description: "Voice and text interaction in local languages to overcome literacy barriers"
    },
    {
      icon: "⚖️",
      title: "Legal Knowledge",
      description: "Comprehensive knowledge on fishing laws and sustainable practices"
    },
    {
      icon: "🌤️",
      title: "Weather Intelligence",
      description: "Real-time weather updates and alerts for safer fishing operations"
    }
  ];

  return (
    <section id="chatbot" className="py-20 gradient-blue">
      <div className="container mx-auto px-4">
        <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-2xl backdrop-blur-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
            AI-Powered Fishing Assistant
          </h2>
          <p className="text-lg text-center mb-12 text-gray-600 max-w-4xl mx-auto">
            Breaking language barriers with intelligent, multilingual support for fishing communities worldwide
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Try the AI Assistant</h3>
            <p className="text-center text-gray-600 mb-4">
              Click the chat button in the bottom right to start a conversation with our AI assistant!
            </p>
            <div className="flex justify-center">
              <div className="animate-pulse-soft">
                <i className="fas fa-arrow-down text-primary text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
