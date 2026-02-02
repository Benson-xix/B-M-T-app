
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, UserPlus, Eye, Trash2, Mail, Phone, MapPin, Key, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { InventoryLayout } from '../inventory/components/InventoryLayout';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Staff = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
};

type Role = {
  id: string;
  name: string;
  permissions: string[];
  userCount: number;
};

export default function StaffPage() {
  const router = useRouter();
  const [staffs, setStaffs] = useState<Staff[]>([
    {
      id: 'staff-1',
      full_name: 'John Doe',
      username: 'johndoe',
      email: 'john@business.com',
      phone: '+234 123 456 7890',
      address: '123 Business Street',
      state: 'Lagos',
      role: 'Administrator',
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-15 10:30 AM',
    },
    {
      id: 'staff-2',
      full_name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@business.com',
      phone: '+234 098 765 4321',
      address: '456 Office Avenue',
      state: 'Abuja',
      role: 'Manager',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-01-14 02:15 PM',
    },
    {
      id: 'staff-3',
      full_name: 'Robert Johnson',
      username: 'robertj',
      email: 'robert@business.com',
      phone: '+234 112 233 4455',
      address: '789 Work Road',
      state: 'Port Harcourt',
      role: 'Sales Staff',
      status: 'active',
      createdAt: '2024-02-01',
      lastLogin: '2024-01-16 09:45 AM',
    },
    {
      id: 'staff-4',
      full_name: 'Sarah Williams',
      username: 'sarahw',
      email: 'sarah@business.com',
      phone: '+234 556 677 8899',
      address: '321 Job Lane',
      state: 'Ibadan',
      role: 'Sales Staff',
      status: 'inactive',
      createdAt: '2024-02-10',
    },
  ]);

  const [roles, setRoles] = useState<Role[]>([
    { id: 'role-1', name: 'Administrator', permissions: ['all'], userCount: 1 },
    { id: 'role-2', name: 'Manager', permissions: ['products', 'sales', 'customers'], userCount: 3 },
    { id: 'role-3', name: 'Sales Staff', permissions: ['sales', 'customers'], userCount: 5 },
    { id: 'role-4', name: 'Inventory Manager', permissions: ['products', 'stock'], userCount: 2 },
  ]);


  const ITEMS_PER_PAGE = 5;

const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil(staffs.length / ITEMS_PER_PAGE);

const paginatedStaffs = staffs.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    full_name: '',  
    email: '',
    phone: '',
    address: '',
    state: '',
    role: '',
    generatePassword: true,
    customPassword: '',
    sendCredentials: true,
  });

  const [generatedUsername, setGeneratedUsername] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedUsername, setCopiedUsername] = useState(false);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

 
  const generateUsername = (firstName: string, lastName: string) => {
    const baseUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    let username = baseUsername;
    let counter = 1;
    
  
    while (staffs.some(staff => staff.username === username)) {
      username = `${baseUsername}${counter}`;
      counter++;
    }
    
    return username;
  };

const handleInputChange = (field: string, value: string) => {
  setNewStaff(prev => ({ ...prev, [field]: value }));
  
  
  if (field === 'full_name' && value.trim()) {
    const nameParts = value.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1] || '';
    const username = generateUsername(firstName, lastName);
    setGeneratedUsername(username);
  }
};
 
  const handleAddStaff = () => {
    if (!newStaff.full_name || !newStaff.email || !newStaff.role) {
      toast('Please fill in all required fields');
      return;
    }

    const finalPassword = newStaff.generatePassword ? generatedPassword : newStaff.customPassword;
    if (!finalPassword) {
      toast('Please set a password for the staff');
      return;
    }

    const newStaffObj: Staff = {
      id: `staff-${Date.now()}`,
      full_name: newStaff.full_name,
      username: generatedUsername,
      email: newStaff.email,
      phone: newStaff.phone,
      address: newStaff.address,
      state: newStaff.state,
      role: newStaff.role,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setStaffs([...staffs, newStaffObj]);
    
 
    setRoles(roles.map(role => 
      role.name === newStaff.role 
        ? { ...role, userCount: role.userCount + 1 }
        : role
    ));

 
    setNewStaff({
      full_name: '',
      email: '',
      phone: '',
      address: '',
      state: '',
      role: '',
      generatePassword: true,
      customPassword: '',
      sendCredentials: true,
    });
    setGeneratedUsername('');
    setGeneratedPassword('');
    setIsAddDialogOpen(false);
    setCurrentPage(1);

  
    if (newStaff.sendCredentials) {
      toast(`Staff created successfully!\n\nCredentials:\nUsername: ${generatedUsername}\nPassword: ${finalPassword}\n\nPlease share these credentials with the staff member.`);
    } else {
      toast('Staff created successfully!');
    }
  };

 
  const handleDeleteStaff = (id: string) => {
    const staff = staffs.find(s => s.id === id);
    if (!staff) return;
    
    if (confirm(`Are you sure you want to delete ${staff.full_name}?`)) {
    
      setRoles(roles.map(role => 
        role.name === staff.role 
          ? { ...role, userCount: Math.max(0, role.userCount - 1) }
          : role
      ));
      
     setStaffs(prev => {
  const updated = prev.filter(staff => staff.id !== id);

  const newTotalPages = Math.ceil(updated.length / ITEMS_PER_PAGE);
  if (currentPage > newTotalPages) {
    setCurrentPage(Math.max(1, newTotalPages));
  }

  return updated;
});
    }
  };


  const handleViewStaff = (id: string) => {
    router.push(`/staffs/${id}`);
  };


  const copyToClipboard = (text: string, type: 'username' | 'password') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'username') {
        setCopiedUsername(true);
        setTimeout(() => setCopiedUsername(false), 2000);
      } else {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
      }
    });
  };


  const totalStaffs = staffs.length;
 

  return (
    <InventoryLayout>
      <div className="p-4 md:p-6 space-y-6 bg-white text-gray-900">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Staff Management</h1>
            <p className="text-sm text-gray-500">Manage your staff members and their roles</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                  Enter staff details and set up their login credentials
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={newStaff.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@business.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newStaff.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+234 123 456 7890"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newStaff.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Business Street"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={newStaff.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Lagos"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <Select value={newStaff.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name} ({role.userCount} users)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {newStaff.role && (
                    <div className="mt-2 p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium mb-1">Role Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {roles
                          .find(r => r.name === newStaff.role)
                          ?.permissions.map((perm, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
         
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Login Credentials</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <div className="flex gap-2">
                        <Input
                          value={generatedUsername}
                          readOnly
                          className="bg-gray-50"
                          placeholder="Will be auto-generated"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(generatedUsername, 'username')}
                          disabled={!generatedUsername}
                        >
                          {copiedUsername ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Auto-generated from first and last name
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="generate-password"
                            checked={newStaff.generatePassword}
                            onChange={() => setNewStaff({...newStaff, generatePassword: true, customPassword: ''})}
                            className="rounded-full"
                          />
                          <Label htmlFor="generate-password" className="text-sm">
                            Generate random password
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="custom-password"
                            checked={!newStaff.generatePassword}
                            onChange={() => setNewStaff({...newStaff, generatePassword: false})}
                            className="rounded-full"
                          />
                          <Label htmlFor="custom-password" className="text-sm">
                            Set custom password
                          </Label>
                        </div>
                        
                        {newStaff.generatePassword ? (
                          <div className="flex gap-2 mt-2">
                            <Input
                              value={generatedPassword}
                              readOnly
                              className="bg-gray-50 font-mono"
                              type="password"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(generatedPassword, 'password')}
                              disabled={!generatedPassword}
                            >
                              {copiedPassword ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <Input
                            type="password"
                            value={newStaff.customPassword}
                            onChange={(e) => handleInputChange('customPassword', e.target.value)}
                            placeholder="Enter custom password"
                            className="mt-2"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="send-credentials"
                      checked={newStaff.sendCredentials}
                      onChange={(e) => setNewStaff({...newStaff, sendCredentials: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="send-credentials" className="text-sm">
                      Send login credentials to staff email
                    </Label>
                  </div>
                  
                  {newStaff.sendCredentials && (
                    <Alert className="bg-yellow-50 border-green-200">
                      <AlertDescription className="text-green-800 text-sm">
                        <AlertCircle className="w-4 h-4 inline mr-2" />
                        An email with login credentials will be sent to {newStaff.email || 'the staff email'}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewStaff({
                      full_name: '',
                      email: '',
                      phone: '',
                      address: '',
                      state: '',
                      role: '',
                      generatePassword: true,
                      customPassword: '',
                      sendCredentials: true,
                    });
                    setGeneratedUsername('');
                    setGeneratedPassword('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddStaff}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                >
                  Add Staff Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Staff"
            value={totalStaffs.toString()}
            icon={<Users className="w-5 h-5" />}
            description="All staff members"
          />
        </div>

  
        <Card className="border border-gray-200 bg-gray-900">
          <CardHeader>
            <CardTitle>Staff List ({staffs.length} members)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStaffs.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={staff.avatar} />
                            <AvatarFallback>
                              {staff.full_name.split(' ')[0][0]}{staff.full_name.split(' ')[1][0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{staff.full_name}</p>
                            <p className="text-sm text-gray-500">{staff.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{staff.username}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {staff.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="w-3 h-3" />
                            {staff.phone || 'Not set'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{staff.address || 'Not set'}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {staff.state || 'Not set'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          staff.role === 'Administrator' ? 'default' : 
                          staff.role === 'Manager' ? 'secondary' : 'outline'
                        }>
                          {staff.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          staff.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }>
                          {staff.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewStaff(staff.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={staff.role === 'Administrator'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="sm:flex sm:items-center sm:justify-between grid grid-cols-1 gap-2 mt-4 px-2">
  <p className="text-sm text-gray-400">
    Page {currentPage} of {totalPages}
  </p>

  <div className="flex gap-2">
    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
    >
      Previous
    </Button>

    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
    >
      Next
    </Button>
  </div>
</div>

            </div>
          </CardContent>
        </Card>
      </div>
    </InventoryLayout>
  );
}


function KPICard({ 
  title, 
  value, 
  icon, 
  description 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card className="border border-gray-200 bg-gray-100 text-gray-900 shadow-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="text-green-500">{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}