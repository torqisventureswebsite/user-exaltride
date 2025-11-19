import { IndianRupee, Medal, Gauge, Calendar, ArrowRight } from "lucide-react";

export default function HighlightsRow() {
  const items = [
    {
      title: "Budget Friendly",
      desc: "Under ₹2,000",
      count: "145 items",
      icon: <IndianRupee className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Best Sellers",
      desc: "Top rated products",
      count: "89 items",
      icon: <Medal className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Premium Range",
      desc: "High-end systems",
      count: "56 items",
      icon: <Gauge className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Latest Arrivals",
      desc: "New this month",
      count: "34 items",
      icon: <Calendar className="h-5 w-5 text-blue-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="
            bg-white border border-gray-200 rounded-2xl 
            p-4 flex items-center gap-4
            hover:shadow-md transition-shadow cursor-pointer
          "
        >
          {/* Left Icon */}
          <div className="p-3 bg-blue-50 rounded-xl">
            {item.icon}
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
            <p className="text-xs text-blue-600 font-medium mt-1">{item.count}</p>
          </div>

          {/* Arrow Icon */}
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </div>
      ))}
    </div>
  );
}
