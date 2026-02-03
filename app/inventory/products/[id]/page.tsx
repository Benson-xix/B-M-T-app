'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { InventoryLayout } from '../../components/InventoryLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductHeader } from '../components/ProductHeader';
import { ProductKPIs } from '../components/ProductKPIs';
import { ProductTabs } from '../components/ProductTabsProps ';
import { ProductDescriptionTab } from '../components/ProductDescriptionTab';
import { StockMovementTab } from '../components/StockMovementTab';
import { VariantsTab } from '../components/VariantsTab';
import { Product } from '@/app/utils/type';


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
  
    const fetchProduct = async () => {
      setLoading(true);
   
      const mockProduct = {
        id: productId,
        name: "Premium Leather Jacket",
        sku: "PLJ-001",
        brand: "Gucci",
        category: "Jackets",
        description: "High-quality leather jacket made from premium Italian leather. Perfect for formal and casual occasions.",
        taxable: true,
        unit: "Pieces",
        hasVariations: true,
        images: [
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&fit=crop",
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&fit=crop",
        ],
        variants: [
          {
            id: "var-1",
            name: "Red - XL",
            sku: "GUCCI-RED-XL-JACKET",
            attributes: { Color: "Red", Size: "XL" },
            costPrice: 150,
            sellingPrice: 299.99,
            quantity: 42,
            threshold: 10,
            barcode: "1234567890123",
            images: [
              "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&fit=crop",
            ],
          },
          {
            id: "var-2",
            name: "Black - L",
            sku: "GUCCI-BLACK-L-JACKET",
            attributes: { Color: "Black", Size: "L" },
            costPrice: 150,
            sellingPrice: 299.99,
            quantity: 8,
            threshold: 10,
            barcode: "1234567890124",
            images: [
              "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&fit=crop",
            ],
          },
        ],
        inventoryValue: 15499.58,
        inventoryCost: 7500,
        totalStock: 50,
        totalRevenue: 29999.00,
      };
      
      setTimeout(() => {
        setProduct(mockProduct);
        setLoading(false);
      }, 500);
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <InventoryLayout>
        <div className="space-y-6 p-4 md:p-6 lg:p-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </InventoryLayout>
    );
  }

  if (!product) {
  return null;
}


  return (
    <InventoryLayout>
      <div className="space-y-6 p-1 md:p-3 lg:p-1">
     
        <ProductHeader product={product} />
        
      
        <ProductKPIs product={product} />
        
     
        <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
       
        <div className="mt-6">
          {activeTab === 'description' && (
            <ProductDescriptionTab product={product} />
          )}
          {activeTab === 'movement' && (
            <StockMovementTab productId={productId} />
          )}
          {activeTab === 'variants' && (
            <VariantsTab variants={product.variants} productId={productId} />
          )}
        </div>
      </div>
    </InventoryLayout>
  );
}