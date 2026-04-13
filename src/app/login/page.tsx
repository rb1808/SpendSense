'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, LogIn } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginError() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  
  if (!error) return null;
  
  return (
    <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 text-center">
      Authentication Error: {error}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-2xl">
              <Wallet className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">SpendSense</CardTitle>
          <CardDescription>
            Smart financial control at your fingertips.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Suspense fallback={null}>
            <LoginError />
          </Suspense>
          <Button 
            className="w-full h-12 text-lg" 
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <LogIn className="mr-2 h-5 w-5" /> Sign in with Google
          </Button>
          <p className="text-center text-xs text-muted-foreground px-8">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
