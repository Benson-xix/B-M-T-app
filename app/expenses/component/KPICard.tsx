import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

export function KPICard({ 
  title, 
  value, 
  icon, 
  trend 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}) {
  return (
    <Card className="border border-gray-200 shadow-2xl bg-gray-100 text-gray-900">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                <span>{trend === 'up' ? '+12.5%' : '-5.2%'} from last period</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="text-green-500">{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
