
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, Download, ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { InventoryLayout } from '@/app/inventory/components/InventoryLayout';
import { toast } from 'sonner';

type Expense = {
  id: string;
  name: string;
  categoryId: string;
  amount: number;
  note?: string;
  receiptUrl?: string;
  status: 'approved' | 'pending' | 'rejected';
  approvedBy?: string;
  createdBy: string;
  expenseDate: string;
  createdAt: string;
  month: string;
};

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const mockExpense: Expense = {
      id: params.id as string,
      name: 'Office Supplies Purchase',
      categoryId: 'cat-1',
      amount: 45000,
      note: 'Monthly office supplies restock including printer paper, pens, and stationery',
      receiptUrl: '/receipt-sample.jpg',
      status: 'approved',
      approvedBy: 'Admin User',
      createdBy: 'Manager User',
      expenseDate: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-15T11:45:00Z',
      month: 'Jan 2024',
    };
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpense(mockExpense);
    setLoading(false);
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
  
    toast('PDF download would be implemented here');
  };

  const getStatusBadge = (status: Expense['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-green-800"><AlertCircle className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
    }
  };

  if (loading) {
    return (
      <InventoryLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </InventoryLayout>
    );
  }

  if (!expense) {
    return (
      <InventoryLayout>
        <div className="p-6">
          <div className="text-center">Expense not found</div>
        </div>
      </InventoryLayout>
    );
  }

  return (
    <InventoryLayout>
      <div className="p-4 md:p-6 bg-white text-gray-900">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Expense Invoice</h1>
              <p className="text-sm text-gray-500">Invoice #{expense.id}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handlePrint} className="bg-gray-900 hover:bg-gray-800 text-white">
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>

   
        <div className="max-w-4xl mx-auto">
          <Card className="border border-gray-200 print:shadow-none">
            <CardContent className="p-6 md:p-8">
            
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Invoice #:</span> {expense.id}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Date:</span> {format(new Date(expense.createdAt), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-3xl font-bold text-green-500">NGN {expense.amount.toLocaleString()}</div>
                  <div className="mt-2">{getStatusBadge(expense.status)}</div>
                </div>
              </div>

           
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-lg mb-3">From</h3>
                  <div className="space-y-1">
                    <p className="font-medium">Your Company Name</p>
                    <p className="text-sm text-gray-300">123 Business Street</p>
                    <p className="text-sm text-gray-300">Lagos, Nigeria</p>
                    <p className="text-sm text-gray-300">contact@company.com</p>
                    <p className="text-sm text-gray-300">+234 123 456 7890</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-3">Expense Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expense Name:</span>
                      <span className="font-medium">{expense.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span>Office Supplies</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expense Date:</span>
                      <span>{format(new Date(expense.expenseDate), 'MMMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created By:</span>
                      <span>{expense.createdBy}</span>
                    </div>
                    {expense.approvedBy && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Approved By:</span>
                        <span>{expense.approvedBy}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

       
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-4">Amount Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-medium">Description</th>
                        <th className="text-right py-3 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3">
                          <div>
                            <p className="font-medium">{expense.name}</p>
                            {expense.note && (
                              <p className="text-sm text-gray-300 mt-1">{expense.note}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-right font-medium">
                          NGN {expense.amount.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="border-t">
                        <td className="py-3 font-bold">Total</td>
                        <td className="py-3 text-right font-bold text-lg">
                          NGN {expense.amount.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

      
              {expense.receiptUrl && (
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-4">Receipt</h3>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-300 mb-2">Attached Receipt:</p>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-400">Receipt Preview</span>
                      </div>
                      <Button variant="outline" onClick={() => window.open(expense.receiptUrl, '_blank')}>
                        View Full Receipt
                      </Button>
                    </div>
                  </div>
                </div>
              )}

           
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-3">Additional Notes</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  {expense.note ? (
                    <p className="text-gray-300">{expense.note}</p>
                  ) : (
                    <p className="text-gray-400 italic">No additional notes provided</p>
                  )}
                </div>
              </div>

       
              <div className="border-t pt-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <p className="text-sm text-gray-400">Thank you for your business</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-green-400 rounded-lg flex items-center justify-center">
                        <span className="text-black font-bold text-sm">BMT</span>
                    </div>
                    <div>
                        <div className="font-bold text-white text-lg">Big Men</div>
                        <div className="text-xs text-gray-400 -mt-1">Transaction Apparel</div>
                    </div>
                    </div>
                    <p className="text-xs text-gray-600">Expense Management System</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

     
          <div className="hidden print:block mt-8">
            <p className="text-sm text-gray-600 text-center">
              This is a computer-generated invoice. No signature required.
            </p>
          </div>
        </div>
      </div>

  
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          .print\:shadow-none,
          .print\:shadow-none * {
            visibility: visible;
          }
          
          .print\:shadow-none {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
            box-shadow: none !important;
            border: 1px solid #000 !important;
          }
          
          button {
            display: none !important;
          }
        }
      `}</style>
    </InventoryLayout>
  );
}