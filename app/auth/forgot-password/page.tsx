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


// async function forgotPassword(data: { email: string }) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/forgot-password`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// }

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
    <AuthForm title="Forgot Password" description="Enter your email to reset password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl><Input type="email" placeholder="admin@example.com" className="bg-black/50 border-yellow-300/50 text-white placeholder:text-muted" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" className="w-full bg-yellow-300 text-black hover:bg-yellow-300-hover" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset OTP'}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
}