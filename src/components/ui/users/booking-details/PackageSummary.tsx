import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Package as PackageType } from "@/types/booking";

interface PackageSummaryProps {
  packages: PackageType[];
}

export default function PackageSummary({ packages }: PackageSummaryProps) {
  const totalWeight = packages.reduce((sum, pkg) => sum + pkg.weight, 0);
  const totalQuantity = packages.reduce((sum, pkg) => sum + pkg.quantity, 0);

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Résumé des colis
          </h2>
          <div className="text-sm text-gray-600">
            {packages.length} colis • {totalQuantity} articles • {totalWeight} kg
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {packages.length}
            </div>
            <div className="text-sm text-gray-600">Colis</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalQuantity}
            </div>
            <div className="text-sm text-gray-600">Articles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {totalWeight} kg
            </div>
            <div className="text-sm text-gray-600">Poids total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
