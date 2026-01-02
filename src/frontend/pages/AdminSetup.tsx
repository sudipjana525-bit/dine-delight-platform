import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/frontend/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';

export default function AdminSetup() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  // Check if admin already exists
  useEffect(() => {
    const checkAdminExists = async () => {
      const { data, error } = await supabase.rpc('admin_exists');
      if (error) {
        console.error('Error checking admin:', error);
      }
      setAdminExists(data || false);
      setCheckingAdmin(false);
    };

    checkAdminExists();
  }, []);

  // If user is logged in and admin doesn't exist, offer to promote them
  useEffect(() => {
    if (!authLoading && user && !adminExists && !checkingAdmin) {
      setIsSignUp(false);
    }
  }, [authLoading, user, adminExists, checkingAdmin]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/admin-setup`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Promote to admin
        const { data: promoted, error: promoteError } = await supabase.rpc('setup_initial_admin', {
          user_id: data.user.id
        });

        if (promoteError) throw promoteError;

        if (promoted) {
          setSetupComplete(true);
          toast({
            title: 'Admin account created!',
            description: 'You are now the administrator of this application.',
          });
        } else {
          toast({
            title: 'Setup failed',
            description: 'An admin already exists.',
            variant: 'destructive',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Promote to admin
        const { data: promoted, error: promoteError } = await supabase.rpc('setup_initial_admin', {
          user_id: data.user.id
        });

        if (promoteError) throw promoteError;

        if (promoted) {
          setSetupComplete(true);
          toast({
            title: 'You are now an admin!',
            description: 'You have been promoted to administrator.',
          });
        } else {
          toast({
            title: 'Setup failed',
            description: 'An admin already exists.',
            variant: 'destructive',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteCurrentUser = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: promoted, error } = await supabase.rpc('setup_initial_admin', {
        user_id: user.id
      });

      if (error) throw error;

      if (promoted) {
        setSetupComplete(true);
        toast({
          title: 'You are now an admin!',
          description: 'You have been promoted to administrator.',
        });
      } else {
        toast({
          title: 'Setup failed',
          description: 'An admin already exists.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (adminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-emerald-500/10 rounded-full w-fit">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <CardTitle>Admin Already Configured</CardTitle>
            <CardDescription>
              This application already has an administrator. Please sign in with your admin credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/auth">Go to Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (setupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-emerald-500/10 rounded-full w-fit">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <CardTitle>Setup Complete!</CardTitle>
            <CardDescription>
              You are now the administrator of this application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/admin">Go to Admin Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is already logged in, show promote button
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Become Administrator</CardTitle>
            <CardDescription>
              You're signed in as {user.email}. Would you like to become the administrator?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handlePromoteCurrentUser} 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Make Me Admin
                </>
              )}
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Initial Admin Setup</CardTitle>
          <CardDescription>
            No administrator exists yet. Create the first admin account to manage your restaurant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? 'Creating Admin...' : 'Signing In...'}
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {isSignUp ? 'Create Admin Account' : 'Sign In & Become Admin'}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            {isSignUp ? (
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-primary hover:underline"
                >
                  Sign in instead
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Need a new account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-primary hover:underline"
                >
                  Create one
                </button>
              </p>
            )}
          </div>

          <div className="mt-4">
            <Button asChild variant="ghost" className="w-full">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
