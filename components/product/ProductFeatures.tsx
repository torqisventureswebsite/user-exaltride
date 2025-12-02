import { Card } from "@/components/ui/card";
import { TruckIcon, Shield, RotateCcw } from "lucide-react";

interface ProductFeaturesProps {
  warranty?: number;
}

export default function ProductFeatures({ warranty = 6 }: ProductFeaturesProps) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        
        {/* Free Delivery */}
        <div className="flex items-center gap-3 text-sm">
          <TruckIcon className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-semibold">Free Delivery</p>
            <p className="text-gray-600">On orders above ₹999</p>
          </div>
        </div>

        {/* Warranty */}
        <div className="flex items-center gap-3 text-sm">
          <Shield className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-semibold">{warranty} Months Warranty</p>
            <p className="text-gray-600">Authorized seller warranty</p>
          </div>
        </div>

        {/* Return Policy */}
        <div className="flex items-center gap-3 text-sm">
          <RotateCcw className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-semibold">7 Days Return</p>
            <p className="text-gray-600">Easy return & exchange</p>
          </div>
        </div>

      </div>
    </Card>
  );
}
