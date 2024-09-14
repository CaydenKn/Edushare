'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { DialogTrigger } from '@radix-ui/react-dialog';

interface AuthDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSignup?: boolean;
}

export default function AuthDialog({ isOpen, setIsOpen, isSignup }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // update islogin
    React.useEffect(() => {
        if (isSignup) {
        setIsLogin(false);
        }
    }, [isSignup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        setIsOpen(false);
        router.push('/dashboard');
      }
    } else {
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
          setIsOpen(false);
        }
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-md shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-black">{isLogin ? 'Login' : 'Sign Up'}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {isLogin ? 'Access your account' : 'Create a new account'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
                placeholder="School Name"
                required={!isLogin}
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            )}
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-between items-center">
            <Button type="submit" className="bg-blue-600 text-white">
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="p-0 text-blue-600">
              {isLogin ? 'Need an account?' : 'Already have an account?'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
