'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, ProductVariant } from "@/app/utils/type";
import { toast } from 'sonner';
import { downloadBarcode, printBarcodes } from "./generateBarcodeImage";

interface BarcodeManagerProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 10;

export function BarcodeManager({ products }: BarcodeManagerProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const allVariants = products.flatMap(product =>
    product.variants.map(variant => ({
      ...variant,
      productName: product.name,
    }))
  );

 
  const totalPages = Math.ceil(allVariants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedVariants = allVariants.slice(startIndex, endIndex);

  const handleDownloadBarcode = (variant: ProductVariant & { productName: string }) => {
    downloadBarcode(variant.barcode, variant.productName);
    toast.success(`Downloaded barcode for ${variant.productName}`);
  };

  const handlePrintAllBarcodes = () => {
    const variantsForPrint = allVariants.map(v => ({
      name: `${v.productName} - ${v.name}`,
      barcode: v.barcode,
    }));
    printBarcodes(variantsForPrint);
    toast.success('Opened print preview');
  };

  const handleCopyBarcode = (barcode: string) => {
    navigator.clipboard.writeText(barcode);
    toast.success('Barcode copied to clipboard');
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <Card className="bg-white border border-gray-200 text-gray-900">
      <CardHeader className="border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between">
          <CardTitle>Barcode Management</CardTitle>
          <Button
            onClick={handlePrintAllBarcodes}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print All Barcodes
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {allVariants.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No variants available</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Product</th>
                    <th className="text-left py-3 px-4 font-semibold">Variant</th>
                    <th className="text-left py-3 px-4 font-semibold">Barcode</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVariants.map((variant) => (
                    <tr key={variant.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{variant.productName}</td>
                      <td className="py-3 px-4">{variant.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="font-mono text-gray-900 text-xs">
                          {variant.barcode}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleCopyBarcode(variant.barcode)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleDownloadBarcode(variant)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, allVariants.length)} of {allVariants.length} variants
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-blue-600 text-white" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}