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
import { mockForgotPassword } from '@/app/mock/auth';
import Link from 'next/link';

const forgotSchema = z.object({
  email: z.string().email('Invalid email'),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: z.infer<typeof forgotSchema>) {
    setLoading(true);
    try {
      const { admin_id } = await mockForgotPassword(values);
      router.push(`/auth/verify-otp?admin_id=${admin_id}&purpose=reset_password&email=${values.email}`);
    } catch (err) {
      console.error('Forgot password error:', err);
    }
    setLoading(false);
  }

  return (
    <AuthForm 
      title="Reset Password" 
      description="Enter your email to receive a verification code"
      footer={
        <div className="text-center text-gray-400 text-sm">
          Remember your password?{' '}
          <Link 
            href="/auth/login" 
            className="text-green-400 hover:text-green-400 hover:underline transition-colors font-medium"
          >
            Back to Login
          </Link>
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
                <FormLabel className="text-white text-sm font-medium tracking-wide">Account Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <Input 
                      type="email" 
                      placeholder="Enter your registered email" 
                      className="bg-gray-900/50 border-gray-700 text-white pl-10 h-11 rounded-lg focus:border-green-400 focus:ring-green-400/20"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <div className="text-gray-500 text-xs mt-1">
                  • We&apos;ll send a 6-digit OTP to this email
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
                Sending Code...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Verification Code
              </span>
            )}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
}