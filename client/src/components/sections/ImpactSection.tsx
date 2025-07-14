export default function ImpactSection() {
  const stats = [
    {
      number: "2,547",
      label: "Tons of Fish Donated",
      gradient: "gradient-primary"
    },
    {
      number: "15,234",
      label: "Families Fed",
      gradient: "gradient-alt"
    },
    {
      number: "847",
      label: "Active Donors",
      gradient: "gradient-blue"
    },
    {
      number: "23",
      label: "Countries Reached",
      gradient: "gradient-ocean"
    }
  ];

  return (
    <section id="impact" className="py-20 gradient-primary">
      <div className="container mx-auto px-4">
        <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-2xl backdrop-blur-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
            Global Impact
          </h2>
          <p className="text-lg text-center mb-12 text-gray-600 max-w-4xl mx-auto">
            Together, we're transforming fishing communities and reducing food waste worldwide
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className={`${stat.gradient} text-white p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300`}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
