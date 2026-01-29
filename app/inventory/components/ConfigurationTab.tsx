'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Tag, Folder } from "lucide-react";
import { Discount, DiscountStatus, DiscountType } from '@/app/utils/type';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';




export function ConfigureTab() {
const [activeSubTab, setActiveSubTab] = useState("attributes");

const [attrValues, setAttrValues] = useState<string[]>(["Red", "Blue", "Green"]);
const [discountType, setDiscountType] = useState<DiscountType>("percentage");
const [discountStatus, setDiscountStatus] = useState<DiscountStatus>("active");
const [selectedProduct, setSelectedProduct] = useState("");
const [selectedDiscount, setSelectedDiscount] = useState("");
const [unlinkDiscountId, setUnlinkDiscountId] = useState("");
const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
const [isEditOpen, setIsEditOpen] = useState(false);


const products = [
  { id: "1", name: "Nike Air Max" },
  { id: "2", name: "Adidas Ultraboost" },
];

const discounts: Discount[] = [
  {
    id: "1",
    name: "Black Friday",
    type: "percentage",
    value: 20,
    status: "active",
  },
  {
    id: "2",
    name: "New Year",
    type: "fixed",
    value: 500,
    status: "expired",
  },
];

const discountLinks = [
  { id: 1, product: "Nike Air Max", discount: "Black Friday", value: "20%" },
  { id: 2, product: "Adidas Ultraboost", discount: "Black Friday", value: "20%" },
];


const updateValue = (index: number, newValue: string) => {
  setAttrValues(prev => prev.map((v, i) => (i === index ? newValue : v)));
};

const removeValue = (index: number) => {
  setAttrValues(prev => prev.filter((_, i) => i !== index));
};

const addValue = (value: string) => {
  setAttrValues(prev => [...prev, value]);
};

  const attributes = [
    { id: 1, name: "Color", values: ["Red", "Blue", "Black", "White"], products: 42 },
    { id: 2, name: "Size", values: ["S", "M", "L", "XL"], products: 124 },
    { id: 3, name: "Material", values: ["Cotton", "Polyester", "Silk"], products: 38 },
  ];

  const categories = [
    { id: 1, name: "Jackets", products: 86, subcategories: ["Leather", "Denim", "Bomber"] },
    { id: 2, name: "Shirts", products: 154, subcategories: ["Formal", "Casual", "Polo"] },
    { id: 3, name: "Pants", products: 92, subcategories: ["Jeans", "Chinos", "Slacks"] },
    { id: 4, name: "Shoes", products: 68, subcategories: ["Formal", "Sneakers", "Boots"] },
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
       <TabsList className="grid w-full max-w-lg grid-cols-2 md:grid-cols-3 h-20 md:h-10  bg-gray-900">
          <TabsTrigger value="attributes" className="data-[state=active]:bg-black data-[state=active]:text-white">
            <Tag className="h-4 w-4 mr-2" />
            Attributes
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-black data-[state=active]:text-white">
            <Folder className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>

          <TabsTrigger value="discounts" className="data-[state=active]:bg-black data-[state=active]:text-white">
          <Tag className="h-4 w-4 mr-2" />
          Discounts
        </TabsTrigger>
        </TabsList>

       
        <TabsContent  value="attributes">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
            <Card className='bg-gray-900'>
              <CardHeader>
                <CardTitle>Create Attribute</CardTitle>
                <CardDescription>
                  Add new product attributes and values
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="attrName">Attribute Name</Label>
                  <Input id="attrName" placeholder="e.g., Color, Size, Material" />
                </div>
                
                <div className='flex flex-col gap-2'>
                  <Label>Values</Label>
                 <div className="space-y-2">
  {attrValues.map((value, index) => (
    <div key={index} className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => updateValue(index, e.target.value)}
        placeholder="Value"
      />
      <Button variant="ghost" size="icon" onClick={() => removeValue(index)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  ))}

  <Button
    variant="outline"
    size="sm"
    className="w-full"
    onClick={() => addValue("New Value")}
  >
    <Plus className="h-4 w-4 mr-2" />
    Add Value
  </Button>
</div>

                </div>
                
                <Button className="w-full bg-gray-900 hover:bg-gray-800 border-white border text-white">
                  Create Attribute
                </Button>
              </CardContent>
            </Card>

         
            <Card className="lg:col-span-2 bg-gray-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Attributes</CardTitle>
                    <CardDescription>
                      Manage product attributes and their values
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Attribute</TableHead>
                      <TableHead>Values</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attributes.map((attr) => (
                      <TableRow key={attr.id}>
                        <TableCell className="font-medium">{attr.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {attr.values.map((value, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {value}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{attr.products} products</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

       
        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
            <Card className='bg-gray-900'>
              <CardHeader>
                <CardTitle>Create Category</CardTitle>
                <CardDescription>
                  Add new product categories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="catName">Category Name</Label>
                  <Input id="catName" placeholder="e.g., Jackets, Shoes" />
                </div>
                
                <div>
                </div>
                
                <Button className="w-full bg-gray-900 border border-white hover:bg-gray-800 text-white">
                  Create Category
                </Button>
              </CardContent>
            </Card>

        
            <Card className="lg:col-span-2 bg-gray-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>
                      Manage product categories and hierarchy
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                      
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="discounts">
  <div className="space-y-6">

  
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    
      <Card className="bg-gray-900">
        <CardHeader>
          <CardTitle>Create Discount</CardTitle>
          <CardDescription>
            Define percentage or fixed discounts
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Discount Name</Label>
            <Input placeholder="e.g. Black Friday 20%" />
          </div>

        <div className="space-y-2">
  <Label>Discount Type</Label>
  <select
    className="w-full rounded-md bg-black border border-gray-700 px-3 py-2"
    value={discountType}
    onChange={(e) => setDiscountType(e.target.value as DiscountType)}
  >
    <option value="percentage">Percentage (%)</option>
    <option value="fixed">Fixed Amount</option>
  </select>
</div>

{discountType === "percentage" && (
  <div className="space-y-2">
    <Label>Percentage (%)</Label>
    <Input type="number" placeholder="20" />
  </div>
)}

{discountType === "fixed" && (
  <div className="space-y-2">
    <Label>Fixed Amount</Label>
    <Input type="number" placeholder="500" />
  </div>
)}


          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input placeholder="Optional description" />
          </div>

          <Button className="w-full border border-white bg-green-400 hover:bg-green-600">
            Create Discount
          </Button>
        </CardContent>
      </Card>

   
      <Card className="lg:col-span-2 bg-gray-900">
        <CardHeader>
          <CardTitle>All Discounts</CardTitle>
          <CardDescription>
            Manage existing discounts
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
  {discounts.map((discount) => (
    <TableRow key={discount.id}>
      <TableCell className="font-medium">
        {discount.name}
      </TableCell>

      <TableCell>
        <Badge>
          {discount.type === 'percentage' 
            ? `${discount.value}%` 
            : `₦${discount.value}`}
        </Badge>
      </TableCell>

      <TableCell>
        {discount.startDate && discount.endDate
          ? `${discount.startDate} – ${discount.endDate}`
          : 'N/A'}
      </TableCell>

      <TableCell>
        <Badge
          variant={discount.status === "active" ? "default" : "secondary"}
          className={discount.status === "expired" ? "opacity-60" : ""}
        >
          {discount.status}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditingDiscount(discount);
              setIsEditOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button 
            size="sm" 
            variant="ghost" 
            className="text-red-600 hover:text-red-700"
            onClick={() => {
              console.log('Delete discount:', discount.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>


   <Card className="bg-gray-900">
  <CardHeader>
    <CardTitle>Link Discount to Product</CardTitle>
    <CardDescription>
      Assign an existing discount to a product
    </CardDescription>
  </CardHeader>

  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="space-y-2">
      <Label>Product</Label>
      <select
        className="w-full rounded-md bg-black border border-gray-700 px-3 py-2"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        <option value="">Select product</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>

    <div className="space-y-2">
      <Label>Discount</Label>
      <select
        className="w-full rounded-md bg-black border border-gray-700 px-3 py-2"
        value={selectedDiscount}
        onChange={(e) => setSelectedDiscount(e.target.value)}
      >
        <option value="">Select discount</option>
        {discounts.map(d => (
          <option key={d.id} value={d.id}>
            {d.name} ({d.type === "percentage" ? `${d.value}%` : `₦${d.value}`})
          </option>
        ))}
      </select>
    </div>

    <div className="flex items-end">
      <Button className="w-full border border-white bg-green-400 hover:bg-green-600">
        Link
      </Button>
    </div>
  </CardContent>

  <Card className="bg-gray-900">
  <CardHeader>
    <CardTitle>Bulk Assign Discount</CardTitle>
    <CardDescription>
      Apply one discount to multiple products
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">
    <div className="space-y-2">
      <Label>Discount</Label>
      <select
        className="w-full rounded-md bg-black border border-gray-700 px-3 py-2"
        value={selectedDiscount}
        onChange={(e) => setSelectedDiscount(e.target.value)}
      >
        <option value="">Select discount</option>
        {discounts.map(d => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
    </div>

    <div className="space-y-2">
      <Label>Products</Label>

      <div className="max-h-40 overflow-y-auto border border-gray-700 rounded-md p-2 space-y-2">
        {products.map(product => (
          <label key={product.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedProducts.includes(product.id)}
              onChange={(e) => {
                setSelectedProducts(prev =>
                  e.target.checked
                    ? [...prev, product.id]
                    : prev.filter(id => id !== product.id)
                );
              }}
            />
            {product.name}
          </label>
        ))}
      </div>
    </div>

    <Button
      disabled={!selectedDiscount || selectedProducts.length === 0}
      className="w-full border border-white bg-green-400 hover:bg-green-600"
    >
      Assign to {selectedProducts.length} product(s)
    </Button>
  </CardContent>
</Card>

</Card>


 
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle>Discounted Products</CardTitle>
        <CardDescription>
          Products with active discounts
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
<TableBody>
  {discountLinks.map(link => (
    <TableRow key={link.id}>
      <TableCell>{link.product}</TableCell>
      <TableCell>{link.discount}</TableCell>
      <TableCell>
        <Badge variant="secondary">{link.value}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button
          size="sm"
          variant="ghost"
          className="text-red-600  hover:text-red-700"
        >
          Unlink
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
        </Table>
      </CardContent>
    </Card>

  </div>
</TabsContent>

      </Tabs>
      {editingDiscount && (
  <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
    <DialogContent className="bg-gray-900">
      <DialogHeader>
        <DialogTitle>Edit Discount</DialogTitle>
        <DialogDescription>
          Update discount details and status
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={editingDiscount.name} disabled />
        </div>

        <div className="space-y-2">
          <Label>Value</Label>
          <Input value={editingDiscount.value} disabled />
        </div>

      
        <div className="space-y-2">
          <Label>Status</Label>
          <select
            className="w-full rounded-md bg-black border border-gray-700 px-3 py-2"
            value={editingDiscount.status}
            onChange={(e) =>
              setEditingDiscount(prev =>
                prev
                  ? { ...prev, status: e.target.value as DiscountStatus }
                  : prev
              )
            }
          >
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setIsEditOpen(false)}
        >
          Cancel
        </Button>

        <Button className="bg-green-500 hover:bg-green-600">
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}

    </div>
  );
}