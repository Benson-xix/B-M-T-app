'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  Filter, 
  Search, 
  User, 
  Calendar,
  MoreVertical,
  Printer,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Transaction } from '@/app/utils/type';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ReactDOMServer from 'react-dom/server';
import { Receipt } from "@/app/pos/components/Receipt";

interface TransactionsTabProps {
  transactions: Transaction[];
  paymentMethodFilter: string;
  onPaymentMethodFilterChange: (method: string) => void;
   highlightedTransactionId?: string;
}

const ITEMS_PER_PAGE = 10;


export function TransactionsTab({ 
  transactions, 
  paymentMethodFilter,
  onPaymentMethodFilterChange ,
  highlightedTransactionId,
}: TransactionsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
  
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = !searchQuery || 
      t.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPaymentMethod = paymentMethodFilter === 'all' || 
      t.paymentMethod === paymentMethodFilter;
    
    return matchesSearch && matchesPaymentMethod;
  });

    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  useEffect(() => {
    if (highlightedTransactionId) {
      const highlightedIndex = filteredTransactions.findIndex(t => t.id === highlightedTransactionId);
      if (highlightedIndex !== -1) {
        const pageNumber = Math.floor(highlightedIndex / ITEMS_PER_PAGE) + 1;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(pageNumber);
      }
    }
  }, [highlightedTransactionId, filteredTransactions]);

  const handleFilterChange = (filterValue: string) => {
    setCurrentPage(1);
    onPaymentMethodFilterChange(filterValue);
  };

  const handleClearFilters = () => {
    setCurrentPage(1);
    setSearchQuery('');
    onPaymentMethodFilterChange('all');
  };

  const handleSearch = (query: string) => {
    setCurrentPage(1);
    setSearchQuery(query);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getPaymentBadge = (method: string) => {
    const variants: Record<string, { label: string, color: string }> = {
      'cash': { label: 'Cash', color: 'bg-green-100 text-green-800' },
      'card': { label: 'Card', color: 'bg-blue-100 text-blue-800' },
      'transfer': { label: 'Transfer', color: 'bg-purple-100 text-purple-800' },
      'credit': { label: 'Credit', color: 'bg-yellow-100 text-green-800' },
      'installment': { label: 'Installment', color: 'bg-indigo-100 text-indigo-800' },
      'split': { label: 'Split', color: 'bg-pink-100 text-pink-800' },
    };
    
    const variant = variants[method] || { label: method, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <Badge className={`${variant.color} hover:${variant.color}`}>
        {variant.label}
      </Badge>
    );
  };

 const handlePrintReceipt = (transaction: Transaction) => {
  const receiptHtml = ReactDOMServer.renderToString(
    <Receipt
      customer={transaction.customer}
      cart={transaction.items}
      subtotal={transaction.subtotal || transaction.total - transaction.tax}
      tax={transaction.tax}
      total={transaction.total}
      paymentMethod={transaction.paymentMethod}
      amountPaid={transaction.amountPaid || transaction.total}
      change={(transaction.amountPaid || transaction.total) - transaction.total}
      purchaseType={transaction.purchaseType || 'in-store'}
      splitPayments={transaction.splitPayments?.map(sp => ({
        method: sp.method,
        amount: sp.amount.toString(),
      }))}
      installmentPlan={transaction.installmentPlan}
      transactionId={transaction.id}
      receiptDate={new Date(transaction.timestamp).toLocaleString()}
    />
  );

  const printWindow = window.open('', '_blank', 'width=500,height=800');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt - ${transaction.id}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media print {
            @page {
              size: auto;
              margin: 0mm;
            }
            body {
              margin: 0;
              padding: 10px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print { display: none !important; }
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: 'Courier New', monospace;
            background: white;
          }
          
          .print-controls {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
            background: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .print-controls button {
            background: #111827;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-family: sans-serif;
            font-size: 14px;
            margin-right: 10px;
          }
          
          .print-controls button:hover {
            background: #1f2937;
          }
          
          .print-controls button:last-child {
            background: #dc2626;
          }
          
          .print-controls button:last-child:hover {
            background: #b91c1c;
          }
        </style>
      </head>
      <body>
        <div class="print-controls no-print">
          <button onclick="window.print()">🖨️ Print Receipt</button>
          <button onclick="window.close()">❌ Close</button>
        </div>
        ${receiptHtml}
        
        <script>
          // Auto-print option (uncomment if you want auto-print)
          // setTimeout(() => { window.print(); }, 500);
          
          // Auto-close after printing
          window.onafterprint = function() {
            setTimeout(() => {
              window.close();
            }, 1000);
          };
          
          // Keyboard shortcuts
          document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'p') {
              e.preventDefault();
              window.print();
            }
            if (e.key === 'Escape') {
              window.close();
            }
          });
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
};

  const handleDeleteTransaction = (transactionId: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      console.log('Delete transaction:', transactionId);
    }
  };

  const paymentMethods = [
    { value: 'all', label: 'All Methods' },
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'credit', label: 'Credit' },
    { value: 'installment', label: 'Installment' },
    { value: 'split', label: 'Split' },
  ];

  const creditTransactions = filteredTransactions.filter(t => t.paymentMethod === 'credit');


  

  return (
    <Card className="bg-gray-900 text-white">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              {filteredTransactions.length} transactions found
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="search">Search Transactions</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by customer or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select value={paymentMethodFilter} onValueChange={onPaymentMethodFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(method => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSearchQuery('');
                onPaymentMethodFilterChange('all');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
        
        
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>No transactions found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table className="bg-gray-900">
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Sale Made By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Credit Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                 <TableRow 
                    key={transaction.id}
                    className={highlightedTransactionId === transaction.id ? 'bg-yellow-50 bg-opacity-10' : ''}
                  >
                    <TableCell className="font-mono text-sm">
                      {transaction.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDate(transaction.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        {transaction.customer.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPaymentBadge(transaction.paymentMethod)}
                    </TableCell>
                 <TableCell>
  {transaction.totalDiscount ? (  
    <span className="text-red-600">- NGN {transaction.totalDiscount.toFixed(2)}</span>
  ) : (
    <span className="text-gray-500">None</span>
  )}
</TableCell>
                    <TableCell className="font-bold">
                      NGN {transaction.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <p>Mgt</p>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={transaction.synced ? "default" : "destructive"}
                        className={transaction.synced ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                      >
                        {transaction.synced ? 'Synced' : 'Unsynced'}
                      </Badge>
                    </TableCell>
                     <TableCell>
                    {transaction.paymentMethod === 'credit' && (
                     
                        <div className="space-y-1">
                          <Badge className="bg-blue-600 text-white block">
                            Credit (Waived)
                          </Badge>
                          {transaction.credit?.creditType === 'partial' && (
                            <Badge className="bg-amber-600 text-white text-xs">
                              Partial: NGN {transaction.credit.amountPaidTowardCredit.toFixed(2)}
                            </Badge>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            Balance: NGN {transaction.credit?.creditBalance.toFixed(2)}
                          </div>
                        </div>
                     
                    )}
                     </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePrintReceipt(transaction)}>
                            <Printer className="h-4 w-4 mr-2" />
                            View Receipt
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          <div className="flex items-center justify-between p-4 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 'bg-green-400 hover:bg-green-500 text-black' : ''}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
    
        {filteredTransactions.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white text-gray-900 border border-gray-100 shadow-2xl">
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">Total Transactions</div>
                <div className="text-xl font-bold">{filteredTransactions.length}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white text-gray-900 border border-gray-100 shadow-2xl">
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">Total Amount</div>
                <div className="text-xl font-bold">
                  NGN {filteredTransactions.reduce((sum, t) => sum + t.total, 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white text-gray-900 border border-gray-100 shadow-2xl">
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">Average Ticket</div>
                <div className="text-xl font-bold">
                  NGN {(filteredTransactions.reduce((sum, t) => sum + t.total, 0) / filteredTransactions.length).toFixed(2)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white text-gray-900 border border-gray-100 shadow-2xl">
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">Total Discount</div>
                <div className="text-xl font-bold text-red-600">
                  NGN {filteredTransactions.reduce((sum, t) => sum + (t.totalDiscount || 0), 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}