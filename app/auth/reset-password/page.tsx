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


// async function resetPassword(data: { admin_id: string; new_password: string }) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/reset-password`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// }

const resetSchema = z.object({
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export default function ResetPasswordPage() {
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
    <AuthForm title="Reset Password" description="Enter your new password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="new_password" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">New Password</FormLabel>
              <FormControl><Input type="password" placeholder="********" className="bg-black/50 border-yellow-300/50 text-white placeholder:text-muted" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="confirm_password" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Confirm Password</FormLabel>
              <FormControl><Input type="password" placeholder="********" className="bg-black/50 border-yellow-300/50 text-white placeholder:text-muted" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" className="w-full bg-yellow-300 text-black hover:bg-yellow-300-hover" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
}