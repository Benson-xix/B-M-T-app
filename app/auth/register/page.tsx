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
// import { registerAdmin } from '@/app/lib/api';
import { mockRegisterAdmin as registerAdmin } from "@/app/mock/auth";

const registerSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
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
    <AuthForm title="Register" description="Create a new admin account">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="full_name" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Full Name</FormLabel>
              <FormControl><Input placeholder="John Doe" className="bg-black/50 border-yellow-300/50 text-white placeholder:text-muted" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
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
          <Button type="submit" className="w-full bg-yellow-200 text-black hover:bg-yellow-300-hover" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
}