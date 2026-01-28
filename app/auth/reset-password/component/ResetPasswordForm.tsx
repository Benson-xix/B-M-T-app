'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AuthForm } from '@/app/components/AuthForm';
import { mockResetPassword } from '@/app/mock/auth';

const resetSchema = z.object({
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const admin_id = searchParams.get('admin_id') || ''; 
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { new_password: '', confirm_password: '' },
  });

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    setLoading(true);
    try {
      await mockResetPassword({ admin_id, new_password: values.new_password });
      router.push('/auth/login');
    } catch (err) {
      console.error('Reset password error:', err);
    }
    setLoading(false);
  }

  return (
    <AuthForm 
      title="Set New Password" 
      description="Create a strong new password for your account"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField 
            control={form.control} 
            name="new_password" 
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm font-medium tracking-wide">New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <Input 
                      type="password" 
                      placeholder="Enter new password" 
                      className="bg-gray-900/50 border-gray-700 text-white pl-10 h-11 rounded-lg focus:border-green-400 focus:ring-green-400/20"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="confirm_password" 
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm font-medium tracking-wide">Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <Input 
                      type="password" 
                      placeholder="Confirm new password" 
                      className="bg-gray-900/50 border-gray-700 text-white pl-10 h-11 rounded-lg focus:border-green-400 focus:ring-green-400/20"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )} 
          />
          
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
            <h4 className="text-green-400 text-sm font-medium mb-2">Password Requirements:</h4>
            <ul className="text-gray-400 text-xs space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400/50 rounded-full"></div>
                Minimum 8 characters
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400/50 rounded-full"></div>
                Use uppercase & lowercase letters
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400/50 rounded-full"></div>
                Include numbers and special characters
              </li>
            </ul>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-green-400 hover:bg-green-400 text-black font-bold h-11 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl shadow-green-400/20"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Updating Password...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Update Password
              </span>
            )}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
}