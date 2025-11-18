// components/category-sections/HighlightsRow.tsx
export default function HighlightsRow() {
  const items = [
    { title: "Budget Friendly", desc: "Under ₹2,000", count: "145 items" },
    { title: "Best Sellers", desc: "Top rated products", count: "89 items" },
    { title: "Premium Range", desc: "High-end systems", count: "56 items" },
    { title: "Latest Arrivals", desc: "New this month", count: "34 items" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl shadow-sm border hover:shadow transition"
        >
          <h3 className="font-semibold text-gray-900">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.desc}</p>
          <p className="text-xs text-blue-600 font-medium mt-1">{item.count}</p>
        </div>
      ))}
    </div>
  );
}
