import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Users, Search, Shield, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

const roleColors: Record<AppRole, string> = {
  admin: 'bg-red-500/10 text-red-500',
  manager: 'bg-purple-500/10 text-purple-500',
  staff: 'bg-blue-500/10 text-blue-500',
  customer: 'bg-slate-500/10 text-slate-500',
};

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: usersWithRoles, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      if (rolesError) throw rolesError;

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      if (profilesError) throw profilesError;

      return roles.map(role => ({
        ...role,
        profile: profiles?.find(p => p.id === role.user_id)
      }));
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated!');
    },
    onError: () => {
      toast.error('Failed to update user role');
    },
  });

  const filteredUsers = usersWithRoles?.filter(user => {
    const name = user.profile?.full_name?.toLowerCase() || '';
    const id = user.user_id?.toLowerCase() || '';
    return name.includes(search.toLowerCase()) || id.includes(search.toLowerCase());
  });

  const roleCounts = usersWithRoles?.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage user roles and permissions</p>
      </div>

      {/* Role Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(['admin', 'manager', 'staff', 'customer'] as AppRole[]).map((role) => (
          <Card key={role}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${roleColors[role]}`}>
                {role === 'admin' ? <Shield className="h-5 w-5" /> : <UserCog className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-2xl font-bold">{roleCounts[role] || 0}</p>
                <p className="text-sm text-muted-foreground capitalize">{role}s</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-12 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredUsers && filteredUsers.length > 0 ? (
        <div className="space-y-3">
          {filteredUsers.map((userRole) => (
            <Card key={userRole.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      {userRole.profile?.avatar_url ? (
                        <img
                          src={userRole.profile.avatar_url}
                          alt=""
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {userRole.profile?.full_name || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        {userRole.user_id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={roleColors[userRole.role]}>
                      {userRole.role}
                    </Badge>
                    <Select
                      value={userRole.role}
                      onValueChange={(value) => 
                        updateRoleMutation.mutate({ userId: userRole.user_id, role: value as AppRole })
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No users found</h3>
            <p className="text-muted-foreground">Users will appear here when they sign up</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
