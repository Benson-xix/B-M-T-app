'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {  Clock} from "lucide-react";
import { CartItem, Customer, Draft, Product, ProductVariant } from '../utils/type';
import { LoadDraftModal } from './components/LoadDraftModal';
import { CreateCustomerModal } from './components/CreateCustomerModal';
import { CartSidebar } from './components/CartSidebarProps';
import { ProductGrid } from './components/ProductGridProps';
import { ProductFilters } from './components/ProductFiltersProps';
import { POSHeader } from './components/POSHeader';
import { NetworkStatus } from './components/NetworkStatus';
import { CheckoutModal } from './components/CheckoutModalProps';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';




export default function POSPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
    const [itemDiscountToggles, setItemDiscountToggles] = useState<Record<string, boolean>>({});
    const [purchaseType, setPurchaseType] = useState<'in-store' | 'online'>('in-store');


  const [sessionTime, setSessionTime] = useState<number>(0);
  const [showCreateCustomer, setShowCreateCustomer] = useState<boolean>(false);
  const [showLoadDraft, setShowLoadDraft] = useState<boolean>(false);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
 const [cart, setCart] = useState<CartItem[]>([]);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);



const [selectedCustomer, setSelectedCustomer] = useState<Customer>({
  id: "walk-in",
  name: "Walk-in Customer",
});

  useEffect(() => {
    const savedTaxRate = localStorage.getItem('pos_default_tax_rate');
    if (savedTaxRate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTaxRate(parseFloat(savedTaxRate));
    }
    setIsHydrated(true);
  }, []);

  const generateDraftId = () => crypto.randomUUID();
const getTimestamp = () => new Date().toISOString();

  const handleTaxRateChange = (newRate: number) => {
    setTaxRate(newRate);
    localStorage.setItem('pos_default_tax_rate', newRate.toString());
  };

const handleResetCart = () => {
    setCart([]);
    setItemDiscountToggles({});
    setSelectedCustomer({
      id: "walk-in",
      name: "Walk-in Customer",
    });
  };
 
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Premium Leather Jacket",
      sku: "PLJ-001",
      brand: "Gucci",
      category: "Jackets",
      description: "Premium leather jacket",
      taxable: true,
      unit: "Pieces",
      hasVariations: true,
      images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5"],
       discount: {
        id: 'dis1',
      name: "Winter Sale",
      type: "percentage",
      value: 10,
      status: 'expired'
    },
      variants: [
        {
          id: "1-1",
          name: "Red - XL",
          sku: "GUCCI-RED-XL-JACKET",
          attributes: { Color: "Red", Size: "XL" },
          costPrice: 150,
          sellingPrice: 299.99,
          quantity: 42,
          threshold: 10,
          images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5"],
          
        },
        {
          id: "1-2",
          name: "Black - L",
          sku: "GUCCI-BLACK-L-JACKET",
          attributes: { Color: "Black", Size: "L" },
          costPrice: 150,
          sellingPrice: 299.99,
          quantity: 8,
          threshold: 10,
          images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea"]
        },
      ],
      inventoryValue: 15499.58,
      inventoryCost: 7500,
      totalStock: 50,
      totalRevenue: 29999.00,
    },
    {
      id: "2",
      name: "Designer Denim Jeans",
      sku: "DDJ-002",
      brand: "Levi's",
      category: "Pants",
      description: "Designer denim jeans",
      taxable: true,
      unit: "Pieces",
      hasVariations: true,
      images: ["https://images.unsplash.com/photo-1542272604-787c3835535d"],
       discount: {
      id: 'dis2',
      name: "Winter Sale",
      type: "fixed",
      value: 30,
      status: 'active'
    },
      variants: [
        {
          id: "2-1",
          name: "Blue - 32",
          sku: "LEVIS-BLUE-32-JEANS",
          attributes: { Color: "Blue", Size: "32" },
          costPrice: 45,
          sellingPrice: 89.99,
          quantity: 0,
          threshold: 5,
          images: ["https://images.unsplash.com/photo-1542272604-787c3835535d"]
        },
        {
          id: "2-2",
          name: "Black - 34",
          sku: "LEVIS-BLACK-34-JEANS",
          attributes: { Color: "Black", Size: "34" },
          costPrice: 45,
          sellingPrice: 89.99,
          quantity: 25,
          threshold: 5,
          images: ["https://images.unsplash.com/photo-1542272604-787c3835535d"]
        },
      ],
      inventoryValue: 2249.75,
      inventoryCost: 1125,
      totalStock: 25,
      totalRevenue: 4499.50,
    },
    
  ];

 




  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddToCart = (variant: ProductVariant, product: Product) => {
    const existingItem = cart.find(item => item.variantId === variant.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.variantId === variant.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([
        ...cart,
        {
          id: `${product.id}-${variant.id}`,
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          variantName: variant.name,
          sku: variant.sku,
          price: variant.sellingPrice,
          quantity: 1,
          taxable: product.taxable,
          image: variant.images[0] || product.images[0],
          stock: variant.quantity,
          productDiscount: product.discount,
        }
      ]);
    }
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

const handleSaveDraft = () => {
  const draft: Draft = {
    id: crypto.randomUUID(),
    customer: selectedCustomer,
    items: cart,
    subtotal: calculateSubtotal(),
    tax: calculateTax(),
    total: calculateTotal(),
    timestamp: new Date().toISOString(),
  };

  const drafts: Draft[] = JSON.parse(
    localStorage.getItem("pos_drafts") || "[]"
  );

  drafts.push(draft);
  localStorage.setItem("pos_drafts", JSON.stringify(drafts));

  setCart([]);
};
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

    const calculateTax = () => {
    const taxableItems = cart.filter(item => item.taxable);
    return taxableItems.reduce((sum, item) => sum + (item.price * item.quantity * (taxRate / 100)), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  
  const allVariants = mockProducts.flatMap(product => 
    product.variants.map(variant => ({
      ...variant,
      product
    }))
  );

 
  const filteredVariants = allVariants.filter(variant => {
    const matchesBrand = selectedBrand === "all" || variant.product.brand === selectedBrand;
    const matchesCategory = selectedCategory === "all" || variant.product.category === selectedCategory;
    const matchesProduct = selectedProduct === "all" || variant.product.id === selectedProduct;
    const matchesSearch = searchQuery === "" || 
      variant.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      variant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      variant.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesBrand && matchesCategory && matchesProduct && matchesSearch;
  });

  const handleToggleDiscount = (itemId: string) => {
  setItemDiscountToggles(prev => ({
    ...prev,
    [itemId]: !prev[itemId],
  }));
};


const calculateDiscount = () => {
  return cart.reduce((sum, item) => {
    const discount = item.productDiscount;
    if (!discount || !itemDiscountToggles[item.id] || discount.status === 'expired') return sum;

    if (discount.type === 'percentage') {
      return sum + (item.price * item.quantity * discount.value) / 100;
    } else {
      return sum + Math.min(discount.value, item.price * item.quantity);
    }
  }, 0);
};


  const totalDiscount = calculateDiscount();
  const finalTotal = Math.max(0, calculateTotal() - totalDiscount);

   if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }


  return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
      
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
            <NetworkStatus />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                Session: {formatTime(sessionTime)}
              </div>
           <div className="flex items-center gap-2 ml-auto">
              <Label htmlFor="taxRate" className="text-sm">Set Sale Tax Rate:</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxRate}
                onChange={(e) => handleTaxRateChange(parseFloat(e.target.value) || 0)}
                className="w-16 h-8 text-center border border-gray-900"
              />
              <span className="text-sm">%</span>
            </div>
          </div>
            
            <Button 
              variant="secondary" 
              size="sm"
              asChild
            >
              <a href="/pos/transaction-history">
                View Daily History
              </a>
            </Button>
          </div>
        </div>

       
        <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        
          <div className="flex-1 overflow-hidden flex flex-col">
       
            <POSHeader />
            
          
            <ProductFilters
              products={mockProducts}
              selectedBrand={selectedBrand}
              selectedCategory={selectedCategory}
              selectedProduct={selectedProduct}
              searchQuery={searchQuery}
              onBrandChange={setSelectedBrand}
              onCategoryChange={setSelectedCategory}
              onProductChange={setSelectedProduct}
              onSearchChange={setSearchQuery}
            />
            
           
            <ProductGrid
              variants={filteredVariants}
              onAddToCart={handleAddToCart}
            />
          </div>
          
       
          <div className="lg:w-96 xl:w-108 border-l border-gray-200 bg-white overflow-y-auto">
            <CartSidebar
              cart={cart}
              selectedCustomer={selectedCustomer}
              onCustomerChange={setSelectedCustomer}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveFromCart}
              onSaveDraft={handleSaveDraft}
              onLoadDraft={() => setShowLoadDraft(true)}
              onCheckout={() => setShowCheckout(true)}
              subtotal={calculateSubtotal()}
              taxRate={taxRate}
              tax={calculateTax()}
           total={calculateTotal()} 
              onCreateCustomer={() => setShowCreateCustomer(true)}
               purchaseType={purchaseType}                 
                 onPurchaseTypeChange={setPurchaseType} 
                     itemDiscountToggles={itemDiscountToggles}
                      onDiscountToggle={handleToggleDiscount} 
            />
          </div>
        </div>

      
        <CreateCustomerModal
          open={showCreateCustomer}
          onOpenChange={setShowCreateCustomer}
          onCustomerCreated={(customer) => {
            setSelectedCustomer(customer);
            setShowCreateCustomer(false);
          }}
        />
        
        <LoadDraftModal
          open={showLoadDraft}
          onOpenChange={setShowLoadDraft}
          onLoadDraft={(draft) => {
            setCart(draft.items);
            setSelectedCustomer(draft.customer);
            setShowLoadDraft(false);
          }}
        />
        
        <CheckoutModal
          open={showCheckout}
          onOpenChange={setShowCheckout}
          cart={cart}
          customer={selectedCustomer}
          subtotal={calculateSubtotal()}
          tax={calculateTax()}
          taxRate={taxRate} 
          total={calculateTotal()}
        totalDiscount={totalDiscount} 
        itemDiscountToggles={itemDiscountToggles} 
           purchaseType={purchaseType}
          onComplete={() => {
           handleResetCart(); 
            setShowCheckout(false);
          }}
          
        />
      </div>
  );
}