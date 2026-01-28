import { Expense, ExpenseCategory } from "@/app/utils/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle, Eye, Receipt, Search, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import { format, parseISO} from 'date-fns';


export function ExpensesTable({ 
  expenses, 
  categories, 
  onDelete, 
  onViewInvoice,
  onApprove,
  onReject
}: { 
  expenses: Expense[]; 
  categories: ExpenseCategory[]; 
  onDelete: (id: string) => void;
  onViewInvoice: (expense: Expense) => void;
  onApprove: (id: string) => void;
    onReject: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.name.toLowerCase().includes(search.toLowerCase()) ||
                         expense.note?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    const matchesMonth = monthFilter === 'all' || expense.month === monthFilter;
    
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

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
    <Card className="border border-gray-200 bg-gray-900">
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <CardTitle>All Expenses</CardTitle>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                <SelectItem value="Jan 2024">January 2024</SelectItem>
                <SelectItem value="Feb 2024">February 2024</SelectItem>
                <SelectItem value="Mar 2024">March 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expense Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExpenses.map(expense => {
                const category = categories.find(c => c.id === expense.categoryId);
                return (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{expense.name}</p>
                        {expense.note && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">{expense.note}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{category?.name || 'Uncategorized'}</Badge>
                    </TableCell>
                    <TableCell className="font-bold">
                      NGN {expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                    <TableCell>{expense.createdBy}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(parseISO(expense.expenseDate), 'MMM dd, yyyy')}</p>
                        <p className="text-gray-500">{expense.month}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {expense.receiptUrl ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(expense.receiptUrl, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      ) : (
                        <span className="text-gray-400">No receipt</span>
                      )}
                    </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 flex-wrap">
                        
                        {expense.status === 'pending' && (
                        <>
                            <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => onApprove(expense.id)}
                            >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                            </Button>

                            <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onReject(expense.id)}
                            >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                            </Button>
                        </>
                        )}

                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewInvoice(expense)}
                        >
                        <Receipt className="w-4 h-4 mr-1" />
                        Invoice
                        </Button>

                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(expense.id)}
                        >
                        <Trash2 className="w-4 h-4" />
                        </Button>

                    </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
      
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length} expenses
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}