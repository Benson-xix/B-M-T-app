import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const topProducts = [
  { id: 1, name: "Executive Blazer", sold: 142, revenue: "NGN 28,400", growth: "+24%", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop", category: "Blazers" },
  { id: 2, name: "Luxury Wool Trousers", sold: 118, revenue: "NGN 17,700", growth: "+18%", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop", category: "Pants" },
  { id: 3, name: "Premium Dress Shirt", sold: 96, revenue: "NGN 14,400", growth: "+32%", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop", category: "Shirts" },
  { id: 4, name: "Designer Leather Belt", sold: 85, revenue: "NGN 8,500", growth: "+15%", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop", category: "Accessories" },
  { id: 5, name: "Silk Pocket Square", sold: 73, revenue: "NGN 3,650", growth: "+28%", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop", category: "Accessories" },
];

export function TopProductsWidget() {
  return (
    <Card className="bg-white backdrop-blur-sm shadow-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-black">Fast Moving Products</CardTitle>
            <CardDescription className="text-gray-950">
              Top 5 products that are fast moving
            </CardDescription>
          </div>
          <TrendingUp className="h-5 w-5 text-gray-900" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div
              key={product.id}
              className="group flex flex-col md:flex-row gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 items-center"
            >
              
              <div
                className={cn(
                  "shrink-0 h-8 w-8 flex items-center justify-center rounded-md font-bold text-sm",
                  index === 0 ? "bg-yellow-100 text-yellow-800 border border-yellow-200" :
                  index === 1 ? "bg-gray-100 text-gray-800 border border-gray-200" :
                  index === 2 ? "bg-amber-100 text-amber-800 border border-amber-200" :
                  "bg-gray-50 text-gray-600 border border-gray-100"
                )}
              >
                {index + 1}
              </div>

             
              <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200 group-hover:shadow-sm">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>

           
              <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate group-hover:text-gray-700">
                    {product.name}
                  </h4>
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-2 text-sm text-gray-600 mt-1">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{product.category}</span>
                    <span>{product.sold} sold</span>
                  </div>
                </div>

                <div className="text-right mt-2 md:mt-0">
                  <div className="font-bold text-gray-900 text-lg">{product.revenue}</div>
                  <div className="text-sm text-green-600 flex items-center justify-end gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {product.growth}
                  </div>
                </div>
              </div>

            
              <div className="w-full md:w-32 mt-2 md:mt-0 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(index + 1) / topProducts.length * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  Top {Math.round(((topProducts.length - index) / topProducts.length) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        
        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-600">
            <span className="text-yellow-600 font-medium">Note:</span> 
            <span className="ml-1">Data based on selected date range</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-500">Growth trend</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
