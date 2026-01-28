
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Plus, Filter,  Upload,  CheckCircle, XCircle, AlertCircle, TrendingUp, DollarSign,  Tag, BarChart3, PieChart as PieChartIcon, Pencil, Trash } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays,  parseISO,isWithinInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, Cell, PieChart } from 'recharts';
import { InventoryLayout } from '../inventory/components/InventoryLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KPICard } from './component/KPICard';
import { Expense, ExpenseCategory, TimeFilter } from '../utils/type';
import { ExpensesTable } from './component/ExpensesTable';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    name: 'Office Stationery',
    categoryId: 'cat-1', 
    amount: 15000,
    note: 'Pens, paper, notebooks',
    status: 'approved',
    createdBy: 'Admin',
    expenseDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    month: format(new Date(), 'MMM yyyy'),
  },
  {
    id: 'exp-2',
    name: 'Internet Subscription',
    categoryId: 'cat-2',
    amount: 25000,
    note: 'Monthly ISP bill',
    status: 'approved',
    createdBy: 'Admin',
    expenseDate: subDays(new Date(), 2).toISOString(),
    createdAt: subDays(new Date(), 2).toISOString(),
    month: format(new Date(), 'MMM yyyy'),
  },
  {
    id: 'exp-3',
    name: 'Facebook Ads',
    categoryId: 'cat-3',
    amount: 40000,
    note: 'Product campaign',
    status: 'pending',
    createdBy: 'Admin',
    expenseDate: subDays(new Date(), 5).toISOString(),
    createdAt: subDays(new Date(), 5).toISOString(),
    month: format(new Date(), 'MMM yyyy'),
  },
  {
    id: 'exp-4',
    name: 'Team Lunch',
    categoryId: 'cat-4', 
    amount: 18000,
    note: 'Client meeting',
    status: 'approved',
    createdBy: 'Admin',
    expenseDate: subDays(new Date(), 7).toISOString(),
    createdAt: subDays(new Date(), 7).toISOString(),
    month: format(new Date(), 'MMM yyyy'),
  },

  {
    id: 'exp-6',
    name: 'New Laptop',
    categoryId: 'cat-6',
    amount: 350000,
    note: 'Developer machine',
    status: 'approved',
    createdBy: 'Admin',
    expenseDate: subDays(new Date(), 15).toISOString(),
    createdAt: subDays(new Date(), 15).toISOString(),
    month: format(new Date(), 'MMM yyyy'),
  },
];


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function ExpensesPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('this-month');
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState('overview');
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [categories, setCategories] = useState<ExpenseCategory[]>([
    { id: 'cat-1', name: 'Office Supplies' },
    { id: 'cat-2', name: 'Utilities' },
    { id: 'cat-3', name: 'Marketing' },
    { id: 'cat-4', name: 'Travel' },
    { id: 'cat-5', name: 'Software' },
    { id: 'cat-6', name: 'Equipment' },
  ]);
  const router = useRouter();

const handleViewInvoice = (expense: Expense) => {
  router.push(`/expenses/invoices/${expense.id}`);
};

const handleApprove = (id: string) => {
  setExpenses(prev =>
    prev.map(exp =>
      exp.id === id ? { ...exp, status: 'approved' } : exp
    )
  );
};

const handleReject = (id: string) => {
  setExpenses(prev =>
    prev.map(exp =>
      exp.id === id ? { ...exp, status: 'rejected' } : exp
    )
  );
};
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [newExpense, setNewExpense] = useState({
    name: '',
    categoryId: '',
    amount: '',
    note: '',
    expenseDate: new Date(),
    receipt: null as File | null,
  });
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);

const handleOpenEditCategory = (category: ExpenseCategory) => {
  setEditingCategory(category);
  setIsEditCategoryDialogOpen(true);
};

const handleUpdateCategory = () => {
  if (!editingCategory?.name.trim()) return;

  setCategories(prev =>
    prev.map(cat =>
      cat.id === editingCategory.id ? editingCategory : cat
    )
  );

  setIsEditCategoryDialogOpen(false);
  setEditingCategory(null);
};



  const filteredExpenses = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (timeFilter) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'yesterday':
        const yesterday = subDays(new Date(), 1);
        startDate = new Date(yesterday.setHours(0, 0, 0, 0));
        endDate = new Date(yesterday.setHours(23, 59, 59, 999));
        break;
      case 'this-week':
        startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
        endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
        break;
      case 'this-month':
        startDate = startOfMonth(new Date());
        endDate = endOfMonth(new Date());
        break;
      case 'custom':
        if (!customStartDate || !customEndDate) return expenses;
        startDate = customStartDate;
        endDate = customEndDate;
        break;
      default:
        return expenses;
    }

    return expenses.filter(expense => {
      const expenseDate = parseISO(expense.expenseDate);
      return isWithinInterval(expenseDate, { start: startDate, end: endDate });
    });
  }, [expenses, timeFilter, customStartDate, customEndDate]);

 
  const kpis = useMemo(() => {
    const totalExpense = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalRevenue = 100000; 
    const categoryCount = categories.length;
    const netProfit = totalRevenue - totalExpense;
    const grossProfit = totalRevenue;
    const totalTax = totalRevenue * 0.1; 
    const totalDiscount = totalRevenue * 0.05; 
    
    return {
      totalExpense,
      totalRevenue,
      categoryCount,
      netProfit,
      grossProfit,
      totalTax,
      totalDiscount,
    };
  }, [filteredExpenses, categories]);

  const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};


const generateChartData = (timeFilter: TimeFilter) => {
  if (timeFilter === 'today' || timeFilter === 'yesterday') {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      revenue: seededRandom(i * 1000) * 10000,
      expenses: seededRandom(i * 1001) * 5000,
    }));
  } else if (timeFilter === 'this-week') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => ({
      day,
      revenue: seededRandom(i * 2000) * 20000,
      expenses: seededRandom(i * 2001) * 10000,
    }));
  } else {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return weeks.map((week, i) => ({
      week,
      revenue: seededRandom(i * 3000) * 50000,
      expenses: seededRandom(i * 3001) * 25000,
    }));
  }
};

const chartData = useMemo(() => {
  return generateChartData(timeFilter);
}, [timeFilter]);


  const categoryData = useMemo(() => {
    const categoryMap = new Map();
    
    filteredExpenses.forEach(expense => {
      const category = categories.find(c => c.id === expense.categoryId);
      if (category) {
        const current = categoryMap.get(category.name) || { name: category.name, value: 0, count: 0 };
        current.value += expense.amount;
        current.count += 1;
        categoryMap.set(category.name, current);
      }
    });
    
    return Array.from(categoryMap.values());
  }, [filteredExpenses, categories]);


  const recentExpenses = useMemo(() => {
    return [...filteredExpenses]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [filteredExpenses]);

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const newCat: ExpenseCategory = {
      id: `cat-${Date.now()}`,
      name: newCategory.name,
    };
    
    setCategories([...categories, newCat]);
    setNewCategory({ name: '' });
    setIsAddCategoryDialogOpen(false);
  };

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.categoryId || !newExpense.amount) return;
    
    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      name: newExpense.name,
      categoryId: newExpense.categoryId,
      amount: parseFloat(newExpense.amount),
      note: newExpense.note,
      receiptUrl: newExpense.receipt ? URL.createObjectURL(newExpense.receipt) : undefined,
      status: 'pending',
      createdBy: 'Current User',
      expenseDate: newExpense.expenseDate.toISOString(),
      createdAt: new Date().toISOString(),
      month: format(newExpense.expenseDate, 'MMM yyyy'),
    };
    
    setExpenses([...expenses, newExp]);
    
 
    setNewExpense({
      name: '',
      categoryId: '',
      amount: '',
      note: '',
      expenseDate: new Date(),
      receipt: null,
    });
    setReceiptPreview(null);
    setIsAddExpenseDialogOpen(false);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewExpense({ ...newExpense, receipt: file });
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
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

  return (
    <InventoryLayout>
      <div className="p-1 md:p-3 space-y-6 bg-white text-gray-900">
       
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Expense Management</h1>
            <p className="text-sm text-gray-500">Track and manage all business expenses</p>
          </div>
          
          {activeTab === 'expenses' && (
            <Dialog open={isAddExpenseDialogOpen} onOpenChange={setIsAddExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-gray-900 ">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>Enter expense details</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-name">Expense Name *</Label>
                    <Input
                      id="expense-name"
                      value={newExpense.name}
                      onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                      placeholder="e.g., Office Supplies Purchase"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={newExpense.categoryId} onValueChange={(value) => setNewExpense({...newExpense, categoryId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (NGN) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expense-date">Date of Expense *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(newExpense.expenseDate, 'PPP')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newExpense.expenseDate}
                          onSelect={(date) => date && setNewExpense({...newExpense, expenseDate: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="receipt">Receipt (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Input
                        id="receipt"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleReceiptUpload}
                        className="hidden"
                      />
                      <Label htmlFor="receipt" className="cursor-pointer flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload receipt</span>
                        <span className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</span>
                      </Label>
                      {receiptPreview && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Preview:</p>
                          <Image width={300} height={300} src={receiptPreview} alt="Receipt preview" className="max-h-32 mx-auto rounded" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Input
                      id="note"
                      value={newExpense.note}
                      onChange={(e) => setNewExpense({...newExpense, note: e.target.value})}
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddExpenseDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddExpense} className="bg-gray-100 hover:bg-gray-300">Add Expense</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

    
        <Card className="border border-gray-200 bg-gray-100 shadow-2xl text-gray-900">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium mr-4">Time Period:</span>
              
              {(['today', 'yesterday', 'this-week', 'this-month', 'custom'] as TimeFilter[]).map(filter => (
                <Button
                  key={filter}
                  variant={timeFilter === filter ? "secondary" : "ghost"}
                  onClick={() => setTimeFilter(filter)}
                  className="capitalize bg-gray-900 text-gray-100 hover:bg-gray-800 border-gray-300"
                >
                  {filter.replace('-', ' ')}
                </Button>
              ))}
              
              {timeFilter === 'custom' && (
                <div className="flex gap-2 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {customStartDate ? format(customStartDate, 'MMM dd') : 'Start date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={customStartDate}
                        onSelect={setCustomStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <span className="text-gray-500">to</span>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {customEndDate ? format(customEndDate, 'MMM dd') : 'End date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={customEndDate}
                        onSelect={setCustomEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </CardContent>
        </Card>


        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
          <TabsList className="grid w-full md:w-auto grid-cols-3 bg-gray-900 h-20 sm:h-10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

      
          <TabsContent value="overview" className="space-y-6">
          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <KPICard
                title="Total Expense"
                value={`NGN ${kpis.totalExpense.toLocaleString()}`}
                icon={<DollarSign className="w-5 h-5" />}
                trend={kpis.totalExpense > 50000 ? 'up' : 'down'}
              />
              <KPICard
                title="Total Revenue"
                value={`NGN ${kpis.totalRevenue.toLocaleString()}`}
                icon={<TrendingUp className="w-5 h-5" />}
                trend="up"
              />
              <KPICard
                title="Net Profit"
                value={`NGN ${kpis.netProfit.toLocaleString()}`}
                icon={<TrendingUp className="w-5 h-5" />}
                trend={kpis.netProfit > 0 ? 'up' : 'down'}
              />

                 <KPICard
                title="Gross Profit"
                value={`NGN ${kpis.grossProfit.toLocaleString()}`}
                icon={<TrendingUp className="w-5 h-5" />}
                trend={kpis.grossProfit > 0 ? 'up' : 'down'}
              />

              <KPICard
                title="Expense Categories"
                value={kpis.categoryCount.toString()}
                icon={<Tag className="w-5 h-5" />}
              />

             <KPICard
                title="Discount"
                value={`NGN ${kpis.totalDiscount.toString()}`}
                icon={<DollarSign className="w-5 h-5" />}
              />
            <KPICard
                title="Tax"
                value={`NGN ${kpis.totalTax.toString()}`}
                icon={<DollarSign className="w-5 h-5" />}
              />

            </div>

          
            <Card className="border border-gray-200 bg-white shadow-2xl text-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Revenue vs Expenses Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey={timeFilter === 'today' || timeFilter === 'yesterday' ? 'time' : timeFilter === 'this-week' ? 'day' : 'week'} 
                        stroke="#6b7280"
                      />
                      <YAxis stroke="#6b7280" />
                  <Tooltip 
  contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: 'white' }}
  formatter={(value) => [`NGN ${(value ?? 0).toLocaleString()}`, '']}
/>
                      <Legend />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                      <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
              <Card className="border border-gray-200 bg-gray-100 shadow-2xl text-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                Expense Categories Distribution
                </CardTitle>

                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                        label={({ name, percent }: { name?: string; percent?: number }) => {
                                if (!name || percent === undefined) return '';
                                return `${name}: ${(percent * 100).toFixed(0)}%`;
                            }}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                        formatter={(value) => [`NGN ${(value ?? 0).toLocaleString()}`, 'Amount']}
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: 'white' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

         
              <Card className="border border-gray-200 bg-gray-900 text-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Expenses</CardTitle>
                    <CardDescription>Latest 5 expense records</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab('expenses')}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentExpenses.map(expense => {
                      const category = categories.find(c => c.id === expense.categoryId);
                      return (
                        <div key={expense.id} className="md:flex md:items-center md:justify-between grid grid-cols-1 gap-2 p-3 bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-medium">{expense.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {category?.name || 'Uncategorized'}
                              </Badge>
                              {getStatusBadge(expense.status)}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">NGN {expense.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">
                              {format(parseISO(expense.expenseDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

    
          <TabsContent value="categories" className="space-y-6">
            <Card className="border border-gray-200 bg-gray-900 ">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Expense Categories</CardTitle>
                <Dialog  open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gray-100 hover:bg-gray-300 text-gray-900">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md bg-gray-900">
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                      <DialogDescription>Create a new expense category</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-name">Category Name *</Label>
                        <Input
                          id="category-name"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({ name: e.target.value })}
                          placeholder="e.g., Office Supplies"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button  onClick={() => setIsAddCategoryDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddCategory} className="bg-gray-100 hover:bg-gray-200">Add Category</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog
              open={isEditCategoryDialogOpen}
              onOpenChange={setIsEditCategoryDialogOpen}
            >
              <DialogContent className="max-w-md bg-gray-900">
                <DialogHeader>
                  <DialogTitle>Edit Category</DialogTitle>
                  <DialogDescription>Update expense category name</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-category-name">Category Name *</Label>
                    <Input
                      id="edit-category-name"
                      value={editingCategory?.name || ''}
                      onChange={(e) =>
                        setEditingCategory(prev =>
                          prev ? { ...prev, name: e.target.value } : prev
                        )
                      }
                      placeholder="e.g., Office Supplies"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditCategoryDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateCategory}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-900"
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map(category => (
                      <TableRow key={category.id}>
                        <TableCell className="font-mono text-sm">{category.id}</TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">
                         <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditCategory(category)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                        <Button variant="destructive" size="sm">
                            <Trash className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

      
          <TabsContent value="expenses" className="space-y-6">
            <ExpensesTable
              expenses={expenses}
              categories={categories}
              onDelete={handleDeleteExpense}
             onViewInvoice={handleViewInvoice}
              onApprove={handleApprove}
            onReject={handleReject}
            />
          </TabsContent>
        </Tabs>
      </div>
    </InventoryLayout>
  );
}




