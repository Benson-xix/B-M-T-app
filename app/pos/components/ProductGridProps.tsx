'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

import Image from 'next/image';
import { Product, ProductVariant } from '@/app/utils/type';

interface ProductGridProps {
  variants: Array<ProductVariant & { product: Product }>;
  onAddToCart: (variant: ProductVariant, product: Product) => void;
}

export function ProductGrid({ variants, onAddToCart }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVariants = variants.slice(startIndex, startIndex + itemsPerPage);

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const getStockStatus = (
  quantity: number,
  threshold: number
): {
  label: string;
  color: BadgeVariant;
  bgColor: string;
} => {
  if (quantity === 0) {
    return {
      label: "Out of Stock",
      color: "destructive",
      bgColor: "bg-red-100",
    };
  }

  if (quantity <= threshold) {
    return {
      label: "Low Stock",
      color: "default",
      bgColor: "bg-yellow-100",
    };
  }

  return {
    label: `${quantity} in stock`,
    color: "default",
    bgColor: "bg-green-100",
  };
};


  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {variants.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No products found</div>
          <p className="text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {paginatedVariants.map((variantData) => {
             const { product, ...variant } = variantData;
              const status = getStockStatus(variant.quantity, variant.threshold);
              
              return (
                <Card 
                  key={variant.id} 
                  className={`overflow-hidden hover:shadow-lg transition-shadow bg-gray-white ${
                    variant.quantity === 0 ? 'opacity-75 grayscale' : ''
                  }`}
                >
         
                  <div className="relative aspect-square overflow-hidden p-2 bg-gray-100">
                    {variant.images && variant.images.length > 0 ? (
                      <Image
                        src={variant.images[0]}
                        width={70}
                        height={50}
                        alt={variant.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-gray-400">No Image</div>
                      </div>
                    )}
                    
                   
                    <div className="absolute top-2 left-2">
                     <Badge
                    variant={status.color}
                    className={`${status.bgColor} text-xs font-medium`}
                    >
                    {status.label}
                    </Badge>

                    </div>
                    
                 
                    {variant.quantity === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-sm">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                 
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <div className="text-sm text-gray-600 truncate">
                        {variant.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.brand}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-lg text-gray-900">
                        NGN {variant.sellingPrice.toFixed(2)}
                      </div>
                      
                      <Button
                        size="sm"
                        className={`flex items-center gap-1 ${
                          variant.quantity === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-400 hover:bg-green-500 text-black'
                        }`}
                        onClick={() => onAddToCart(variant, product)}
                        disabled={variant.quantity === 0}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                    
                    {/* SKU */}
                    <div className="text-xs text-gray-500 font-mono truncate">
                      SKU: {variant.sku}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, variants.length)} of {variants.length} variants
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}