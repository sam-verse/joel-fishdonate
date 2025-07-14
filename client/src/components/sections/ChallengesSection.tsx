export default function ChallengesSection() {
  const challenges = [
    {
      icon: "🌊",
      title: "Overfishing Crisis",
      description: "Unsustainable fishing practices deplete stocks, disrupt food webs, and endanger species critical to marine ecosystems."
    },
    {
      icon: "💔",
      title: "Massive Wastage",
      description: "Billions lost yearly in catch, storage, and labor—hurting fishermen and seafood industries globally."
    },
    {
      icon: "📚",
      title: "Community Challenges",
      description: "Small-scale fishermen often face issues like illiteracy, natural disasters, and market inefficiencies."
    }
  ];

  return (
    <section id="challenges" className="py-20 gradient-alt">
      <div className="container mx-auto px-4">
        <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-2xl backdrop-blur-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
            Why Innovate for Fishing Communities?
          </h2>
          <p className="text-lg text-center mb-12 text-gray-600 max-w-4xl mx-auto">
            Fishing supports millions of livelihoods worldwide, but faces critical challenges that require tech-based, socially impactful solutions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {challenges.map((challenge, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-primary">
                <div className="text-4xl mb-4">{challenge.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{challenge.title}</h3>
                <p className="text-gray-600">{challenge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
