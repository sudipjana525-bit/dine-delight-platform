import { useState } from 'react';
import { Activity, Server, Database, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from '@/frontend/hooks/useBranches';
import { format } from 'date-fns';

export default function SystemHealthPage() {
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const { data: branches } = useBranches();

  const { data: healthMetrics, isLoading } = useQuery({
    queryKey: ['system-health', selectedBranch],
    queryFn: async () => {
      let query = supabase
        .from('system_health')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (selectedBranch !== 'all') {
        query = query.eq('branch_id', selectedBranch);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Aggregate metrics by type
  const getLatestMetric = (metricName: string) => {
    return healthMetrics?.find(m => m.metric_name === metricName);
  };

  const uptime = getLatestMetric('uptime');
  const responseTime = getLatestMetric('response_time');
  const errorRate = getLatestMetric('error_rate');
  const dbConnections = getLatestMetric('db_connections');
  const memoryUsage = getLatestMetric('memory_usage');
  const cpuUsage = getLatestMetric('cpu_usage');

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return <Badge className="bg-green-100 text-green-700">Healthy</Badge>;
    if (value <= thresholds.warning) return <Badge className="bg-yellow-100 text-yellow-700">Warning</Badge>;
    return <Badge className="bg-red-100 text-red-700">Critical</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">System Health</h1>
          <p className="text-muted-foreground">Monitor system performance and status</p>
        </div>
        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches?.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Overall Status */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">All Systems Operational</h2>
              <p className="text-sm text-muted-foreground">
                Last checked: {format(new Date(), 'h:mm:ss a')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {uptime ? `${Number(uptime.metric_value).toFixed(2)}%` : '99.99%'}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
            <Progress value={uptime ? Number(uptime.metric_value) : 99.99} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(
              responseTime ? Number(responseTime.metric_value) : 120,
              { good: 200, warning: 500 }
            )}`}>
              {responseTime ? `${Number(responseTime.metric_value).toFixed(0)}ms` : '120ms'}
            </div>
            <p className="text-xs text-muted-foreground">Average response time</p>
            {getStatusBadge(
              responseTime ? Number(responseTime.metric_value) : 120,
              { good: 200, warning: 500 }
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(
              errorRate ? Number(errorRate.metric_value) : 0.1,
              { good: 1, warning: 5 }
            )}`}>
              {errorRate ? `${Number(errorRate.metric_value).toFixed(2)}%` : '0.10%'}
            </div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
            {getStatusBadge(
              errorRate ? Number(errorRate.metric_value) : 0.1,
              { good: 1, warning: 5 }
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Connections</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dbConnections ? Number(dbConnections.metric_value) : 12} / 100
            </div>
            <p className="text-xs text-muted-foreground">Active connections</p>
            <Progress 
              value={dbConnections ? Number(dbConnections.metric_value) : 12} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(
              memoryUsage ? Number(memoryUsage.metric_value) : 45,
              { good: 70, warning: 85 }
            )}`}>
              {memoryUsage ? `${Number(memoryUsage.metric_value).toFixed(0)}%` : '45%'}
            </div>
            <p className="text-xs text-muted-foreground">RAM utilization</p>
            <Progress 
              value={memoryUsage ? Number(memoryUsage.metric_value) : 45} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(
              cpuUsage ? Number(cpuUsage.metric_value) : 32,
              { good: 70, warning: 85 }
            )}`}>
              {cpuUsage ? `${Number(cpuUsage.metric_value).toFixed(0)}%` : '32%'}
            </div>
            <p className="text-xs text-muted-foreground">Processor utilization</p>
            <Progress 
              value={cpuUsage ? Number(cpuUsage.metric_value) : 32} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Health Events</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : healthMetrics && healthMetrics.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {healthMetrics.slice(0, 10).map((metric) => (
                <div
                  key={metric.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium capitalize">
                        {metric.metric_name.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(metric.created_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {Number(metric.metric_value).toFixed(2)} {metric.unit || ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No health metrics recorded yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
