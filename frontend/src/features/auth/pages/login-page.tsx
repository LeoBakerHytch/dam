import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { gql, useMutation } from 'urql';
import { z } from 'zod';

import { TextLink } from '@/components/text/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-provider';
import { useUser } from '@/context/user-provider';
import { AuthLayout } from '@/features/auth/layouts/auth-layout';
import { USER_FRAGMENT } from '@/lib/graphql-fragments';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const loginMutation = gql`
  mutation Auth_IssueToken($input: Auth_IssueToken_Input!) {
    Auth_IssueToken(input: $input) {
      accessToken {
        jwt
        tokenType
        expiresIn
      }
      user {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`;

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const [result, executeMutation] = useMutation(loginMutation);
  const { setUser } = useUser();
  const { setAccessToken } = useAuth();

  const onSubmit = async (data: LoginForm) => {
    console.log('Form submitted with data:', data);

    try {
      console.log('Executing mutation...');
      const result = await executeMutation({
        input: {
          email: data.email,
          password: data.password,
        },
      });

      console.log('Mutation result:', result);

      if (result.data?.Auth_IssueToken) {
        const { user, accessToken } = result.data.Auth_IssueToken;
        console.log('Login successful:', { user, accessToken });

        if (user && accessToken) {
          setUser(user);
          setAccessToken(accessToken);
          navigate('/dashboard');
        }
      } else {
        console.log('No data in result or Auth_IssueToken failed');
      }

      // Reset password field on success
      reset({
        ...data,
        password: '',
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <AuthLayout
      title="Log in to your account"
      description="Enter your email and password below to log in"
    >
      <title>Log in</title>
      <form
        onSubmit={(e) => {
          console.log('Form onSubmit triggered');
          console.log('Form errors:', errors);
          handleSubmit(onSubmit, (errors) => {
            console.log('Validation errors:', errors);
          })(e);
        }}
        className="flex flex-col gap-6"
      >
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              autoFocus
              tabIndex={1}
              autoComplete="email"
              placeholder="email@example.com"
              {...register('email')}
            />
            <InputError message={errors.email?.message} />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <TextLink to="/forgot-password" className="ml-auto text-sm" tabIndex={5}>
                Forgot password?
              </TextLink>
            </div>
            <Input
              id="password"
              type="password"
              tabIndex={2}
              autoComplete="current-password"
              placeholder="Password"
              {...register('password')}
            />
            <InputError message={errors.password?.message} />
          </div>

          <Button
            type="submit"
            className="mt-4 w-full"
            tabIndex={4}
            disabled={result.fetching}
            data-test="login-button"
          >
            {result.fetching && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Log in
          </Button>
        </div>

        <div className="text-muted-foreground text-center text-sm">
          Don't have an account?{' '}
          <TextLink to="/register" tabIndex={6}>
            Sign up
          </TextLink>
        </div>
      </form>
    </AuthLayout>
  );
}
