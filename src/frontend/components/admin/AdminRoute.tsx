import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'staff';
}

export function AdminRoute({ children, requiredRole = 'staff' }: AdminRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isManager, isStaff, loading: rolesLoading } = useAdmin();

  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const hasAccess = 
    requiredRole === 'admin' ? isAdmin :
    requiredRole === 'manager' ? isManager :
    isStaff;

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
