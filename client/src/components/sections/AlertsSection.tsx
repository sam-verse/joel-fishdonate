import DemoAlertGenerator from "../DemoAlertGenerator";

export default function AlertsSection() {
  const alertTypes = [
    {
      icon: "fas fa-exclamation-triangle",
      title: "Emergency Alerts",
      description: "Immediate notifications for life-threatening situations",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-500"
    },
    {
      icon: "fas fa-cloud-sun",
      title: "Weather Updates",
      description: "Real-time weather and sea condition monitoring",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-500"
    },
    {
      icon: "fas fa-water",
      title: "Tide Information",
      description: "High and low tide alerts for optimal fishing times",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-500"
    },
    {
      icon: "fas fa-fish",
      title: "Fishing Updates",
      description: "Season openings, regulations, and best practices",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-500"
    }
  ];

  return (
    <section id="alerts" className="py-20 gradient-alt">
      <div className="container mx-auto px-4">
        <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-2xl backdrop-blur-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
            Real-Time Alert System
          </h2>
          <p className="text-lg text-center mb-12 text-gray-600 max-w-4xl mx-auto">
            Stay safe with instant notifications about weather conditions, disasters, and fishing updates
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {alertTypes.map((alert, index) => (
              <div key={index} className={`${alert.bgColor} border ${alert.borderColor} p-6 rounded-xl`}>
                <i className={`${alert.icon} ${alert.iconColor} text-3xl mb-3`}></i>
                <h3 className={`font-bold ${alert.textColor} mb-2`}>{alert.title}</h3>
                <p className={`${alert.textColor} text-sm`}>{alert.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Check the top-right corner for live alerts! 
              <span className="block text-sm mt-1">Browser notifications will appear for high-priority alerts</span>
            </p>
            <div className="flex justify-center">
              <DemoAlertGenerator />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
