'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Clock, User, DollarSign, CreditCard, AlertTriangle, CheckCircle, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import {InstallmentPayment, InstallmentPlan, Transaction } from '@/app/utils/type';
import Link from 'next/link';




export function CreditInstallmentOverview() {
  const [dueInstallments, setDueInstallments] = useState<InstallmentPlan[]>([]);
  const [recentCreditTransactions, setRecentCreditTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);



const loadData = () => {
  try {
    const savedPlans = localStorage.getItem('installment_plans');
    const plans: InstallmentPlan[] = savedPlans ? JSON.parse(savedPlans) : [];
    
    const activePlans = plans.filter(plan => plan.status === 'active');
    const duePlans = activePlans.filter(plan => 
      plan.payments.some(payment => 
        (payment.status === 'pending' || payment.status === 'overdue') && 
        new Date(payment.dueDate) <= new Date()
      )
    );
    
    setDueInstallments(duePlans.slice(0, 3)); 

    const savedTransactions = localStorage.getItem('pos_transactions');
    const transactions: Transaction[] = savedTransactions ? JSON.parse(savedTransactions) : [];
    
    const creditTransactions = transactions
      .filter(tx => tx.paymentMethod === 'credit' || tx.paymentMethod === 'installment')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3);
    
    setRecentCreditTransactions(creditTransactions);
  } catch (error) {
    console.error('Error loading data:', error);
    setRecentCreditTransactions([]);
    setDueInstallments([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadData();
  }, []);

  const getStatusBadge = (status: InstallmentPayment['status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Due</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit':
        return <CreditCard className="w-4 h-4" />;
      case 'installment':
        return <CalendarIcon className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'credit':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'installment':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

const getNextDueDate = (plan: InstallmentPlan): string => {
  const pendingPayment = plan.payments.find(p => p.status === 'pending');
  const overduePayment = plan.payments.find(p => p.status === 'overdue');
  
  if (overduePayment) return overduePayment.dueDate;
  if (pendingPayment) return pendingPayment.dueDate;
  return plan.payments[plan.payments.length - 1]?.dueDate || '';
};

const getTotalDueAmount = (plan: InstallmentPlan): number => {
  return plan.payments
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
};

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-500">Loading credit data...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 grid grid-cols-1  xl:grid-cols-2 gap-6">

      <Card className="border border-gray-200 bg-gray-100 text-gray-900  shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Due Installments
              </CardTitle>
              <CardDescription>
                {dueInstallments.length} installment plans with pending payments
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm bg-yellow-100 text-yellow-800">
              Total Due: NGN {dueInstallments.reduce((sum, plan) => sum + getTotalDueAmount(plan), 0.00).toLocaleString()}.00
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {dueInstallments.length > 0 ? (
            <div   className='grid grid-cols-1 gap-4'>
              {dueInstallments.map((plan) => {
                const nextDueDate = getNextDueDate(plan);
                const totalDue = getTotalDueAmount(plan);
                const pendingPayments = plan.payments.filter(p => p.status === 'pending').length;
                const overduePayments = plan.payments.filter(p => p.status === 'overdue').length;

                return (
                 <div key={plan.id} className="p-4 bg-gray-200 rounded-lg border border-gray-100 hover:bg-gray-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {plan.customer?.name?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{plan.customer?.name || 'Unknown'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {plan.customer?.phone || 'No phone'}
                          </span>
                        </div>
                      </div>
                    </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            Next due: {format(new Date(nextDueDate), 'MMM dd')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            NGN {totalDue.toLocaleString()}.00
                          </span>
                        </div>
                      </div>
                    </div>
                      
                      <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      {overduePayments > 0 && (
                        <Badge className="bg-red-100 text-red-800">
                          {overduePayments} overdue
                        </Badge>
                      )}
                      {pendingPayments > 0 && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {pendingPayments} pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
                );
              })}             
             <Link href='/sales/installment-page?filter=overdue' className="pt-4 border-t">
              <Button variant="link" className=" text-green-600 hover:text-green-700">
                View All Due Installments →
              </Button>
            </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="h-12 w-12 text-green-500 mx-auto mb-3 flex items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-gray-600">No due installments found</p>
              <p className="text-sm text-gray-500 mt-1">All payments are up to date</p>
            </div>
          )}
        </CardContent>
      </Card>

      
      <Card className="border border-gray-200 bg-gray-100 text-gray-900  shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Recent Credit\Installment Transactions
              </CardTitle>
              <CardDescription>
                Latest credit and installment purchases
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {recentCreditTransactions.length} transactions
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {recentCreditTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentCreditTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 bg-gray-200 rounded-lg border border-gray-100 hover:bg-gray-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getPaymentMethodColor(transaction.paymentMethod)}`}>
                          {getPaymentMethodIcon(transaction.paymentMethod)}
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.customer.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {format(new Date(transaction.timestamp), 'MMM dd, HH:mm')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Transaction:</span>
                          <code className="text-xs bg-gray-900 text-gray-100 px-2 py-1 rounded">
                            {transaction.id}
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Type:</span>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {transaction.paymentMethod}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          NGN {transaction.total.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {transaction.credit 
                            ? `Balance: NGN ${transaction.credit.creditBalance.toLocaleString()}`
                            : transaction.installmentPlan
                            ? `Installment: ${transaction.installmentPlan.numberOfPayments} payments`
                            : 'Full credit'
                          }
                        </p>
                      </div>
                      
                   <div className="flex gap-2 mt-3">
                      {transaction.paymentMethod === 'installment' && (
                          <div className="grid-cols-2 grid gap-2">
                            <Link href={`/sales/installment-page?planId=${transaction.id}`}>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                View Plans
                              </Button>
                            </Link>
                            <Link href={`/sales?tab=transactions&filter=installment&txId=${transaction.id}&startDate=${new Date(transaction.timestamp).toISOString().split('T')[0]}&endDate=${new Date(transaction.timestamp).toISOString().split('T')[0]}`}>
                              <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
                                View Sale
                              </Button>
                            </Link>
                          </div>
                        )}
                        {transaction.paymentMethod === 'credit' && (
                          <Link href={`/sales?tab=transactions&filter=credit&txId=${transaction.id}&startDate=${new Date(transaction.timestamp).toISOString().split('T')[0]}&endDate=${new Date(transaction.timestamp).toISOString().split('T')[0]}`}>
                            <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
                              View Sales
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <Link href='/sales'>
                 <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                  View Sales
                 </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="h-12 w-12 text-gray-400 mx-auto mb-3 flex items-center justify-center rounded-full bg-gray-100">
                <CreditCard className="w-6 h-6" />
              </div>
              <p className="text-gray-600">No recent credit transactions</p>
              <p className="text-sm text-gray-500 mt-1">Credit sales will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}