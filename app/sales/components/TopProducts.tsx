'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { Transaction } from '@/app/utils/type';
import Image from 'next/image';

interface TopProductsProps {
  transactions: Transaction[];
}

export function TopProducts({ transactions }: TopProductsProps) {
  // Calculate top selling products
  const getTopProducts = () => {
    const productSales = new Map();
    
    transactions.forEach(transaction => {
      transaction.items.forEach(item => {
        const key = `${item.productName}-${item.variantName}`;
        const existing = productSales.get(key) || {
          productName: item.productName,
          variantName: item.variantName,
          image: item.image,
          price: item.price,
          totalQuantity: 0,
          totalRevenue: 0,
          transactions: 0,
        };
        
        existing.totalQuantity += item.quantity;
        existing.totalRevenue += item.price * item.quantity;
        existing.transactions += 1;
        
        productSales.set(key, existing);
      });
    });
    
    // Sort by total revenue and take top 5
    return Array.from(productSales.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);
  };

  const topProducts = getTopProducts();

  return (
    <div className="space-y-4">
      {topProducts.length > 0 ? (
        topProducts.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              {/* Rank Badge */}
              <div className={`
                flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-md font-bold text-sm
                ${index === 0 ? 'bg-yellow-100 text-green-800 border border-green-200' : 
                  index === 1 ? 'bg-gray-100 text-gray-800 border border-gray-200' : 
                  index === 2 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                  'bg-gray-50 text-gray-600 border border-gray-100'
                }
              `}>
                {index + 1}
              </div>
              
              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.productName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized={true}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-gray-400 text-xs">No Image</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Product Info */}
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {product.productName}
                </h4>
                <p className="text-sm text-gray-600 truncate">
                  {product.variantName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {product.totalQuantity} sold
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {product.transactions} orders
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Revenue */}
            <div className="text-right">
              <div className="font-bold text-gray-900">
                NGN {product.totalRevenue.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500 flex items-center justify-end gap-1">
                <TrendingUp className="h-3 w-3" />
                NGN {product.price.toFixed(2)} each
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">No sales data available</div>
          <p className="text-sm">Sales will appear here as transactions are made</p>
        </div>
      )}
      
      {/* Summary */}
      {topProducts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-500">Total Products Sold</div>
              <div className="font-bold">
                {topProducts.reduce((sum, p) => sum + p.totalQuantity, 0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">Total Revenue</div>
              <div className="font-bold text-green-600">
                NGN {topProducts.reduce((sum, p) => sum + p.totalRevenue, 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}