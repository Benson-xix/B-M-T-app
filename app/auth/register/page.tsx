'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AuthForm } from '@/app/components/AuthForm';
import { mockRegisterAdmin as registerAdmin } from "@/app/mock/auth";
import Link from 'next/link';

const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { full_name: '', email: '', password: '' },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    try {
      const { admin_id } = await registerAdmin(values);
      router.push(`/auth/verify-otp?admin_id=${admin_id}&purpose=register&email=${values.email}`);
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm 
      title="Request Access" 
      description="Register for administrator privileges"
      footer={
        <div className="text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link 
            href="/auth/login" 
            className="text-green-400 hover:text-green-400 hover:underline transition-colors font-medium"
          >
            Sign In
          </Link>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField 
            control={form.control} 
            name="full_name" 
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm font-medium tracking-wide">Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <Input 
                      placeholder="John Smith" 
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
            name="email" 
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm font-medium tracking-wide">Work Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <Input 
                      type="email" 
                      placeholder="john.smith@bigmentransaction.com" 
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
                <FormLabel className="text-white text-sm font-medium tracking-wide">Secure Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <Input 
                      type="password" 
                      placeholder="Minimum 8 characters" 
                      className="bg-gray-900/50 border-gray-700 text-white pl-10 h-11 rounded-lg focus:border-green-400 focus:ring-green-400/20"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <div className="text-gray-500 text-xs mt-1">
                  • Must be at least 8 characters
                </div>
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
                Processing Request...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Request Administrator Access
              </span>
            )}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
}