'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Calendar, 
  Clock, 
  Key, 
  Pencil, 
  Save, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { InventoryLayout } from '@/app/inventory/components/InventoryLayout';
import { format } from 'date-fns';

type Staff = {
  id: string;
  firstName: string;
  lastName: string;
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
};

export default function StaffDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCredentialDialogOpen, setIsCredentialDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    role: '',
  });
  const [credentialForm, setCredentialForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [roles] = useState<Role[]>([
    { id: 'role-1', name: 'Administrator', permissions: ['all'] },
    { id: 'role-2', name: 'Manager', permissions: ['products', 'sales', 'customers'] },
    { id: 'role-3', name: 'Sales Staff', permissions: ['sales', 'customers'] },
    { id: 'role-4', name: 'Inventory Manager', permissions: ['products', 'stock'] },
  ]);

  useEffect(() => {

    const mockStaff: Staff = {
      id: params.id as string,
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@business.com',
      phone: '+234 123 456 7890',
      address: '123 Business Street, Victoria Island',
      state: 'Lagos',
      role: 'Administrator',
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-15 10:30:00',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    };
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStaff(mockStaff);
    setEditForm({
      firstName: mockStaff.firstName,
      lastName: mockStaff.lastName,
      email: mockStaff.email,
      phone: mockStaff.phone,
      address: mockStaff.address,
      state: mockStaff.state,
      role: mockStaff.role,
    });
    setCredentialForm({
      email: mockStaff.email,
      password: '',
      confirmPassword: '',
    });
    setLoading(false);
  }, [params.id]);

  const handleEditSave = () => {
    if (!staff) return;
    

    const updatedStaff = {
      ...staff,
      ...editForm,
    };
    
    setStaff(updatedStaff);
    setIsEditDialogOpen(false);
    alert('Staff details updated successfully!');
  };

  const handleCredentialSave = () => {
    if (!credentialForm.password) {
      alert('Please enter a new password');
      return;
    }
    
    if (credentialForm.password !== credentialForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (credentialForm.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    

    if (staff) {
      const updatedStaff = {
        ...staff,
        email: credentialForm.email,
      };
      setStaff(updatedStaff);
    }
    
    alert('Login credentials updated successfully!');
    setIsCredentialDialogOpen(false);
    setCredentialForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
  };

  const getStatusBadge = (status: 'active' | 'inactive') => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Administrator':
        return <Badge variant="default">{role}</Badge>;
      case 'Manager':
        return <Badge variant="secondary">{role}</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (loading) {
    return (
      <InventoryLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">Loading staff details...</div>
        </div>
      </InventoryLayout>
    );
  }

  if (!staff) {
    return (
      <InventoryLayout>
        <div className="p-6">
          <div className="text-center">Staff not found</div>
        </div>
      </InventoryLayout>
    );
  }

  return (
    <InventoryLayout>
      <div className="p-4 md:p-6 space-y-6 bg-white text-gray-900">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="link" className='text-gray-900' size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Staff Details</h1>
              <p className="text-sm text-gray-500">
                View and manage {staff.firstName} {staff.lastName}&apos;s information
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-gray-900">
                <DialogHeader>
                  <DialogTitle>Edit Staff Details</DialogTitle>
                  <DialogDescription>
                    Update staff personal information
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-firstName">First Name</Label>
                      <Input
                        id="edit-firstName"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-lastName">Last Name</Label>
                      <Input
                        id="edit-lastName"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email Address</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone">Phone Number</Label>
                      <Input
                        id="edit-phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-address">Address</Label>
                      <Input
                        id="edit-address"
                        value={editForm.address}
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-state">State</Label>
                      <Input
                        id="edit-state"
                        value={editForm.state}
                        onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select value={editForm.role} onValueChange={(value) => setEditForm({...editForm, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditSave} className="bg-gray-100 hover:bg-gray-200 text-gray-900">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isCredentialDialogOpen} onOpenChange={setIsCredentialDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Key className="w-4 h-4 mr-2" />
                  Update Credentials
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-gray-900">
                <DialogHeader>
                  <DialogTitle>Update Login Credentials</DialogTitle>
                  <DialogDescription>
                    Change staff email and password
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <Alert className="bg-yellow-50 border-green-200">
                    <AlertDescription className="text-green-800 text-sm">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      Staff will need to use new credentials for next login
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cred-email">Email Address</Label>
                    <Input
                      id="cred-email"
                      type="email"
                      value={credentialForm.email}
                      onChange={(e) => setCredentialForm({...credentialForm, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cred-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="cred-password"
                        type={showPassword ? "text" : "password"}
                        value={credentialForm.password}
                        onChange={(e) => setCredentialForm({...credentialForm, password: e.target.value})}
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cred-confirm">Confirm New Password</Label>
                    <Input
                      id="cred-confirm"
                      type={showPassword ? "text" : "password"}
                      value={credentialForm.confirmPassword}
                      onChange={(e) => setCredentialForm({...credentialForm, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCredentialDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCredentialSave} className="bg-gray-100 hover:bg-gray-200 text-gray-800">
                    <Key className="w-4 h-4 mr-2" />
                    Update Credentials
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-1">
            <Card className="border border-gray-200 bg-gray-100  text-gray-900">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={staff.avatar} />
                    <AvatarFallback className="text-2xl">
                      {staff.firstName[0]}{staff.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-bold">{staff.firstName} {staff.lastName}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    {getRoleBadge(staff.role)}
                    {getStatusBadge(staff.status)}
                  </div>
                  
                  <div className="mt-6 space-y-4 w-full">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium">Username</p>
                        <p className="text-sm text-gray-600 font-mono">{staff.username}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-gray-600">{staff.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-gray-600">{staff.phone || 'Not set'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-gray-600">{staff.state || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
 
            <Card className="border border-gray-200 bg-gray-100 text-gray-900 mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Joined Date</span>
                    </div>
                    <span className="text-sm font-medium">
                      {format(new Date(staff.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Last Login</span>
                    </div>
                    <span className="text-sm font-medium">
                      {staff.lastLogin ? format(new Date(staff.lastLogin), 'MMM dd, yyyy HH:mm') : 'Never'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


          <div className="lg:col-span-2">
            <Card className="border border-gray-200 bg-gray-100 text-gray-900">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Detailed information about the staff member
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-500">Full Name</Label>
                      <p className="font-medium">{staff.firstName} {staff.lastName}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-gray-500">Email Address</Label>
                      <p className="font-medium">{staff.email}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-gray-500">Phone Number</Label>
                      <p className="font-medium">{staff.phone || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-gray-500">Username</Label>
                      <p className="font-medium font-mono">{staff.username}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-500">Address</Label>
                      <p className="font-medium">{staff.address || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-gray-500">State</Label>
                      <p className="font-medium">{staff.state || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-gray-500">Role</Label>
                      <div className="mt-1">{getRoleBadge(staff.role)}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-gray-500">Account Status</Label>
                      <div className="mt-1">{getStatusBadge(staff.status)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


            <Card className="border border-gray-200 bg-gray-100 text-gray-900 mt-6">
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>
                  Permissions assigned to {staff.role} role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-900 text-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3">Assigned Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                      {roles
                        .find(r => r.name === staff.role)
                        ?.permissions.map((permission, index) => (
                          <Badge key={index} variant="outline" className="bg-white text-gray-900">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  
                  <Alert className="bg-yellow-50 border-green-200">
                    <AlertDescription className="text-green-800">
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Permissions are managed through the role. To change permissions, edit the role in Settings.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

         
            <Card className="border border-gray-200 bg-gray-100 text-gray-900 mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="secondary"
                    className="h-auto py-4 flex flex-col items-center justify-center"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <Pencil className="w-6 h-6 mb-2" />
                    <span>Edit Details</span>
                    <span className="text-xs text-gray-500 mt-1">Update personal information</span>
                  </Button>
                  
                  <Button
                    variant="secondary"
                    className="h-auto py-4 flex flex-col items-center justify-center"
                    onClick={() => setIsCredentialDialogOpen(true)}
                  >
                    <Key className="w-6 h-6 mb-2" />
                    <span>Update Credentials</span>
                    <span className="text-xs text-gray-500 mt-1">Change email or password</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </InventoryLayout>
  );
}