// components/category-sections/SponsoredBrands.tsx
export default function SponsoredBrands() {
  const brands = [
    { name: "Sony", desc: "Premium Audio Solutions" },
    { name: "Pioneer", desc: "Innovation in Sound" },
    { name: "Bosch", desc: "Quality You Trust" },
    { name: "JBL", desc: "Power & Performance" },
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-900">Sponsored Brands</h2>
        <button className="text-blue-600 text-sm font-semibold">View All →</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {brands.map((b, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-sm border text-center hover:shadow transition"
          >
            <h3 className="font-semibold text-gray-900">{b.name}</h3>
            <p className="text-sm text-gray-600">{b.desc}</p>

            <button className="mt-3 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              Explore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
