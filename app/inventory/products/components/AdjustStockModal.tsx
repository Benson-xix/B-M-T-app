'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, TrendingUp, TrendingDown } from "lucide-react";
import { Product, ProductVariant } from '@/app/utils/type';

interface AdjustStockModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdjustStockModal({ product, open, onOpenChange }: AdjustStockModalProps) {
 const [selectedVariant, setSelectedVariant] = useState<string | number>(
  product.hasVariations && product.variants.length > 0
    ? product.variants[0].id
    : 'product'
);

  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');

const selectedVariantData: ProductVariant = product.hasVariations
  ? product.variants.find((v) => String(v.id) === String(selectedVariant)) ??
    product.variants[0] 
  : {
      id: 'product',
      name: product.name,
      sku: product.sku,
      attributes: {},
      costPrice: 150,
      sellingPrice: 299.99,
      quantity: product.totalStock,
      threshold: 10,
      images: [],
    };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity(prev => prev > 0 ? prev - 1 : 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adjusting stock:', {
      variant: selectedVariant,
      quantity,
      reason,
      newQuantity: selectedVariantData.quantity + quantity
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription className="text-gray-900">
            Update stock levels for this product or its variants
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className='flex flex-col gap-2'>
              <Label>Product</Label>
              <Input value={product.name} className='border border-gray-900' disabled />
            </div>
            
            {product.hasVariations && (
              <div>
                <Label htmlFor="variant">Select Variant</Label>
                <Select  
                value={String(selectedVariant)}
                onValueChange={(value) => setSelectedVariant(value)}>
                  <SelectTrigger className='border border-gray-900'>
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent className='bg-gray-900'>
                    {product.variants.map((variant: ProductVariant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.name} (Current: {variant.quantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          
          <Card className='bg-white border border-gray-100 shadow-lg text-gray-900'>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">SKU</Label>
                  <div className="font-medium">{selectedVariantData.sku}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Cost Price</Label>
                  <div className="font-medium">NGN {selectedVariantData.costPrice}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Current Quantity</Label>
                  <div className="font-medium">{selectedVariantData.quantity} units</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Selling Price</Label>
                  <div className="font-medium">NGN {selectedVariantData.sellingPrice}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          
          <div className="space-y-4">
            <Label htmlFor="quantity">New Quantity</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                onClick={handleDecrement}
                disabled={quantity <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                min="0"
                className='border border-gray-900 text-center'
              />
              
              <Button
                type="button"
                size="icon"
                onClick={handleIncrement}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {quantity > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">Increasing stock</span>
                  </>
                ) : quantity < 0 ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-red-600">Decreasing stock</span>
                  </>
                ) : (
                  <span className="text-gray-600">No change</span>
                )}
              </div>
              <div className="font-bold">
                {quantity > 0 ? '+' : ''}{quantity} units
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-800">
                New total will be: {selectedVariantData.quantity + quantity} units
              </div>
            </div>
          </div>

          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Adjustment</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for stock adjustment (required)"
              rows={3}
              required
              className='border border-gray-900'
            />
          </div>

          <DialogFooter>
            <Button  type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-400 hover:bg-green-500 text-black">
              Update Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}