// components/category-sections/ServiceFeatures.tsx

export default function ServiceFeatures() {
  const features = [
    { icon: "🛡️", title: "100% Authentic", desc: "Genuine products from verified sellers" },
    { icon: "🚚", title: "Fast Delivery", desc: "Get your orders quickly & safely" },
    { icon: "↩️", title: "Easy Returns", desc: "7–10 days return policy on all products" },
    { icon: "💬", title: "24/7 Support", desc: "Expert assistance whenever you need" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map((f) => (
        <div
          key={f.title}
          className="bg-white border p-5 rounded-xl text-center shadow-sm"
        >
          <div className="text-3xl mb-2">{f.icon}</div>
          <h3 className="font-semibold">{f.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
