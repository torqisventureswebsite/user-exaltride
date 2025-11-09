export function BrandsSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">Top Brands</h2>
      <div className="grid grid-cols-3 gap-8 md:grid-cols-4 lg:grid-cols-6">
        <div className="flex items-center justify-center rounded-lg border p-6">
          <span>Brand 1</span>
        </div>
        <div className="flex items-center justify-center rounded-lg border p-6">
          <span>Brand 2</span>
        </div>
        <div className="flex items-center justify-center rounded-lg border p-6">
          <span>Brand 3</span>
        </div>
        <div className="flex items-center justify-center rounded-lg border p-6">
          <span>Brand 4</span>
        </div>
        <div className="flex items-center justify-center rounded-lg border p-6">
          <span>Brand 5</span>
        </div>
        <div className="flex items-center justify-center rounded-lg border p-6">
          <span>Brand 6</span>
        </div>
      </div>
    </section>
  );
}
