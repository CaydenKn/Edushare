  import React, { useState } from 'react';
  import { useRouter } from 'next/navigation';
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
  import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

  export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false); // New state for checkbox
    const router = useRouter();
    const supabase = createClientComponentClient();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!agreedToTerms) { // Check if terms are agreed
        setError('Please agree to the terms and conditions and privacy policy.');
        return;
      }

      if (isLogin) {
        // Login process
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(error.message);
        } else {
          router.push('/dashboard');
        }
      } else {
        // Sign up process
        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          setError(error.message);
        } else if (signUpData.user) {
          // After sign-up, update the profile with school name
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: signUpData.user.id,
              school_name: schoolName,
            });

          if (profileError) {
            setError('Error updating profile: ' + profileError.message);
          } else {
            setError('Check your email for the confirmation link.');
          }
        }
      }
    };

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Access your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input 
                type="email" 
                placeholder="Email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input 
                type="password" 
                placeholder="Password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!isLogin && (
                <Input 
                  type="text" 
                  placeholder="University of Oklahoma, Rogers State University..." 
                  required={!isLogin} 
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
              )}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="agreedToTerms" className="text-sm text-gray-500">
                  I agree to the <a href="/terms">terms and conditions</a> and <a href="/privacy">privacy policy</a>.
                </label>
              </div>
              <Button type="submit" className="w-full">
                {isLogin ? 'Login' : 'Sign Up'}
              </Button>
            </div>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="p-0">
              {isLogin ? 'Sign up' : 'Login'}
            </Button>
          </p>
        </CardFooter>
      </Card>
    );
  }