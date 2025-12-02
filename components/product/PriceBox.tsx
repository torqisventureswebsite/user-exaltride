interface PriceBoxProps {
  price?: number;
  compareAt?: number | null;
}

export default function PriceBox({ price = 0, compareAt = null }: PriceBoxProps) {
  const discount =
    compareAt && price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2 md:gap-3">
        <span className="text-2xl md:text-4xl font-bold text-gray-900">
          ₹{price.toLocaleString()}
        </span>

        {compareAt && (
          <span className="text-lg md:text-xl text-gray-500 line-through">
            ₹{compareAt.toLocaleString()}
          </span>
        )}
      </div>

      {discount > 0 && (
        <p className="text-sm text-green-600">
          You save ₹{(compareAt! - price).toLocaleString()} ({discount}% off)
        </p>
      )}
    </div>
  );
}
