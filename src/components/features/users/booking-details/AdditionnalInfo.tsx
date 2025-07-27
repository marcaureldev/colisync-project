
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AdditionalInfoProps {
  additionalInfo: string;
}

export default function AdditionalInfo({ additionalInfo }: AdditionalInfoProps) {
  if (!additionalInfo) return null;

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold text-orange-800 mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Informations additionnelles
        </h2>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-orange-700">{additionalInfo}</p>
        </div>
      </CardContent>
    </Card>
  );
}