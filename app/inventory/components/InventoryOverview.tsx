'use client';

import { StockAlertWidget } from "@/app/dashboard/components/StockAlertWidget";
import { TopProductsWidget } from "@/app/dashboard/components/TopProductsWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Package, AlertTriangle, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { StockByCategoryBarChart } from "./StockByCategoryBarChart";


interface StockItem {
  label: string;
  count: number;
  percentage: number;
  stroke: string;
  dot: string;
  description: string;
}



export function InventoryOverview({ searchQuery }: { searchQuery: string }) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  
  const stockData = [
    { time: "9:00 AM", stock: 125, change: 0 },
    { time: "9:30 AM", stock: 123, change: -2 },
    { time: "10:00 AM", stock: 120, change: -3 },
    { time: "10:30 AM", stock: 118, change: -2 },
    { time: "11:00 AM", stock: 115, change: -3 },
    { time: "11:30 AM", stock: 120, change: +5 },
    { time: "12:00 PM", stock: 122, change: +2 },
    { time: "12:30 PM", stock: 125, change: +3 },
    { time: "1:00 PM", stock: 122, change: -3 },
    { time: "1:30 PM", stock: 120, change: -2 },
  ];

  const kpis = [
    { title: "Total Stock", value: "1,248", icon: Package, color: "bg-blue-500" },
     { title: "In Stock", value: "20", icon: Package, color: "bg-blue-500" },
    { title: "Low Stock", value: "42", icon: AlertTriangle, color: "bg-green-400" },
    { title: "Out of Stock", value: "18", icon: AlertTriangle, color: "bg-red-500" },
    { title: "Inventory Sell Value", value: "NGN 248,950", icon: DollarSign, color: "bg-green-500" },
    { title: "Inventory Cost", value: "NGN 248,950", icon: TrendingUp, color: "bg-indigo-500" },
  ];

  const STOCK_DATA: StockItem[] = [
  {
    label: "In Stock",
    count: 980,
    percentage: 78.5,
    stroke: "#10b981",
    dot: "bg-green-500",
    description: "Adequate stock levels",
  },
  {
    label: "Low Stock",
    count: 42,
    percentage: 3.4,
    stroke: "#f59e0b",
    dot: "bg-green-400",
    description: "Below minimum threshold",
  },
  {
    label: "Out of Stock",
    count: 18,
    percentage: 1.4,
    stroke: "#ef4444",
    dot: "bg-red-500",
    description: "Requires immediate restocking",
  },
];




const chartData = STOCK_DATA.map(item => ({
  name: item.label,
  value: item.count,
  color: item.stroke,
}));




  const stockValues = stockData.map(d => d.stock);
  const minStock = Math.min(...stockValues);
  const maxStock = Math.max(...stockValues);
  const range = maxStock - minStock;


  const getYPosition = (value: number) => {
    return ((value - minStock) / range) * 180;
  };

  return (
    <div className="space-y-6">
 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow bg-white shadow-2xl backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                </div>
                <div className={`${kpi.color} p-3 rounded-lg`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    
      <div className="grid grid-cols-1 gap-15">
      
        <Card className=" bg-white text-900 ">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Activity className="h-5 w-5" />
              Stock Movement Flow
            </CardTitle>
            <CardDescription className="text-gray-900">
              Real-time tracking of inventory changes for Premium Leather Jacket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-100 rounded-lg flex flex-col gap-2  p-4">
          
              <div className="relative h-full">
             
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-900">
                  <div>{maxStock}</div>
                  <div>{Math.round((maxStock + minStock) / 2)}</div>
                  <div>{minStock}</div>
                </div>
                
              
                <div className="absolute left-12 right-0 top-0 bottom-0">
                
                  <div className="absolute inset-0 flex flex-col justify-between">
                    <div className="border-t border-gray-200"></div>
                    <div className="border-t border-gray-200"></div>
                    <div className="border-t border-gray-200"></div>
                  </div>
                  
                
                  <svg className="w-full h-full">
                  
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                   
                    {stockData.map((point, index) => {
                      if (index === 0) return null;
                      const prevPoint = stockData[index - 1];
                      const x1 = ((index - 1) / (stockData.length - 1)) * 100;
                      const y1 = 100 - (getYPosition(prevPoint.stock) / 180) * 100;
                      const x2 = (index / (stockData.length - 1)) * 100;
                      const y2 = 100 - (getYPosition(point.stock) / 180) * 100;
                      
                      return (
                        <line
                          key={`line-${index}`}
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke={point.change >= 0 ? "#10b981" : "#ef4444"}
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      );
                    })}
                    
                 
                    <path
                      d={`M 0% 100% ${stockData.map((point, index) => {
                        const x = (index / (stockData.length - 1)) * 100;
                        const y = 100 - (getYPosition(point.stock) / 180) * 100;
                        return `L ${x}% ${y}%`;
                      }).join(' ')} L 100% 100% Z`}
                      fill="url(#areaGradient)"
                    />
                  </svg>
                  
                 
                  <div className="absolute inset-0">
                    {stockData.map((point, index) => {
                      const left = `${(index / (stockData.length - 1)) * 100}%`;
                      const top = `${100 - (getYPosition(point.stock) / 180) * 100}%`;
                      
                      return (
                        <div
                          key={index}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                          style={{ left, top }}
                          onMouseEnter={() => setHoveredPoint(index)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        >
                     
                          <div className={`h-3 w-3 rounded-full transition-all duration-200 ${
                            point.change > 0 ? 'bg-green-500' : 
                            point.change < 0 ? 'bg-red-500' : 'bg-gray-400'
                          } ${hoveredPoint === index ? 'scale-150' : ''}`} />
                          
                        
                          <div className={`absolute -top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg transition-all duration-200 ${
                            hoveredPoint === index ? 'opacity-100 visible' : 'opacity-0 invisible'
                          }`}>
                            <div className="font-medium">{point.time}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div>Stock: <span className="font-bold">{point.stock}</span></div>
                              <div className={`flex items-center ${
                                point.change > 0 ? 'text-green-400' : 
                                point.change < 0 ? 'text-red-400' : 'text-gray-400'
                              }`}>
                                {point.change > 0 ? (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                ) : point.change < 0 ? (
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                ) : null}
                                {point.change > 0 ? '+' : ''}{point.change}
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 h-2 w-2 bg-gray-900"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
               
                  <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-500">
                    {stockData.filter((_, i) => i % 2 === 0).map((point, i) => (
                      <div key={i}>{point.time}</div>
                    ))}
                  </div>
                </div>
                
                
                <div className="absolute -top-8 right-0 flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Stock Increase</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">Stock Decrease</span>
                  </div>
                </div>
              </div>
              
          
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Starting Stock</div>
                  <div className="text-xl font-bold text-gray-900">{stockData[0].stock}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Current Stock</div>
                  <div className="text-xl font-bold text-gray-900">{stockData[stockData.length - 1].stock}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Net Change</div>
                  <div className={`text-xl font-bold ${
                    stockData[stockData.length - 1].stock - stockData[0].stock > 0 ? 'text-green-600' :
                    stockData[stockData.length - 1].stock - stockData[0].stock < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stockData[stockData.length - 1].stock - stockData[0].stock > 0 ? '+' : ''}
                    {stockData[stockData.length - 1].stock - stockData[0].stock}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Stock Status Distribution</CardTitle>
            <CardDescription className="text-gray-900">
              Overview of in-stock, low stock, and out-of-stock items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            <div className="relative w-64 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                  
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="text-3xl font-bold text-gray-900">1,248</div>
                      <div className="text-sm text-gray-500">Total Items</div>
                    </div>
            </div>


              
             
              <div className="flex-1 space-y-4">
                {STOCK_DATA.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${item.dot} h-3 w-3 rounded-full`} />
                      <div>
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {item.count} items
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </CardContent>
        </Card>

       <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">
            Stock by Category
          </CardTitle>
          <CardDescription className="text-gray-500">
            Number of items available per category
          </CardDescription>
        </CardHeader>

        <CardContent>
          <StockByCategoryBarChart />
        </CardContent>
      </Card>

        </div>
      </div>

    
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <StockAlertWidget />
        <TopProductsWidget />
      </div>
    </div>
  );
}