'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { toast } from 'sonner';
import { AuthForm } from '@/app/components/AuthForm';
import { mockVerifyOtp as verifyOtp } from "@/app/mock/auth";

// async function verifyOtp(data: { admin_id: string; otp: string; purpose: string }) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/verify-otp`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// }

async function resendOtp(email: string, purpose: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, purpose }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const admin_id = searchParams.get('admin_id') || '';
  const purpose = searchParams.get('purpose') || '';
  const email = searchParams.get('email') || '';
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  async function onSubmit(values: z.infer<typeof otpSchema>) {
    setLoading(true);
    try {
      const { token } = await verifyOtp({ admin_id, otp: values.otp, purpose });
      
      localStorage.setItem('adminToken', token);
      router.push('/dashboard'); 
    } catch (err) {
        console.error('OTP verification error:', err);
    }
    setLoading(false);
  }

  async function handleResend() {
    setResendLoading(true);
    try {
      await resendOtp(email, purpose);
      toast.success('OTP resent!');
    } catch (err) {
        console.error('Resend OTP error:', err);
      toast.error('Failed to resend OTP.');
    }
    setResendLoading(false);
  }

  return (
    <AuthForm title="Verify OTP" description={`Enter the OTP sent to ${email}`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="otp" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">OTP Code</FormLabel>
              <FormControl><Input placeholder="123456" className="bg-black/50 border-yellow-300/50 text-white placeholder:text-muted" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" className="w-full bg-yellow-300 text-black hover:bg-yellow-300-hover" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </form>
      </Form>
      <Button variant="link" className="text-yellow-300" onClick={handleResend} disabled={resendLoading}>
        {resendLoading ? 'Resending...' : 'Resend OTP'}
      </Button>
    </AuthForm>
  );
}