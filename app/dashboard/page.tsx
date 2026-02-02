'use client';
import { useEffect, useState } from 'react';

import { DateRangeFilter } from "./components/DateRangeFilter";
import { DashboardTabs } from "./components/DashboardTabs";
import { KpiCard } from "./components/KpiCard";
import { StockAlertWidget } from "./components/StockAlertWidget";
import { TopProductsWidget } from "./components/TopProductsWidget";

import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,

  BarChart3,
  PieChartIcon
} from "lucide-react";
import { DashboardLayout } from './components/DashboardLayout';
import { TabsContent } from '@/components/ui/tabs';
import { IncomeExpenseChart } from './components/IncomeExpenseChart';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StockMovementTable } from '../inventory/components/StockMovement';
import { TransactionsTab } from '../sales/components/TransactionsTab';
import { Expense, ExpenseCategory, loginAttempts, Transaction } from '../utils/type';
import { ExpensesTable } from '../expenses/component/ExpensesTable';
import { toast } from 'sonner';
import { CreditInstallmentOverview } from './components/SalesCategoryChart';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("thisMonth");
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([
    { id: 'cat-1', name: 'Office Supplies' },
    { id: 'cat-2', name: 'Utilities' },
    { id: 'cat-3', name: 'Marketing' },
    { id: 'cat-4', name: 'Travel' },
    { id: 'cat-5', name: 'Software' },
    { id: 'cat-6', name: 'Equipment' },
  ]);
  const ITEMS_PER_PAGE = 5;

const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil(loginAttempts.length / ITEMS_PER_PAGE);

const paginatedLogins = loginAttempts.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

    useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
      setTransactions(saved);
    } catch {
      setTransactions([]);
    }
  });

    useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTransactions(saved);
    } catch {
      setTransactions([]);
    }

    try {
      const savedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      setExpenses(savedExpenses);
    } catch {
      setExpenses([]);
    }
  }, []);

  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      const updated = expenses.filter(exp => exp.id !== id);
      setExpenses(updated);
      localStorage.setItem('expenses', JSON.stringify(updated));
    }
  };

  const handleViewInvoice = (expense: Expense) => {
    window.open(`/expenses/invoices/${expense.id}`, '_blank');
  };

  const handleApprove = (id: string) => {
    const updated = expenses.map(exp =>
      exp.id === id ? { ...exp, status: 'approved' as const } : exp
    );
    setExpenses(updated);
    localStorage.setItem('expenses', JSON.stringify(updated));
  };

  const handleReject = (id: string) => {
    const updated = expenses.map(exp =>
      exp.id === id ? { ...exp, status: 'rejected' as const } : exp
    );
    setExpenses(updated);
    localStorage.setItem('expenses', JSON.stringify(updated));
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    console.log("Date range changed to:", range);
  };

  const handleApproveLogin = (id: string) => {
  console.log('Approving login:', id);
  
  toast(`Login ${id} approved successfully!`);
};

const handleRejectLogin = (id: string) => {
  console.log('Rejecting login:', id);

  toast(`Login ${id} rejected!`);
};



  const kpiData = [
    {
      title: "Total Sales",
      value: "NGN 142,580",
   
      icon: <DollarSign className="h-5 w-5" />,
      description: "earned"
    },
    {
      title: "Total Transactions",
      value: "1,248",
      change: "+8.2%",
   
      icon: <CreditCard className="h-5 w-5" />,
      description: "orders completed"
    },
    {
      title: "Total Expenses",
      value: "NGN42,850",
      change: "+3.1%",
      icon: <TrendingDown className="h-5 w-5" />,
      description: "operational costs"
    },
    {
      title: "Net Profit",
      value: "NGN99,730",
      change: "+18.7%",
      icon: <TrendingUp className="h-5 w-5" />,
      description: "after all deductions"
    }
  ];

  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setCurrentPage(1);
}, [activeTab]);

  return (
    <DashboardLayout>
    
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-900 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your business.
          </p>
        </div>
        <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
      </div>

    
      <div className="grid grid-cols-1 
  xs:grid-cols-2 
  lg:grid-cols-4 
  gap-4 md:gap-5 lg:gap-6 
  mb-8">
        {kpiData.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

     
      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab}>
        
        <TabsContent value="overview" className="space-y-6">
         
          <div className="grid grid-cols-1  gap-6">
           
           <div className="bg-white border border-gray-100 shadow-2xl
  rounded-xl 
  p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    Income vs Expenses
                  </h3>
                  <p className="text-sm text-gray-800">Monthly comparison</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">Expenses</span>
                  </div>
                </div>
              </div>
              <IncomeExpenseChart />
            </div>
             </div>

          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <StockAlertWidget />
            <TopProductsWidget />
          </div>


          <div  className="grid grid-cols-1  gap-6">
             <div className="bg-white border border-gray-100 shadow-2xl rounded-xl p-4 sm:p-5 lg:p-6 w-full  ">
      
 
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2 sm:gap-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-green-500" />
            Due Installment & Credit-installment Overview
          </h3>
          <p className="text-sm sm:text-base text-gray-800">Credit-Installment</p>
        </div>
        <div className="text-sm sm:text-base text-gray-900">Selected: {dateRange}</div>
      </div>

      
      <CreditInstallmentOverview/>
           </div>
          </div>
        </TabsContent>

        
        <TabsContent value="stock">
          <Card className="bg-gray-900 border-gray-200">
            <CardHeader>
              <CardTitle >Stock Movement</CardTitle>
              <CardDescription >
                View all inventory movements
              </CardDescription>
            </CardHeader>
            <CardContent className='p-3'>
              <StockMovementTable />
            </CardContent>
          </Card>
        </TabsContent>

       
        <TabsContent value="sales">
              <Card className="bg-gray-900 border-gray-200">
            <CardHeader>
              <CardTitle ></CardTitle>
              <CardDescription >
        
              </CardDescription>
            </CardHeader>
            <CardContent className='p-3'>
              <TransactionsTab
                transactions={transactions}
                paymentMethodFilter={paymentMethodFilter}
                onPaymentMethodFilterChange={setPaymentMethodFilter}
              />
            </CardContent>
          </Card>
        </TabsContent>

       
        <TabsContent value="expenses">
          <Card className="bg-gray-900 border-gray-200">
            <CardHeader>
              <CardTitle ></CardTitle>
              <CardDescription >
              </CardDescription>
            </CardHeader>
            <CardContent className='p-3'>
              <ExpensesTable
                expenses={expenses}
                categories={categories}
                onDelete={handleDeleteExpense}
                onViewInvoice={handleViewInvoice}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </CardContent>
          </Card>
        </TabsContent>

       
        <TabsContent value="logins">
  <div className="bg-gray-900 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
    <h3 className="text-xl font-semibold text-white mb-6">Login Attempts & Security</h3>
    

    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-800/80">
          <tr>
            <th className="p-4 text-left font-medium text-gray-300">Email</th>
            <th className="p-4 text-left font-medium text-gray-300">Device</th>
            <th className="p-4 text-left font-medium text-gray-300">Location</th>
            <th className="p-4 text-left font-medium text-gray-300">Time</th>
            <th className="p-4 text-left font-medium text-gray-300">Approved By</th>
            <th className="p-4 text-left font-medium text-gray-300">Login Status</th>
            <th className="p-4 text-left font-medium text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
      
          {paginatedLogins.map((login) => (
            <tr key={login.id} className="hover:bg-gray-800/50 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-xs">👤</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{login.email}</p>
                    <p className="text-xs text-gray-400">User ID: {login.id}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-gray-700 flex items-center justify-center">
                    <span className="text-xs">
                      {login.device.includes('Chrome') ? '🌐' : 
                       login.device.includes('Safari') ? '🍎' : 
                       login.device.includes('Firefox') ? '🦊' : 
                       login.device.includes('Edge') ? '🔵' : '📱'}
                    </span>
                  </div>
                  <span className="text-gray-300">{login.device}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <span className="text-gray-300">{login.location}</span>
                </div>
                {login.location !== 'Unknown' && (
                  <p className="text-xs text-gray-400 mt-1">Approximate location</p>
                )}
              </td>
              <td className="p-4">
                <div>
                  <p className="text-white">{login.time.split(' ')[1]}</p>
                  <p className="text-xs text-gray-400">{login.time.split(' ')[0]}</p>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {login.approvedBy === 'System' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                      🤖 {login.approvedBy}
                    </span>
                  ) : login.approvedBy === 'Admin' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                      👑 {login.approvedBy}
                    </span>
                  ) : login.approvedBy === 'Manager' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                      👨‍💼 {login.approvedBy}
                    </span>
                  ) : (
                    <span className="text-gray-400">{login.approvedBy}</span>
                  )}
                </div>
              </td>
              <td className="p-4">
                {login.status === 'approved' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-300 border border-green-700/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 mr-2"></span>
                    Approved
                  </span>
                ) : login.status === 'pending' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-700/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 mr-2"></span>
                    Pending
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-300 border border-red-700/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400 mr-2"></span>
                    Rejected
                  </span>
                )}
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  {login.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApproveLogin(login.id)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-green-900/50 text-green-300 hover:bg-green-900 border border-green-700/50 hover:border-green-500 transition-colors"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleRejectLogin(login.id)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-red-900/50 text-red-300 hover:bg-red-900 border border-red-700/50 hover:border-red-500 transition-colors"
                      >
                        ✗ Reject
                      </button>
                    </>
                  )  : (
                    <div
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-900/50 text-blue-300 hover:bg-blue-900 border border-blue-700/50 hover:border-blue-500 transition-colors"
                    >
                    No Action
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="sm:flex sm:items-center sm:justify-between grid grid-cols-1 gap-2 mt-4 px-2">
  <p className="text-sm text-gray-400">
    Page {currentPage} of {totalPages}
  </p>

  <div className="flex gap-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
      className="px-3 py-1 text-sm rounded-md bg-gray-800 text-gray-300
                 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-gray-700 transition"
    >
      Previous
    </button>

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
      className="px-3 py-1 text-sm rounded-md bg-gray-800 text-gray-300
                 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-gray-700 transition"
    >
      Next
    </button>
  </div>
</div>
    </div>

   
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Logins</p>
            <p className="text-2xl font-semibold text-white">8</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-900/30 flex items-center justify-center">
            <span className="text-lg">👥</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Successful Logins</p>
            <p className="text-2xl font-semibold text-green-300">5</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-900/30 flex items-center justify-center">
            <span className="text-lg">✅</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Pending Approval</p>
            <p className="text-2xl font-semibold text-green-400">2</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-900/30 flex items-center justify-center">
            <span className="text-lg">⏳</span>
          </div>
        </div>
      </div>
    </div>


    <div className="mt-4 text-center">
      <p className="text-sm text-gray-500">Based on selected date range: {dateRange}</p>
      <p className="text-xs text-gray-600 mt-1">Last updated: Just now</p>
    </div>
  </div>
</TabsContent>
      </DashboardTabs>
    </DashboardLayout>
  );
}