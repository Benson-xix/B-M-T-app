'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { AuthForm } from '@/app/components/AuthForm';
import { mockLoginAdmin as loginAdmin } from "@/app/mock/auth";

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const { admin_id, admin_email } = await loginAdmin(values);
      router.push(`/auth/verify-otp?admin_id=${admin_id}&purpose=login&email=${admin_email}`);
    } catch (err) {
      console.error('Login error:', err);
    }
    setLoading(false);
  }

  return (
    <AuthForm 
      title="Admin Login" 
      description="Sign in to access the control dashboard"
      footer={
        <div className="space-y-4">
          <div className="text-center">
            <Link 
              href="/auth/forgot-password" 
              className="text-green-400 hover:text-green-400 hover:underline transition-colors text-sm"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="text-center text-gray-400 text-sm">
            Don&apos;t have an account?{' '}
            <Link 
              href="/auth/register" 
              className="text-green-400 hover:text-green-400 hover:underline transition-colors font-medium"
            >
              Request Access
            </Link>
          </div>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField 
            control={form.control} 
            name="email" 
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm font-medium tracking-wide">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <Input 
                      type="email" 
                      placeholder="admin@bigmentransaction.com" 
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
            name="password" 
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm font-medium tracking-wide">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      className="bg-gray-900/50 border-gray-700 text-white pl-10 h-11 rounded-lg focus:border-green-400 focus:ring-green-400/20"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )} 
          />
          
          <Button 
            type="submit" 
            className="w-full bg-green-400 hover:bg-green-400 text-black font-bold h-11 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl shadow-green-400/20"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login to Dashboard
              </span>
            )}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
}