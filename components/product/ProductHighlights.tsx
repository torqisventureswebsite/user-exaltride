import { Card } from "@/components/ui/card";

interface ProductHighlightsProps {
  sku?: string;
  weight?: number;
  dimensions?: string;
  is_oem?: boolean;
}

export default function ProductHighlights({
  sku,
  weight,
  dimensions,
  is_oem,
}: ProductHighlightsProps) {
  return (
    <Card className="p-4">
      <h3 className="mb-3 font-semibold text-gray-900">Product Highlights</h3>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-600">SKU</dt>
          <dd className="font-medium">{sku || "-"}</dd>
        </div>

        {weight && (
          <div className="flex justify-between">
            <dt className="text-gray-600">Weight</dt>
            <dd className="font-medium">{weight} kg</dd>
          </div>
        )}

        {dimensions && (
          <div className="flex justify-between">
            <dt className="text-gray-600">Dimensions</dt>
            <dd className="font-medium">{dimensions}</dd>
          </div>
        )}

        <div className="flex justify-between">
          <dt className="text-gray-600">Type</dt>
          <dd className="font-medium">{is_oem ? "OEM" : "Aftermarket"}</dd>
        </div>
      </dl>
    </Card>
  );
}
