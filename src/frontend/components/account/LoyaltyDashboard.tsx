import { Award, TrendingUp, Gift, Star } from 'lucide-react';
import { useAuth } from '@/frontend/hooks/useAuth';
import { useLoyaltyPoints, useLoyaltyTransactions } from '@/frontend/hooks/useLoyalty';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const tierConfig = {
  bronze: { color: 'from-amber-600 to-amber-800', icon: '🥉', nextTier: 'Silver', pointsNeeded: 500 },
  silver: { color: 'from-gray-400 to-gray-600', icon: '🥈', nextTier: 'Gold', pointsNeeded: 1500 },
  gold: { color: 'from-yellow-400 to-yellow-600', icon: '🥇', nextTier: 'Platinum', pointsNeeded: 5000 },
  platinum: { color: 'from-purple-400 to-purple-600', icon: '💎', nextTier: null, pointsNeeded: null },
};

export function LoyaltyDashboard() {
  const { user } = useAuth();
  const { data: loyalty, isLoading } = useLoyaltyPoints(user?.id);
  const { data: transactions } = useLoyaltyTransactions(user?.id);

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-6 shadow-soft animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4" />
        <div className="h-24 bg-muted rounded mb-4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    );
  }

  const tier = (loyalty?.tier as keyof typeof tierConfig) || 'bronze';
  const tierInfo = tierConfig[tier];
  const pointsToNext = tierInfo.pointsNeeded 
    ? tierInfo.pointsNeeded - (loyalty?.total_points || 0)
    : null;
  const progress = tierInfo.pointsNeeded
    ? ((loyalty?.total_points || 0) / tierInfo.pointsNeeded) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Points Card */}
      <div className={cn(
        'rounded-xl p-6 text-white bg-gradient-to-br',
        tierInfo.color
      )}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm opacity-80">Your Points</p>
            <p className="text-4xl font-bold">{loyalty?.total_points || 0}</p>
          </div>
          <div className="text-4xl">{tierInfo.icon}</div>
        </div>
        
        <div className="mb-2">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="capitalize font-medium">{tier} Member</span>
            {tierInfo.nextTier && (
              <span className="opacity-80">{pointsToNext} pts to {tierInfo.nextTier}</span>
            )}
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{loyalty?.total_points || 0}</p>
          <p className="text-xs text-muted-foreground">Total Points</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold capitalize">{tier}</p>
          <p className="text-xs text-muted-foreground">Current Tier</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <Gift className="h-6 w-6 mx-auto mb-2 text-purple-500" />
          <p className="text-2xl font-bold">{Math.floor((loyalty?.total_points || 0) / 100)}</p>
          <p className="text-xs text-muted-foreground">Rewards Available</p>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          Recent Activity
        </h3>
        {transactions && transactions.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {transactions.slice(0, 10).map((tx) => (
              <div 
                key={tx.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium capitalize">
                    {tx.transaction_type.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.description || format(new Date(tx.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <span className={cn(
                  'font-semibold',
                  tx.points > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {tx.points > 0 ? '+' : ''}{tx.points} pts
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No activity yet. Start ordering to earn points!
          </p>
        )}
      </div>
    </div>
  );
}
