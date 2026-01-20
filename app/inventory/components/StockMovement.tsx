'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown,  } from "lucide-react";
import { useState } from "react";

type MovementType = "Sale" | "Restock" | "Adjustment" | "Return";

interface StockMovement {
  id: number;
  date: string;
  product: string;
  sku: string;
  type: MovementType;
  quantity: number;
  before: number;
  after: number;
  reference: string;
}


export function StockMovementTable() {
  const movements: StockMovement[] = [
    { 
      id: 1, 
      date: "2024-01-20 10:30 AM", 
      product: "Premium Leather Jacket", 
      sku: "PLJ-001", 
      type: "Sale", 
      quantity: -2, 
      before: 120, 
      after: 118,
      reference: "Samuel L. Jackson"
    },
    { 
      id: 2, 
      date: "2024-01-20 09:45 AM", 
      product: "Designer Denim Jeans", 
      sku: "DDJ-002", 
      type: "Restock", 
      quantity: +50, 
      before: 30, 
      after: 80,
      reference: "Christopher Nolan"
    },
    { 
      id: 3, 
      date: "2024-01-19 03:20 PM", 
      product: "Silk Business Shirts", 
      sku: "SBS-003", 
      type: "Adjustment", 
      quantity: -5, 
      before: 45, 
      after: 40,
      reference: "Freddy Mercury"
    },
    { 
      id: 4, 
      date: "2024-01-19 11:15 AM", 
      product: "Formal Dress Shoes", 
      sku: "FDS-004", 
      type: "Sale", 
      quantity: -1, 
      before: 25, 
      after: 24,
      reference: "Don Toliver"
    },
    
  ];

  const [activeType, setActiveType] = useState<MovementType | "All">("All");
  const movementTabs: (MovementType | "All")[] = [
  "All",
  "Sale",
  "Restock",
  "Adjustment",
];

const filteredMovements = movements.filter(movement =>
  activeType === "All" ? true : movement.type === activeType
);

  return (
    <div className="space-y-4  bg-gray-900 ">
        <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-3">
  {movementTabs.map(tab => (
    <Button
      key={tab}
      size="sm"
      className={
        activeType === tab
          ? "bg-white text-gray-900 hover:bg-gray-200 "
          : "border-gray-700 text-gray-900 hover:bg-gray-800 hover:text-white"
      }
      onClick={() => setActiveType(tab)}
    >
      {tab}
    </Button>
  ))}
</div>
      <div className="rounded-md border ">
        <Table >
          <TableHeader>
            <TableRow>
              <TableHead className="bg-gray-900">Date & Time</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Performed By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody >
           {filteredMovements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell className="font-medium">{movement.date}</TableCell>
                <TableCell>{movement.product}</TableCell>
                <TableCell className="font-mono text-sm">{movement.sku}</TableCell>
                <TableCell>
                  <Badge variant={
                    movement.type === 'Sale' ? 'destructive' :
                    movement.type === 'Restock' ? 'default' :
                    movement.type === 'Return' ? 'secondary' : 'secondary'
                  }>
                    {movement.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className={`flex items-center gap-1 ${
                    movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {movement.quantity > 0 ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    <span className="font-medium">
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                    </span>
                  </div>
                </TableCell>
             
                <TableCell className="font-mono text-sm">{movement.reference}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>Showing 5 of 1,248 movements</div>
        <div className="flex gap-2">
          <Button size="sm">Previous</Button>
          <Button  size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}