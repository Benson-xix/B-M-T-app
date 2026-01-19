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

// async function loginAdmin(data: { email: string; password: string }) {

//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// }

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
    <AuthForm title="Login" description="Sign in to your admin account" footer={<Link href="/auth/forgot-password" className="text-yellow-300 hover:underline">Forgot password?</Link>}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl><Input type="email" placeholder="admin@example.com" className="bg-black/50 border-yellow-300/50 text-white placeholder:text-muted" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl><Input type="password" placeholder="********" className="bg-black/50 border-yellow-300/50 text-white placeholder:text-muted" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" className="w-full bg-yellow-300 text-black hover:bg-yellow-300-hover" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
}