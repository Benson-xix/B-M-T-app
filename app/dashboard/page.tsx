'use client';
import { useState } from 'react';

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
  Package,
  ShoppingCart,
  BarChart3,
  PieChart
} from "lucide-react";
import { DashboardLayout } from './components/DashboardLayout';
import { TabsContent } from '@/components/ui/tabs';
import { IncomeExpenseChart } from './components/IncomeExpenseChart';
import { SalesCategoryChart } from './components/SalesCategoryChart';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("thisMonth");

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    console.log("Date range changed to:", range);
  };

  const kpiData = [
    {
      title: "Total Sales",
      value: "$142,580",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: <DollarSign className="h-5 w-5" />,
      description: "vs last period"
    },
    {
      title: "Total Transactions",
      value: "1,248",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: <CreditCard className="h-5 w-5" />,
      description: "orders completed"
    },
    {
      title: "Total Expenses",
      value: "$42,850",
      change: "+3.1%",
      changeType: "neutral" as const,
      icon: <TrendingDown className="h-5 w-5" />,
      description: "operational costs"
    },
    {
      title: "Net Profit",
      value: "$99,730",
      change: "+18.7%",
      changeType: "positive" as const,
      icon: <TrendingUp className="h-5 w-5" />,
      description: "after all deductions"
    }
  ];

  return (
    <DashboardLayout>
    
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
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
           
            <div className="bg-white backdrop-blur-sm border border-gray-800 
  rounded-xl 
  p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-yellow-600" />
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

            
            <div  className='grid grid-cols-1 md:grid-cols-2'>
             <div className="bg-white backdrop-blur-sm border border-gray-800 
  rounded-xl 
  p-4 sm:p-5 lg:p-6">
               <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-yellow-600" />
                    Sales by Category
                  </h3>
                  <p className="text-sm text-gray-800">Revenue distribution</p>
                </div>
                <div className="text-sm text-gray-900">
                  Selected: {dateRange}
                </div>
              </div>
              <SalesCategoryChart />
             </div>
            </div>
          </div>

          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StockAlertWidget />
            <TopProductsWidget />
          </div>
        </TabsContent>

        
        <TabsContent value="stock">
          <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Stock Movement Analysis</h3>
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Stock movement data will appear here</p>
              <p className="text-sm text-gray-500 mt-2">Based on selected date range: {dateRange}</p>
            </div>
          </div>
        </TabsContent>

       
        <TabsContent value="sales">
          <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Sales Analysis</h3>
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Sales data will appear here</p>
              <p className="text-sm text-gray-500 mt-2">Based on selected date range: {dateRange}</p>
            </div>
          </div>
        </TabsContent>

       
        <TabsContent value="expenses">
          <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Expenses Breakdown</h3>
            <div className="text-center py-12">
              <TrendingDown className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Expenses data will appear here</p>
              <p className="text-sm text-gray-500 mt-2">Based on selected date range: {dateRange}</p>
            </div>
          </div>
        </TabsContent>

       
        <TabsContent value="logins">
          <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Login Attempts & Security</h3>
            <div className="text-center py-12">
              <div className="h-12 w-12 text-gray-600 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-800">
                🔒
              </div>
              <p className="text-gray-400">Login activity data will appear here</p>
              <p className="text-sm text-gray-500 mt-2">Based on selected date range: {dateRange}</p>
            </div>
          </div>
        </TabsContent>
      </DashboardTabs>
    </DashboardLayout>
  );
}