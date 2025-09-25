import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { TextLink } from '@/components/text/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/features/auth/layouts/auth-layout';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
    email: z.email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords don’t match',
    path: ['password_confirmation'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      // TODO: Replace with your actual registration API call
      console.log('Registration data:', data);

      // Example API call (replace with your actual implementation):
      // await registerUser(data);

      // Reset password fields on success
      reset({
        ...data,
        password: '',
        password_confirmation: '',
      });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details below to create your account"
    >
      <title>Register</title>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              autoFocus
              tabIndex={1}
              autoComplete="name"
              placeholder="Full name"
              {...register('name')}
            />
            <InputError message={errors.name?.message} className="mt-2" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              tabIndex={2}
              autoComplete="email"
              placeholder="email@example.com"
              {...register('email')}
            />
            <InputError message={errors.email?.message} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              tabIndex={3}
              autoComplete="new-password"
              placeholder="Password"
              {...register('password')}
            />
            <InputError message={errors.password?.message} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Confirm password</Label>
            <Input
              id="password_confirmation"
              type="password"
              tabIndex={4}
              autoComplete="new-password"
              placeholder="Confirm password"
              {...register('password_confirmation')}
            />
            <InputError message={errors.password_confirmation?.message} />
          </div>

          <Button
            type="submit"
            className="mt-2 w-full"
            tabIndex={5}
            disabled={isSubmitting}
            data-test="register-user-button"
          >
            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Create account
          </Button>
        </div>

        <div className="text-muted-foreground text-center text-sm">
          Already have an account?{' '}
          <TextLink to="/login" tabIndex={6}>
            Log in
          </TextLink>
        </div>
      </form>
    </AuthLayout>
  );
}
