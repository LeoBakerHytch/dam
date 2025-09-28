import { useMutation } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { TextLink } from '@/components/text/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/features/auth/layouts/auth-layout';
import {
  RegisterMutation,
  type RegisterMutationResult,
  type RegisterMutationVariables,
} from '@/graphql/auth';
import { useAuth } from '@/providers/api-provider';

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
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const [mutate, { loading }] = useMutation<RegisterMutationResult, RegisterMutationVariables>(
    RegisterMutation,
  );

  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const onSubmit = useCallback(
    async (data: RegisterForm) => {
      try {
        const result = await mutate({
          variables: {
            input: {
              name: data.name,
              email: data.email,
              password: data.password,
            },
          },
        });

        const registerResult = result.data?.Auth_Register;

        if (registerResult) {
          setAccessToken(registerResult.accessToken);
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Registration failed:', error);
      }
    },
    [mutate, setAccessToken, navigate],
  );

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
            disabled={loading}
            data-test="register-user-button"
          >
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
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
