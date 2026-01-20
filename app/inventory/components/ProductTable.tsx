'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

type ProductStatus = "in-stock" | "low-stock" | "out-of-stock";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  brand: string;
  stock: number;
  status: ProductStatus;
  price: string;
  value: string;
  lastUpdated: string;
}


export function ProductTable({ searchQuery }: { searchQuery: string }) {
  const products : Product[]  = [
    {
      id: 1,
      name: "Premium Leather Jacket",
      sku: "PLJ-001",
      category: "Jackets",
      brand: "Gucci",
      stock: 118,
      status: "in-stock",
      price: "NGN 299.99",
      value: "NGN 35,398.82",
      lastUpdated: "2 hours ago"
    },
    {
      id: 2,
      name: "Designer Denim Jeans",
      sku: "DDJ-002",
      category: "Pants",
      brand: "Levi's",
      stock: 80,
      status: "in-stock",
      price: "NGN 89.99",
      value: "NGN 7,199.20",
      lastUpdated: "Yesterday"
    },
    {
      id: 3,
      name: "Silk Business Shirts",
      sku: "SBS-003",
      category: "Shirts",
      brand: "Hugo Boss",
      stock: 40,
      status: "low-stock",
      price: "NGN 149.99",
      value: "NGN 5,999.60",
      lastUpdated: "2 days ago"
    },
    {
      id: 4,
      name: "Formal Dress Shoes",
      sku: "FDS-004",
      category: "Shoes",
      brand: "Allen Edmonds",
      stock: 24,
      status: "in-stock",
      price: "NGN 199.99",
      value: "NGN 4,799.76",
      lastUpdated: "3 days ago"
    },
    {
      id: 5,
      name: "Wool Blend Suits",
      sku: "WBS-005",
      category: "Suits",
      brand: "Tom Ford",
      stock: 16,
      status: "out-of-stock",
      price: "NGN 999.99",
      value: "NGN 15,999.84",
      lastUpdated: "1 week ago"
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'in-stock': { label: 'In Stock', color: 'bg-green-100 text-green-800' },
      'low-stock': { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' },
      'out-of-stock': { label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    };
    const variant = variants[status as keyof typeof variants];
    return (
      <Badge className={`${variant.color} hover:${variant.color}`}>
        {variant.label}
      </Badge>
    );
  };

  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories: string[] = [
  "All",
  ...Array.from(new Set(products.map(p => p.category))),
];

const filteredProducts = products.filter(product => {
  const matchesCategory =
    activeCategory === "All" || product.category === activeCategory;

  const matchesSearch =
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase());

  return matchesCategory && matchesSearch;
});


  return (
    <div className="space-y-4 text-gray-900">
        <div className="flex flex-wrap gap-2 border-b pb-3">
  {categories.map(category => (
    <Button
      key={category}
      size="sm"
      className={
        activeCategory === category
          ? "bg-gray-900 text-white hover:bg-gray-800"
          : "text-gray-900 border-gray-800"
      }
      onClick={() => setActiveCategory(category)}
    >
      {category}
    </Button>
  ))}
</div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="text-gray-900">
              <TableHead className="text-gray-900">Product</TableHead>
              <TableHead className="text-gray-900">SKU</TableHead>
              <TableHead className="text-gray-900">Category</TableHead>
              <TableHead className="text-gray-900">Brand</TableHead>
              <TableHead className="text-gray-900">Stock</TableHead>
              <TableHead className="text-gray-900">Status</TableHead>
              <TableHead className="text-gray-900">Price</TableHead>
              <TableHead className="text-gray-900">Value</TableHead>
              <TableHead className="text-gray-900">Last Updated</TableHead>
              <TableHead  className="text-right text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) =>(
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{product.name}</div>
                    <div className="text-sm text-gray-500">ID: {product.id}</div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                <TableCell>
                  <Badge className="bg-gray-900 text-white hover:bg-gray-700">{product.category}</Badge>
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell className="font-medium">{product.stock}</TableCell>
                <TableCell>{getStatusBadge(product.status)}</TableCell>
                <TableCell className="font-medium">{product.price}</TableCell>
                <TableCell className="font-medium">{product.value}</TableCell>
                <TableCell className="text-gray-900">{product.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Product</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>Showing 5 of 1,248 products</div>
        <div className="flex gap-2">
          <Button className="bg-gray-900 text-white hover:bg-gray-700" size="sm">Previous</Button>
          <Button className="bg-gray-900 text-white hover:bg-gray-700" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}