'use client';

import { useState } from 'react';
import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, UserPlus, FileText, CreditCard, ShoppingCart } from "lucide-react";
import Image from 'next/image';
import { CartItem, Customer } from '@/app/utils/type';

interface CartSidebarProps {
  cart: CartItem[];
  selectedCustomer: Customer;
  subtotal: number;
  tax: number;
  total: number;
  onCustomerChange: (customer: Customer) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onSaveDraft: () => void;
  onLoadDraft: () => void;
  onCheckout: () => void;
  onCreateCustomer: () => void;
  purchaseType: 'in-store' | 'online';                   
  onPurchaseTypeChange: (type: 'in-store' | 'online') => void;
}

export function CartSidebar({
  cart,
  selectedCustomer,
  subtotal,
  tax,
  total,
  onCustomerChange,
  onUpdateQuantity,
  onRemoveItem,
  onSaveDraft,
  onLoadDraft,
  onCheckout,
  onCreateCustomer,
  purchaseType,
  onPurchaseTypeChange
}: CartSidebarProps) {
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('');

 
  const customers = [
    { id: 'walk-in', name: 'Walk-in Customer' },
    { id: 'cust-1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
    { id: 'cust-2', name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321' },
    { id: 'cust-3', name: 'Robert Johnson', email: 'robert@example.com', phone: '+1122334455' },
  ];

  const handleApplyDiscount = () => {
    if (!discountValue) return;
    
    const value = parseFloat(discountValue);
    if (isNaN(value)) return;
    
    if (discountType === 'percentage') {
      setDiscount((subtotal * value) / 100);
    } else {
      setDiscount(Math.min(value, subtotal));
    }
    
    setDiscountValue('');
  };

  const handleClearDiscount = () => {
    setDiscount(0);
    setDiscountValue('');
  };

  const finalTotal = Math.max(0, total - discount);

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Shopping Cart
          {cart.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {cart.length} items
            </Badge>
          )}
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
     
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="customer">Customer</Label>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 text-xs"
              onClick={onCreateCustomer}
            >
              <UserPlus className="h-3 w-3 mr-1" />
              New Customer
            </Button>
          </div>
          
          <Select
            value={selectedCustomer.id}
            onValueChange={(value) => {
              const customer = customers.find(c => c.id === value);
              if (customer) onCustomerChange(customer);
            }}
          >
            <SelectTrigger className='border border-gray-900'>
              <SelectValue placeholder="Select customer" className='border border-gray-900' />
            </SelectTrigger>
            <SelectContent>
              {customers.map(customer => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedCustomer.id !== 'walk-in' && (
            <div className="text-sm text-gray-600">
              <div>{selectedCustomer.email}</div>
              <div>{selectedCustomer.phone}</div>
            </div>
          )}
        </div>

      
        <div className="space-y-2">
          <Label>Purchase Type</Label>
         <div className="grid grid-cols-2 gap-2">
            <Button
  variant={purchaseType === 'in-store' ? 'default' : 'secondary'}
  className="justify-start"
  onClick={() => onPurchaseTypeChange('in-store')}   // ✅ use handler
>
  In-Store
</Button>
<Button
  variant={purchaseType === 'online' ? 'default' : 'secondary'}
  className="justify-start"
  onClick={() => onPurchaseTypeChange('online')}     // ✅ use handler
>
  Online
</Button>
            </div>
        </div>

      
        <div className="space-y-4">
          <Label>Items in Cart</Label>
          
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>Your cart is empty</p>
              <p className="text-sm mt-1">Add items from the product grid</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <Card key={item.id} className="overflow-hidden text-gray-900 bg-white border-gray-100 border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                    
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                          {item.image ? (
                            <Image
                              src={item.image}
                              width={100}
                                height={100}
                              alt={item.productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                      </div>
                      
                 
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 truncate">
                              {item.productName}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">
                              {item.variantName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              SKU: {item.sku}
                            </p>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => onRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-gray-800 bg-gray-900 text-white"
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 h-7 text-center border border-gray-100 shadow rounded-xl"
                            />
                            
                            <Button
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-gray-800 bg-gray-900 text-white"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold">
                              NGN {(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              NGN {item.price} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

      
        <div className="space-y-3">
          <Label>Discount</Label>
          <div className="flex gap-2">
            <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') =>
    setDiscountType(value)
  }>
              <SelectTrigger className="w-32 border border-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">%</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder={discountType === 'percentage' ? 'Percentage' : 'Amount'}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className='border border-gray-900'
            />
            
            <Button variant="secondary" onClick={handleApplyDiscount}>
              Apply
            </Button>
          </div>
          
          {discount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600">Discount applied</span>
              <div className="flex items-center gap-2">
                <span className="font-bold">- NGN {discount.toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={handleClearDiscount}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
    
      <div className="border-t border-gray-200 p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">NGN {subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (10%)</span>
            <span className="font-medium">NGN {tax.toFixed(2)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Discount</span>
              <span className="font-medium text-green-600">- NGN {discount.toFixed(2)}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>NGN {finalTotal.toFixed(2)}</span>
          </div>
        </div>
        
      
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={onSaveDraft}
            disabled={cart.length === 0}
          >
            <FileText className="h-4 w-4" />
            Save Draft
          </Button>
          
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={onLoadDraft}
          >
            <FileText className="h-4 w-4" />
            Load Draft
          </Button>
        </div>
        
        <Button
          className="w-full bg-green-400 hover:bg-green-500 text-black flex items-center gap-2"
          size="lg"
          onClick={onCheckout}
          disabled={cart.length === 0}
        >
          <CreditCard className="h-5 w-5" />
          Make Sale (NGN {finalTotal.toFixed(2)})
        </Button>
      </div>
    </div>
  );
}