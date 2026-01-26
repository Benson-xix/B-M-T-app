'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, CreditCard, ShoppingBag, Globe, Eye, Trash2, Pencil, UserPlus, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { InventoryLayout } from '../inventory/components/InventoryLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Transaction } from '../utils/type';

type CustomerFilter =
  | 'all'
  | 'credit'
  | 'installment'
  | 'online'
  | 'in-store';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface CustomerMeta {
  customerId: string;
  hasCredit: boolean;
  hasInstallment: boolean;
  purchaseType: 'online' | 'in-store';
  totalPurchases: number;
  totalRevenue: number;
}


const initialCustomers: Customer[] = [
  { id: 'walk-in', name: 'Walk-in Customer' },
  { id: 'cust-1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
  { id: 'cust-2', name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321' },
  { id: 'cust-3', name: 'Robert Johnson', email: 'robert@example.com', phone: '+1122334455' },
  { id: 'cust-4', name: 'Alice Brown', email: 'alice@example.com', phone: '+1555666777' },
  { id: 'cust-5', name: 'Charlie Wilson', email: 'charlie@example.com', phone: '+1888999000' },
  { id: 'cust-6', name: 'David Lee', email: 'david@example.com', phone: '+1444555666' },
  { id: 'cust-7', name: 'Emma Davis', email: 'emma@example.com', phone: '+1777888999' },
  { id: 'cust-8', name: 'Frank Miller', email: 'frank@example.com', phone: '+1666777888' },
  { id: 'cust-9', name: 'Grace Taylor', email: 'grace@example.com', phone: '+1333444555' },
  { id: 'cust-10', name: 'Henry White', email: 'henry@example.com', phone: '+1222333444' },
  { id: 'cust-11', name: 'Ivy Clark', email: 'ivy@example.com', phone: '+1999888777' },
  { id: 'cust-12', name: 'Jack Evans', email: 'jack@example.com', phone: '+1888777666' },
];

const customerMeta: CustomerMeta[] = [
  { customerId: 'cust-1', hasCredit: true, hasInstallment: false, purchaseType: 'in-store', totalPurchases: 5, totalRevenue: 1200 },
  { customerId: 'cust-2', hasCredit: false, hasInstallment: true, purchaseType: 'online', totalPurchases: 3, totalRevenue: 800 },
  { customerId: 'cust-3', hasCredit: true, hasInstallment: true, purchaseType: 'online', totalPurchases: 8, totalRevenue: 2300 },
  { customerId: 'walk-in', hasCredit: false, hasInstallment: false, purchaseType: 'in-store', totalPurchases: 12, totalRevenue: 1500 },
  { customerId: 'cust-4', hasCredit: true, hasInstallment: false, purchaseType: 'in-store', totalPurchases: 2, totalRevenue: 450 },
  { customerId: 'cust-5', hasCredit: false, hasInstallment: true, purchaseType: 'online', totalPurchases: 6, totalRevenue: 1800 },
  { customerId: 'cust-6', hasCredit: true, hasInstallment: false, purchaseType: 'in-store', totalPurchases: 4, totalRevenue: 950 },
  { customerId: 'cust-7', hasCredit: false, hasInstallment: true, purchaseType: 'online', totalPurchases: 7, totalRevenue: 2100 },
  { customerId: 'cust-8', hasCredit: true, hasInstallment: true, purchaseType: 'in-store', totalPurchases: 9, totalRevenue: 2700 },
  { customerId: 'cust-9', hasCredit: false, hasInstallment: false, purchaseType: 'online', totalPurchases: 3, totalRevenue: 600 },
  { customerId: 'cust-10', hasCredit: true, hasInstallment: false, purchaseType: 'in-store', totalPurchases: 5, totalRevenue: 1200 },
  { customerId: 'cust-11', hasCredit: false, hasInstallment: true, purchaseType: 'online', totalPurchases: 8, totalRevenue: 2400 },
  { customerId: 'cust-12', hasCredit: true, hasInstallment: true, purchaseType: 'in-store', totalPurchases: 10, totalRevenue: 3100 },
];

const ITEMS_PER_PAGE = 5;

export default function CustomerManagementPage() {
  const [filter, setFilter] = useState<CustomerFilter>('all');
  const [allCustomers, setAllCustomers] = useState<Customer[]>(initialCustomers);
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const FILTER_VALUES: CustomerFilter[] = [
    'all',
    'credit',
    'installment',
    'online',
    'in-store',
  ];

  useEffect(() => {
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      try {
        const parsed = JSON.parse(savedCustomers);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAllCustomers(parsed);
      } catch (error) {
        console.error('Failed to load customers from localStorage:', error);
      }
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(allCustomers));
  }, [allCustomers]);

  const enrichedCustomers = useMemo(() => {
    return allCustomers.map(c => {
      const meta = customerMeta.find(m => m.customerId === c.id);
      return {
        ...c,
        hasCredit: meta?.hasCredit ?? false,
        hasInstallment: meta?.hasInstallment ?? false,
        purchaseType: meta?.purchaseType ?? 'in-store',
        totalPurchases: meta?.totalPurchases ?? 0,
        totalRevenue: meta?.totalRevenue ?? 0,
      };
    });
  }, [allCustomers]);

  const filteredCustomers = useMemo(() => {
    let filtered = enrichedCustomers.filter(c => {
      switch (filter) {
        case 'credit':
          return c.hasCredit;
        case 'installment':
          return c.hasInstallment;
        case 'online':
          return c.purchaseType === 'online';
        case 'in-store':
          return c.purchaseType === 'in-store';
        default:
          return true;
      }
    });


    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        (c.email && c.email.toLowerCase().includes(query)) ||
        (c.phone && c.phone.includes(query))
      );
    }

    return filtered;
  }, [filter, enrichedCustomers, searchQuery]);


  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCustomers, currentPage]);


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [filter, searchQuery]);

  const stats = useMemo(() => ({
    total: enrichedCustomers.length,
    credit: enrichedCustomers.filter(c => c.hasCredit).length,
    installment: enrichedCustomers.filter(c => c.hasInstallment).length,
    online: enrichedCustomers.filter(c => c.purchaseType === 'online').length,
    walkin: enrichedCustomers.filter(c => c.purchaseType === 'in-store').length,
  }), [enrichedCustomers]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      const updatedCustomers = allCustomers.filter(c => c.id !== id);
      setAllCustomers(updatedCustomers);
      
    
      if (paginatedCustomers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleView = (c: typeof enrichedCustomers[0]) => {
    router.push(`/customers/${c.id}`);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditForm({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
    });
    setEditDialogOpen(true);
  };

  const handleUpdateCustomer = () => {
    if (!editingCustomer) return;
    
    const updatedCustomers = allCustomers.map(c => 
      c.id === editingCustomer.id 
        ? { 
            ...c, 
            name: editForm.name, 
            email: editForm.email || undefined, 
            phone: editForm.phone || undefined 
          }
        : c
    );
    
    setAllCustomers(updatedCustomers);
    
    const allTxns = JSON.parse(localStorage.getItem('pos_transactions') || '[]');
    const updatedTxns = allTxns.map((txn: Transaction) => 
      txn.customer?.id === editingCustomer.id
        ? { ...txn, customer: { ...txn.customer, ...editForm } }
        : txn
    );
    localStorage.setItem('pos_transactions', JSON.stringify(updatedTxns));
    
    setEditDialogOpen(false);
    setEditingCustomer(null);
  };

  const handleAddCustomer = () => {
    if (!addForm.name.trim()) {
      alert('Customer name is required');
      return;
    }

    const newId = `cust-${Date.now()}`;
    const newCustomer: Customer = {
      id: newId,
      name: addForm.name,
      email: addForm.email || undefined,
      phone: addForm.phone || undefined,
    };

    const updatedCustomers = [...allCustomers, newCustomer];
    setAllCustomers(updatedCustomers);
    
    setAddForm({
      name: '',
      email: '',
      phone: '',
    });
    setDialogOpen(false);
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pageNumbers.map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <InventoryLayout>
      <div className="p-4 md:p-6 space-y-6 text-gray-900">
        <div className='flex md:flex-row flex-col gap-2 md:gap-0 justify-between'>
          <div>
            <h1 className="text-2xl font-bold">Customer Management</h1>
            <p className="text-sm text-muted-foreground">View and manage all customers</p> 
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Enter customer information
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={addForm.name}
                    onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                    placeholder="Enter customer name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({...addForm, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setAddForm({ name: '', email: '', phone: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gray-100 hover:gray-200 text-gray-900"
                  onClick={handleAddCustomer}
                >
                  Add Customer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Customers" value={stats.total} icon={<Users />} />
          <StatCard title="Credit Customers" value={stats.credit} icon={<CreditCard />} />
          <StatCard title="Installments" value={stats.installment} icon={<ShoppingBag />} />
          <StatCard title="Online Customers" value={stats.online} icon={<Globe />} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Tabs
              value={filter}
              onValueChange={(value) => {
                if (FILTER_VALUES.includes(value as CustomerFilter)) {
                  setFilter(value as CustomerFilter);
                }
              }}
              className='h-15 bg-gray-900 sm:h-10'
            >
              <TabsList className="flex flex-wrap bg-gray-900 text-white w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="credit">Credits</TabsTrigger>
                <TabsTrigger value="installment">Installments</TabsTrigger>
                <TabsTrigger value="online">Online</TabsTrigger>
                <TabsTrigger value="in-store">In-Store</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 bg-gray-800 text-gray-900 border-gray-700 focus:border-blue-500"
            />
          </div>
        </div>

        <Card className='bg-gray-900'>
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>
              Customers ({filteredCustomers.length})
              {searchQuery && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  matching &quot;{searchQuery}&quot;
                </span>
              )}
            </CardTitle>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="hidden sm:flex">
                  {renderPaginationButtons()}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Purchases</th>
                  <th className="p-3 text-left">Revenue</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map(c => (
                    <tr key={c.id} className="border-b hover:bg-gray-800/50">
                      <td className="p-3 font-medium">{c.name}</td>
                      <td className="p-3">
                        <div>{c.email ?? '—'}</div>
                        <div className="text-xs text-muted-foreground">{c.phone ?? ''}</div>
                      </td>
                      <td className="p-3 capitalize">{c.purchaseType}</td>
                      <td className="p-3 flex gap-2 flex-wrap">
                        {c.hasCredit && <Badge variant="secondary">Credit</Badge>}
                        {c.hasInstallment && <Badge className="bg-teal-100 text-teal-700">Installment</Badge>}
                        {!c.hasCredit && !c.hasInstallment && <Badge variant="outline">Normal</Badge>}
                      </td>
                      <td className="p-3 text-center">{c.totalPurchases}</td>
                      <td className="p-3 text-center">NGN {c.totalRevenue}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleView(c)}>
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>
                          
                          {c.id !== 'walk-in' && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleEdit(c)}>
                                <Pencil className="w-4 h-4 mr-1" /> Edit
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>
                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-muted-foreground">
                      {searchQuery ? `No customers found matching "${searchQuery}"` : 'No customers found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCustomers.length)} of {filteredCustomers.length} customers
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="sm:hidden">
                    {renderPaginationButtons()}
                  </div>
                  <div className="hidden sm:flex">
                    {renderPaginationButtons()}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm text-muted-foreground">Show:</span>
                    <select
                      value={ITEMS_PER_PAGE}
                      onChange={(e) => {
                        // You can make ITEMS_PER_PAGE stateful if you want dynamic page size
                        console.log('Items per page:', e.target.value);
                      }}
                      className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-gray-900 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                placeholder="Enter customer name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setEditingCustomer(null);
              }}
            >
              Cancel
            </Button>
            <Button
             className="bg-gray-100 hover:gray-200 text-gray-900"
              onClick={handleUpdateCustomer}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </InventoryLayout>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className='bg-white text-gray-900 border border-gray-100 shadow-2xl'>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="text-xl font-bold">{value}</div>
        </div>
        <div className="p-2 rounded-lg bg-gray-100">{icon}</div>
      </CardContent>
    </Card>
  );
}