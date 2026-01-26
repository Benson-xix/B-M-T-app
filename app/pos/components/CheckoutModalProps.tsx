'use client';

import { useState, useEffect } from 'react';
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Split, 
  Printer, 
  Download, 
  Share2, 
  X, 
  Calendar,
  Wallet
} from "lucide-react";
import { CartItem, Customer, InstallmentPayment, InstallmentPlan } from '@/app/utils/type';
import { Receipt } from './Receipt';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ReactDOMServer from 'react-dom/server';

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  customer: Customer;
  subtotal: number;
  tax: number;
  total: number;
  onComplete: () => void;
  purchaseType: 'in-store' | 'online';
}

export function CheckoutModal({
  open,
  onOpenChange,
  cart,
  customer,
  subtotal,
  tax,
  total,
  onComplete,
  purchaseType,
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [amountPaid, setAmountPaid] = useState<string>(total.toFixed(2));
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [showSplitPayment, setShowSplitPayment] = useState<boolean>(false);
  const [showInstallmentModal, setShowInstallmentModal] = useState<boolean>(false);
  const [splitPayments, setSplitPayments] = useState([
    { method: 'cash', amount: '' },
    { method: 'card', amount: '' },
  ]);
  
  const getSplitTotalPaid = () =>
  splitPayments.reduce(
    (sum, p) => sum + (parseFloat(p.amount) || 0),
    0
  );


  const [useInstallments, setUseInstallments] = useState<boolean>(false);
  const [installmentPlan, setInstallmentPlan] = useState<{
    numberOfPayments: number;
    amountPerPayment: number;
    paymentFrequency: 'daily' | 'weekly' | 'monthly';
    startDate: string;
    notes: string;
    downPayment: number;
    remainingBalance: number;
    payments: InstallmentPayment[],
  }>({
    numberOfPayments: 3,
    amountPerPayment: Math.ceil(total / 3),
    paymentFrequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
    downPayment: Math.ceil(total * 0.3), 
    remainingBalance: Math.ceil(total * 0.7), 
    payments: [],
  });

  
  const isCustomerEligibleForInstallments = customer.id !== 'walk-in';

  const isCustomerVerified = customer.id !== 'walk-in';


  const handleAmountPaidChange = (value: string) => {
    setAmountPaid(value);
  };

 const calculateChange = () => {
  if (paymentMethod === 'split') {
    const paid = getSplitTotalPaid();
    return paid > total ? paid - total : 0;
  }

  const paid = parseFloat(amountPaid) || 0;
  return paid > total ? paid - total : 0;
};


 

const getActualDownPayment = () =>
  Math.min(
    Math.max(parseFloat(amountPaid) || 0, installmentPlan.downPayment),
    total
  );

const getRemainingBalance = () =>
  Math.max(total - getActualDownPayment(), 0);


const calculateInstallments = () => {
  if (!useInstallments) return;

  const remaining = getRemainingBalance();
  
  if (installmentPlan.numberOfPayments < 2) return;
  
  const numberOfInstallments =
  installmentPlan.numberOfPayments - 1;
  const perPayment = Number((remaining / numberOfInstallments).toFixed(2));

  setInstallmentPlan((prev) => ({
    ...prev,
    remainingBalance: remaining,
    amountPerPayment: perPayment,
  }));
};



  useEffect(() => {
    calculateInstallments();
  }, [useInstallments, installmentPlan.numberOfPayments, installmentPlan.downPayment, amountPaid, total]);

const handleCompleteSale = () => {
  
  // eslint-disable-next-line react-hooks/purity
  const transactionId = `txn_${Date.now()}`;
  const timestamp = new Date().toISOString();

  // ---- CREDIT GUARD ----
  if (paymentMethod === 'credit' && !isCustomerVerified) {
    toast.error('Credit sales are only available for verified customers');
    return;
  }

  // ---- INSTALLMENT GUARD ----
  if (useInstallments) {
    const downPayment = parseFloat(amountPaid) || 0;
    if (downPayment < installmentPlan.downPayment) {
      toast.error(
        `Down payment must be at least NGN ${installmentPlan.downPayment}`
      );
      return;
    }
  }

  // ---- BUILD PAYMENT SCHEDULE (ONLY IF INSTALLMENTS) ----
  let paymentSchedule: InstallmentPayment[] = [];

  if (useInstallments) {
    const numberOfInstallments =
      installmentPlan.numberOfPayments - 1;

    const remaining = installmentPlan.remainingBalance;

    const baseInstallment = Number(
      (remaining / numberOfInstallments).toFixed(2)
    );

    paymentSchedule = [
  {
    paymentNumber: 1,
    amount: getActualDownPayment(),
    date: timestamp,
    dueDate: installmentPlan.startDate,
    status: 'paid',
  type: 'down_payment',
  },
  ...Array.from({ length: numberOfInstallments }, (_, i) => {
    const isLast = i === numberOfInstallments - 1;

    const amount = isLast
      ? Number(
          (
            remaining -
            baseInstallment * (numberOfInstallments - 1)
          ).toFixed(2)
        )
      : baseInstallment;

    return {
      paymentNumber: i + 2,
      amount,
      dueDate: calculateDueDate(
        installmentPlan.startDate,
        installmentPlan.paymentFrequency,
        i + 1
      ),
      status: 'pending',
      type: 'installment',
    } satisfies InstallmentPayment;
  }),
];

  }

  // ---- TRANSACTION OBJECT ----
  const transaction = {
    id: transactionId,
    customer,
    items: cart,
    subtotal,
    tax,
    total,

    paymentMethod: useInstallments
      ? 'installment'
      : paymentMethod,

    amountPaid:
      paymentMethod === 'credit'
        ? 0
        : useInstallments
        ? getActualDownPayment()
        : parseFloat(amountPaid) || 0,

    downPayment: useInstallments ? getActualDownPayment() : 0,

    change: paymentMethod === 'credit' ? 0 : calculateChange(),

    timestamp,
    synced: false,
    purchaseType,

    paymentStatus: useInstallments ? 'installment' : 'completed',

    ...(useInstallments && {
      installmentPlan: {
        ...installmentPlan,
        downPayment: getActualDownPayment(),
        remainingBalance: getRemainingBalance(),
        payments: paymentSchedule,
      },
    }),

    ...(paymentMethod === 'credit' && {
      credit: {
        waived: true,
        issuedAt: timestamp,
      },
    }),
  };

  // ---- SAVE TRANSACTION ----
  const transactions = JSON.parse(
    localStorage.getItem('pos_transactions') || '[]'
  );
  transactions.push(transaction);
  localStorage.setItem('pos_transactions', JSON.stringify(transactions));

  // ---- SAVE INSTALLMENT PLAN ----
  if (useInstallments) {
    const installmentPlans = JSON.parse(
      localStorage.getItem('installment_plans') || '[]'
    );

    installmentPlans.push({
      id: transactionId,
      customer,
      total,
      downPayment: getActualDownPayment(),
      remainingBalance: getRemainingBalance(),
      numberOfPayments: installmentPlan.numberOfPayments,
      amountPerPayment: installmentPlan.amountPerPayment,
      paymentFrequency: installmentPlan.paymentFrequency,
      startDate: installmentPlan.startDate,
      payments: paymentSchedule,
      status: 'active',
    });

    localStorage.setItem(
      'installment_plans',
      JSON.stringify(installmentPlans)
    );
  }

  setShowReceipt(true);
};


  const calculateDueDate = (startDate: string, frequency: string, offset: number) => {
    const date = new Date(startDate);
    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + offset);
        break;
      case 'weekly':
        date.setDate(date.getDate() + (offset * 7));
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + offset);
        break;
    }
    return date.toISOString().split('T')[0];
  };

 const handlePrintReceipt = () => {
    const transactionId = `txn_${Date.now()}`;
    
    const receiptHtml = ReactDOMServer.renderToString(
      <Receipt
        customer={customer}
        cart={cart}
        subtotal={subtotal}
        tax={tax}
        total={total}
        paymentMethod={useInstallments ? 'installment' : paymentMethod}
        amountPaid={parseFloat(amountPaid) || 0}
        change={calculateChange()}
        purchaseType={purchaseType}
        splitPayments={splitPayments}
        installmentPlan={useInstallments ? installmentPlan : undefined}
      />
    );

    const printWindow = window.open('', '_blank', 'width=500,height=800');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${transactionId}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* Tailwind-like utility classes for receipt */
            .space-y-4 > * + * { margin-top: 1rem; }
            .space-y-2 > * + * { margin-top: 0.5rem; }
            .space-y-1 > * + * { margin-top: 0.25rem; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .items-center { align-items: center; }
            .gap-3 { gap: 0.75rem; }
            .gap-2 { gap: 0.5rem; }
            .mr-2 { margin-right: 0.5rem; }
            .mt-6 { margin-top: 1.5rem; }
            .mt-4 { margin-top: 1rem; }
            .mt-2 { margin-top: 0.5rem; }
            .mt-1 { margin-top: 0.25rem; }
            .pt-4 { padding-top: 1rem; }
            .p-3 { padding: 0.75rem; }
            .p-4 { padding: 1rem; }
            .text-sm { font-size: 0.875rem; }
            .text-xs { font-size: 0.75rem; }
            .text-lg { font-size: 1.125rem; }
            .font-bold { font-weight: 700; }
            .font-medium { font-weight: 500; }
            .font-semibold { font-weight: 600; }
            .text-center { text-align: center; }
            .text-gray-100 { color: #f3f4f6; }
            .text-gray-300 { color: #d1d5db; }
            .text-gray-400 { color: #9ca3af; }
            .text-gray-500 { color: #6b7280; }
            .text-gray-600 { color: #4b5563; }
            .text-gray-900 { color: #111827; }
            .text-white { color: #ffffff; }
            .text-black { color: #000000; }
            .text-yellow-300 { color: #fbbf24; }
            .text-yellow-400 { color: #fbbf24; }
            .text-blue-400 { color: #60a5fa; }
            .text-green-800 { color: #166534; }
            .text-red-600 { color: #dc2626; }
            .bg-yellow-300 { background-color: #fbbf24; }
            .bg-yellow-500 { background-color: #eab308; }
            .bg-yellow-900\/20 { background-color: rgba(120, 53, 15, 0.2); }
            .bg-blue-900\/30 { background-color: rgba(30, 58, 138, 0.3); }
            .bg-green-50 { background-color: #f0fdf4; }
            .bg-gray-800 { background-color: #1f2937; }
            .bg-gray-900 { background-color: #111827; }
            .bg-white { background-color: #ffffff; }
            .rounded-lg { border-radius: 0.5rem; }
            .rounded-sm { border-radius: 0.125rem; }
            .border { border-width: 1px; }
            .border-gray-700 { border-color: #374151; }
            .border-gray-800 { border-color: #1f2937; }
            .border-yellow-800\/30 { border-color: rgba(146, 64, 14, 0.3); }
            .overflow-hidden { overflow: hidden; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
            .w-full { width: 100%; }
            .h-8 { height: 2rem; }
            .w-8 { width: 2rem; }
            .h-4 { height: 1rem; }
            .w-4 { width: 1rem; }
            .h-5 { height: 1.25rem; }
            .w-5 { width: 1.25rem; }
            .capitalize { text-transform: capitalize; }
            .uppercase { text-transform: uppercase; }
            
            /* Receipt specific styles */
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #111827;
              color: white;
              margin: 0;
              padding: 20px;
              line-height: 1.5;
            }
            
            @media print {
              @page {
                size: auto;
                margin: 0mm;
              }
              body {
                margin: 0;
                padding: 10px;
                background: white !important;
                color: black !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print { display: none !important; }
              .bg-yellow-300 { background-color: #facc15 !important; }
              .bg-yellow-500 { background-color: #eab308 !important; }
              .bg-gray-800 { background-color: #f3f4f6 !important; }
              .bg-gray-900 { background-color: #ffffff !important; }
              .text-white { color: #000000 !important; }
              .text-gray-100 { color: #000000 !important; }
              .text-gray-300 { color: #000000 !important; }
              .text-gray-400 { color: #666666 !important; }
              .border-gray-700 { border-color: #ddd !important; }
              .border-gray-800 { border-color: #ddd !important; }
            }
            
            /* Print controls */
            .print-controls {
              position: fixed;
              top: 10px;
              right: 10px;
              z-index: 1000;
              background: white;
              padding: 10px;
              border-radius: 5px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              border: 1px solid #ddd;
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

  const handleShareReceipt = () => {
    toast('Sharing receipt...');
  };

  const handleDownloadPDF = () => {
    toast('Downloading PDF...');
  };

  const handleDownloadImage = () => {
    toast('Downloading image...');
  };

useEffect(() => {
  if (useInstallments) {
    setAmountPaid(installmentPlan.downPayment.toFixed(2));
  }
}, [installmentPlan.downPayment, useInstallments]);


  if (showReceipt) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white">
              <DialogHeader>
            <DialogTitle>Complete Sale</DialogTitle>
            <DialogDescription>
              Review order and select payment method
            </DialogDescription>
            </DialogHeader>
            
          <Receipt
            customer={customer}
            cart={cart}
            subtotal={subtotal}
            tax={tax}
            total={total}
            paymentMethod={useInstallments ? 'installment' : paymentMethod}
            amountPaid={parseFloat(amountPaid) || 0}
            change={calculateChange()}
            purchaseType={purchaseType}
            splitPayments={splitPayments}
            installmentPlan={useInstallments ? installmentPlan : undefined}
          />
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={handlePrintReceipt} className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={handleDownloadImage} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Image
            </Button>
            <Button variant="outline" onClick={handleShareReceipt} className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              className="bg-black hover:bg-gray-800 text-white flex-1"
              onClick={() => {
                setShowReceipt(false);
                onComplete();
                onOpenChange(false);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Complete Sale</DialogTitle>
            <DialogDescription>
              Review order and select payment method
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Order Summary</h3>
              <div className="space-y-1 text-white">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-100">
                      {item.productName} ({item.variantName}) × {item.quantity}
                    </span>
                    <span>NGN {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span>Purchase Type</span>
                <Badge variant="secondary">{purchaseType === 'in-store' ? 'In-Store' : 'Online'}</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span>Payment Method</span>
                <Badge variant="secondary">
                  {paymentMethod === 'split' ? 'Split Payment' : 
                   useInstallments ? 'Installment' : paymentMethod}
                </Badge>
              </div>

              {paymentMethod === 'split' && (
                <div className="mt-2 text-sm text-gray-300">
                  {splitPayments.map((p, i) => (
                    <div key={i}>
                      {p.method}: NGN {parseFloat(p.amount || '0').toFixed(2)}
                    </div>
                  ))}
                </div>
              )}

              {paymentMethod === 'split' && getSplitTotalPaid() > total && (
                <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-green-800 font-bold">
                    Change: NGN {(getSplitTotalPaid() - total).toFixed(2)}
                    </div>
                </div>
                )}

              
              {useInstallments && (
                <div className="mt-2 p-3 bg-yellow-900/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Installment Plan</span>
                    <Badge variant="default" className="bg-yellow-500 text-black">
                      {installmentPlan.numberOfPayments} payments
                    </Badge>
                  </div>
                  <div className="text-sm mt-1">
                    Down: NGN {installmentPlan.downPayment.toFixed(2)} | 
                    Per: NGN {installmentPlan.amountPerPayment.toFixed(2)} | 
                    Remaining: NGN {installmentPlan.remainingBalance.toFixed(2)}
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>NGN {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span>NGN {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>NGN {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

         
            {isCustomerEligibleForInstallments && (
                <div className="p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-yellow-400" />
                    <div>
                      <div className="font-medium">Installment Payment</div>
                      <div className="text-sm text-gray-400">
                        Available for registered customers
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={useInstallments}
                    onCheckedChange={(checked) => {
                      setUseInstallments(checked);
                      if (checked) {
                        setShowInstallmentModal(true);
                      } else {
                        setPaymentMethod('cash');
                      }
                    }}
                  />
                </div>
              </div>

            )}


            {isCustomerVerified && (
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-blue-400" />
                        <div>
                          <div className="font-medium">Credit Sale</div>
                          <div className="text-sm text-gray-400">
                            Give items now
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={paymentMethod === 'credit'}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPaymentMethod('credit');
                            setUseInstallments(false);
                            setAmountPaid('0');
                          } else {
                            setPaymentMethod('cash');
                          }
                        }}
                      />
                    </div>
                  </div>
                )}


            {paymentMethod === 'credit' && (
            <div className="p-4 bg-blue-900/30 rounded-lg">
              <div className="text-lg font-bold text-blue-400">
                Credit Sale Approved
              </div>
              <div className="text-sm mt-2">
                Customer will not pay:
                <span className="font-bold text-white">
                  {' '}NGN {total.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                No payment required 
              </div>
            </div>
          )}


         
            {!useInstallments && (
              <div className="space-y-3">
                <Label>Payment Method</Label>
                <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="grid grid-cols-4 bg-gray-900">
                    <TabsTrigger value="cash" className='bg-gray-800 text-white hover:bg-gray-700'>
                      <Banknote className="h-4 w-4 mr-2" />
                      Cash
                    </TabsTrigger>
                    <TabsTrigger value="card" className='bg-gray-800 text-white hover:bg-gray-700'>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Card
                    </TabsTrigger>
                    <TabsTrigger value="transfer" className='bg-gray-800 text-white hover:bg-gray-700'>
                      <Smartphone className="h-4 w-4 mr-2" />
                      Transfer
                    </TabsTrigger>
                    <button
                      type="button"
                      onClick={() => setShowSplitPayment(true)}
                      className="flex items-center justify-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700 transition"
                    >
                      <Split className="h-4 w-4" />
                      Split
                    </button>
                  </TabsList>
                  
                  {paymentMethod !== 'split' && (
                    <TabsContent value={paymentMethod} className="space-y-3">
                      <div className='flex flex-col gap-2'>
                        <Label htmlFor="amountPaid">Amount Paid</Label>
                        <Input
                          id="amountPaid"
                          type="number"
                          value={isNaN(parseFloat(amountPaid)) ? '' : amountPaid}
                          onChange={(e) => handleAmountPaidChange(e.target.value)}
                          min={0}
                          step="0.01"
                           disabled={paymentMethod === 'credit'}
                        />
                      </div>

                      {parseFloat(amountPaid) > total && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="text-green-800 font-bold">
                            Change: NGN {calculateChange().toFixed(2)}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            )}

           
            {useInstallments && (
              <div className="space-y-3">
                <Label>Installment Payment</Label>
                <div className="p-4 bg-gray-800 rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Total Amount</div>
                      <div className="text-xl font-bold">NGN {total.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Required Down Payment</div>
                      <div className="text-xl font-bold text-yellow-400">
                        NGN {installmentPlan.downPayment.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor="installmentAmountPaid">Down Payment Amount</Label>
                    <Input
                    id="installmentAmountPaid"
                    type="number"
                    value={amountPaid}
                    onChange={(e) => handleAmountPaidChange(e.target.value)}
                    min={installmentPlan.downPayment}
                    max={total}
                    step="0.01"
                  />
                  </div>
                  
                  {parseFloat(amountPaid) >= installmentPlan.downPayment && (
                    <div className="p-3 bg-green-900/30 rounded-lg">
                      <div className="text-green-400 font-bold">
                        Approved! You can pay NGN {parseFloat(amountPaid).toFixed(2)} as down payment.
                      </div>
                      <div className="text-sm mt-1">
                        Remaining balance: NGN {installmentPlan.remainingBalance.toFixed(2)}
                      </div>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowInstallmentModal(true)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    View Installment Schedule
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel Order
            </Button>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
              onClick={handleCompleteSale}
              disabled={useInstallments && parseFloat(amountPaid) < installmentPlan.downPayment}
            >
              {useInstallments ? 'Start Installment Plan' : 'Complete Sale'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Split Payment Modal */}
      <SplitPaymentModal
        open={showSplitPayment}
        onOpenChange={setShowSplitPayment}
        splitPayments={splitPayments}
        setSplitPayments={setSplitPayments}
        total={total}
        setAmountPaid={setAmountPaid}
        setPaymentMethod={setPaymentMethod}
      />


      <InstallmentPlanModal
        open={showInstallmentModal}
        onOpenChange={setShowInstallmentModal}
        installmentPlan={installmentPlan}
        setInstallmentPlan={setInstallmentPlan}
        total={total}
        customer={customer}
      />
    </>
  );
}


interface SplitPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  splitPayments: { method: string; amount: string }[];
  setSplitPayments: (payments: { method: string; amount: string }[]) => void;
  total: number;
  setAmountPaid: (amount: string) => void;
  setPaymentMethod: (method: string) => void;
}

function SplitPaymentModal({
  open,
  onOpenChange,
  splitPayments,
  setSplitPayments,
  total,
  setAmountPaid,
  setPaymentMethod,
}: SplitPaymentModalProps) {
  const toCents = (value: number) => Math.round(value * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>Split Payment</DialogTitle>
          <DialogDescription>
            Split payment across multiple methods
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {splitPayments.map((payment, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1 flex flex-col gap-2">
                <Label>Method</Label>
                <select
                  className="w-full bg-gray-800 border rounded px-2 py-1"
                  value={payment.method}
                  onChange={(e) => {
                    const updated = [...splitPayments];
                    updated[index].method = e.target.value;
                    setSplitPayments(updated);
                  }}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={payment.amount}
                  onChange={(e) => {
                    const updated = [...splitPayments];
                    updated[index].amount = e.target.value;
                    setSplitPayments(updated);
                  }}
                />
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            {splitPayments.length < 3 && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  setSplitPayments([...splitPayments, { method: 'cash', amount: '' }])
                }
              >
                Add Method
              </Button>
            )}
            {splitPayments.length > 2 && (
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setSplitPayments(splitPayments.slice(0, -1))}
              >
                Remove
              </Button>
            )}
          </div>

          <div className="text-sm">
            Total Entered:{' '}
            <span className="font-bold">
              NGN{' '}
              {(
                Math.round(
                  splitPayments.reduce(
                    (sum, p) => sum + (parseFloat(p.amount) || 0),
                    0
                  ) * 100
                ) / 100
              ).toFixed(2)}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full bg-yellow-500 text-black"
            onClick={() => {
              const totalPaid = splitPayments.reduce(
                (sum, p) => sum + (parseFloat(p.amount) || 0),
                0
              );

              if (toCents(totalPaid) !== toCents(total)) {
                toast.error('Split amounts must equal total');
                return;
              }

              setAmountPaid(total.toFixed(2));
              setPaymentMethod('split');
              onOpenChange(false);
            }}
          >
            Confirm Split Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


interface InstallmentPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installmentPlan: InstallmentPlan;
  setInstallmentPlan: React.Dispatch<React.SetStateAction<InstallmentPlan>>;
  total: number;
  customer: Customer;
  
}


function InstallmentPlanModal({
  open,
  onOpenChange,
  installmentPlan,
  setInstallmentPlan,
  total,
  customer,
}: InstallmentPlanModalProps) {
const handleInputChange = <K extends keyof InstallmentPlan>(field: K, value: InstallmentPlan[K]) => {
  setInstallmentPlan((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const [downPaymentPercent, setDownPaymentPercent] = useState(
  Math.round((installmentPlan.downPayment / total) * 100)
);


  const calculatePaymentSchedule = () => {
  const schedule = [];
  const startDate = new Date(installmentPlan.startDate);

  const totalPayments = installmentPlan.numberOfPayments;
  const numberOfInstallments = totalPayments - 1;

  const remaining = total - installmentPlan.downPayment;

  const base = Number(
    (remaining / numberOfInstallments).toFixed(2)
  );

  for (let i = 0; i < totalPayments; i++) {
    const dueDate = new Date(startDate);

    if (i > 0) {
      switch (installmentPlan.paymentFrequency) {
        case 'daily':
          dueDate.setDate(dueDate.getDate() + i);
          break;
        case 'weekly':
          dueDate.setDate(dueDate.getDate() + i * 7);
          break;
        case 'monthly':
          dueDate.setMonth(dueDate.getMonth() + i);
          break;
      }
    }

    const amount =
      i === 0
        ? installmentPlan.downPayment
        : i === totalPayments - 1
        ? Number(
            (
              remaining -
              base * (numberOfInstallments - 1)
            ).toFixed(2)
          )
        : base;

    schedule.push({
      paymentNumber: i + 1,
      amount,
      dueDate: dueDate.toISOString().split('T')[0],
      status: i === 0 ? 'paid' : 'pending',
      type: i === 0 ? 'down_payment' : 'installment',
    });
  }

  return schedule;
};


  const schedule = calculatePaymentSchedule();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>Installment Payment Plan</DialogTitle>
          <DialogDescription>
            Configure installment plan for {customer.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
       
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-gray-400">
                  {customer.email} • {customer.phone}
                </div>
              </div>
              <Badge variant="default" className="bg-yellow-500 text-black">
                Installment Plan
              </Badge>
            </div>
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment (%)</Label>
            <Input
                  id="downPayment"
                  type="number"
                  min={10}
                  max={90}
                  value={isNaN(downPaymentPercent) ? '' : downPaymentPercent}
                  onChange={(e) => {
                    const percent = Number(e.target.value);
                    if (isNaN(percent)) return;

                    setDownPaymentPercent(percent);

                    const safeTotal = total || 0;
                    const safePercent = percent || 0;
                    const downPayment = Math.ceil((safeTotal * safePercent) / 100);
                    handleInputChange('downPayment', downPayment);
                  }}
                />
              <div className="text-sm text-gray-400">
                Minimum: 10% | Recommended: 30%
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfPayments">Number of Payments</Label>
              <Select
                value={installmentPlan.numberOfPayments.toString()}
                onValueChange={(value) => handleInputChange('numberOfPayments', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 payments</SelectItem>
                  <SelectItem value="3">3 payments</SelectItem>
                  <SelectItem value="4">4 payments</SelectItem>
                  <SelectItem value="6">6 payments</SelectItem>
                  <SelectItem value="12">12 payments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentFrequency">Payment Frequency</Label>
             <Select
                value={installmentPlan.paymentFrequency}
                onValueChange={(value) =>
                    handleInputChange(
                    'paymentFrequency',
                    value as 'daily' | 'weekly' | 'monthly' 
                    )
                }
                >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={installmentPlan.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
          </div>

         
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-400">Total Amount</div>
                <div className="text-xl font-bold">NGN {total.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Down Payment</div>
                <div className="text-xl font-bold text-yellow-400">
                  NGN {installmentPlan.downPayment.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Remaining Balance</div>
                <div className="text-xl font-bold">
                  NGN {installmentPlan.remainingBalance.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-400">
                {installmentPlan.numberOfPayments} total payments
                {installmentPlan.numberOfPayments > 1 && (
                  <>
                    {' '}(1 down payment + {installmentPlan.numberOfPayments - 1} installments) of{' '}
                    <span className="font-bold text-white">
                      NGN {installmentPlan.amountPerPayment.toFixed(2)}
                    </span>{' '}
                    each ({installmentPlan.paymentFrequency})
                  </>
                )}
              </div>
            </div>
          </div>

       
          <div className="space-y-3">
            <Label>Payment Schedule</Label>
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-3 text-left text-sm">Payment #</th>
                    <th className="p-3 text-left text-sm">Amount</th>
                    <th className="p-3 text-left text-sm">Due Date</th>
                    <th className="p-3 text-left text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((payment, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          Payment {payment.paymentNumber}
                        </div>
                      </td>
                      <td className="p-3 font-medium">
                        NGN {payment.amount.toFixed(2)}
                      </td>
                      <td className="p-3">{payment.dueDate}</td>
                      <td className="p-3">
                        <Badge 
                          variant={payment.type === 'down_payment' ? 'default' : 'secondary'}
                          className={payment.type === 'down_payment' ? 'bg-yellow-500 text-black' : ''}
                        >
                          {payment.type === 'down_payment'
                            ? 'Down Payment'
                            : payment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

      
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={installmentPlan.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any notes about this installment plan..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
            onClick={() => onOpenChange(false)}
          >
            Confirm Installment Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 