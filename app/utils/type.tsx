export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  attributes: Record<string, string>;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  threshold: number;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  description: string;
  taxable: boolean;
  unit: string;
  hasVariations: boolean;
  images: string[];
  variants: ProductVariant[];
  inventoryValue: number;
  inventoryCost: number;
  totalStock: number;
  totalRevenue: number;
    discount?: Discount;
}

export interface ProductFormData {
  productName: string;
  brand: string;
  category: string;
  unit: string;
  baseSku: string;
  taxable: boolean;
  description: string;
  images: string[];
  hasVariations: boolean;
  attributes: ProductAttribute[];
  variations: ProductVariant[];
}


export type EditProductFormData = {
  name: string;
  brand: string;
  category: string;
  description: string;
  taxable: boolean;
  unit: string;
  hasVariations: boolean;
};

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  price: number;
  quantity: number;
  taxable: boolean;
  image: string;
  stock: number;
  productDiscount?: Discount;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Draft {
  id: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  timestamp: string;
}


export interface InstallmentPayment {
  paymentNumber: number;
  amount: number;
  date?: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  type?: 'down_payment' | 'installment';
  method?: string;
  notes?: string;
}


export interface InstallmentPlan {
  numberOfPayments: number;
  amountPerPayment: number;
  paymentFrequency: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate?: string;
  notes: string;
  downPayment: number;
  remainingBalance: number;
  payments: InstallmentPayment[];
  interestRate?: number;
  lateFee?: number;
}

export interface Transaction {
  id: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  taxRate: number;  
  tax: number;
  total: number;
  totalDiscount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'split' | 'installment' | 'credit';
  amountPaid: number;
  change: number;
  timestamp: string;
  synced: boolean;
  purchaseType?: 'in-store' | 'online';
  installmentPlan?: InstallmentPlan;
  splitPayments?: { method: string; amount: number }[];
  credit?:  {
  waived: true;
  issuedAt: string;
    creditType: 'full' | 'partial';
    creditBalance: number; 
    amountPaidTowardCredit: number; 
}
}

export interface InstallmentTransaction {
  id: string;
  planId: string;
  paymentNumber: number;
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  amountPaid: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  paymentFrequency: 'daily' | 'weekly' | 'monthly';
  numberOfPayments: number;
  amountPerPayment: number;
  downPayment: number;
  remainingBalanceAfter: number;
  timestamp: string;
}

export const customers: Customer[] = [
  { id: 'walk-in', name: 'Walk-in Customer' },
  { id: 'cust-1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
  { id: 'cust-2', name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321' },
  { id: 'cust-3', name: 'Robert Johnson', email: 'robert@example.com', phone: '+1122334455' },
];

export type Expense = {
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

export type ExpenseCategory = {
  id: string;
  name: string;
};

export type TimeFilter = 'today' | 'yesterday' | 'this-week' | 'this-month' | 'custom';

export const loginAttempts = [
            {
              id: 'login-1',
              email: 'admin@business.com',
              device: 'Chrome on Windows',
              location: 'Lagos, Nigeria',
              time: '2024-01-15 10:30:00',
              approvedBy: 'System',
              status: 'approved' as const,
            },
            {
              id: 'login-2',
              email: 'manager@business.com',
              device: 'Safari on iPhone',
              location: 'Abuja, Nigeria',
              time: '2024-01-15 09:15:00',
              approvedBy: 'Admin',
              status: 'approved' as const,
            },
            {
              id: 'login-3',
              email: 'sales@business.com',
              device: 'Firefox on Windows',
              location: 'Unknown',
              time: '2024-01-15 08:45:00',
              approvedBy: '-',
              status: 'pending' as const,
            },
            {
              id: 'login-4',
              email: 'john.doe@business.com',
              device: 'Chrome on Android',
              location: 'Port Harcourt, Nigeria',
              time: '2024-01-14 22:10:00',
              approvedBy: 'System',
              status: 'approved' as const,
            },
            {
              id: 'login-5',
              email: 'unknown@email.com',
              device: 'Unknown',
              location: 'Unknown',
              time: '2024-01-14 03:45:00',
              approvedBy: '-',
              status: 'rejected' as const,
            },
            {
              id: 'login-6',
              email: 'inventory@business.com',
              device: 'Edge on Windows',
              location: 'Ibadan, Nigeria',
              time: '2024-01-14 14:20:00',
              approvedBy: 'Manager',
              status: 'approved' as const,
            },
            {
              id: 'login-7',
              email: 'test@business.com',
              device: 'Chrome on Mac',
              location: 'Lagos, Nigeria',
              time: '2024-01-13 11:05:00',
              approvedBy: '-',
              status: 'pending' as const,
            },
            {
              id: 'login-8',
              email: 'finance@business.com',
              device: 'Safari on Mac',
              location: 'Abuja, Nigeria',
              time: '2024-01-13 09:30:00',
              approvedBy: 'Admin',
              status: 'approved' as const,
            },
          ];

export type DiscountType = "percentage" | "fixed";
export  type DiscountStatus = "active" | "expired";

export type Discount = {
  id: string;
  name: string;
  type: DiscountType;
  value: number;
  startDate?: string;
  endDate?: string;
  status: DiscountStatus;
};

