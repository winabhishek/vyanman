
import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';

interface ScreenTimeTrackerProps {
  className?: string;
}

const ScreenTimeTracker: React.FC<ScreenTimeTrackerProps> = ({ className }) => {
  // Mock data - in a real app, this would come from an API or local storage
  const dailyUsage = {
    hours: 3,
    minutes: 24,
    target: 5, // hours
    percentage: 68, // percentage of daily target used
  };

  const appUsage = [
    { name: 'Social Media', time: 105, percentage: 60 }, // 1h 45m in minutes
    { name: 'Productivity', time: 45, percentage: 25 },
    { name: 'Entertainment', time: 54, percentage: 35 },
  ];

  return (
    <Card className={`glass-card p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-4">Today's Usage</h3>
          <div className="relative h-48 w-48 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#e2e8f0" 
                strokeWidth="10" 
              />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="hsl(var(--vyanamana-500))" 
                strokeWidth="10" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * dailyUsage.percentage) / 100} 
                transform="rotate(-90 50 50)" 
              />
              <text 
                x="50" 
                y="50" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className="text-2xl font-bold fill-current"
              >
                {dailyUsage.hours}h {dailyUsage.minutes}m
              </text>
              <text 
                x="50" 
                y="65" 
                textAnchor="middle" 
                className="text-xs fill-muted-foreground"
              >
                of {dailyUsage.target}h target
              </text>
            </svg>
            <motion.div 
              className="text-center mt-2 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {dailyUsage.percentage < 50 ? 'Great job!' : 'Almost at your limit'}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-4">App Breakdown</h3>
          <div className="space-y-4">
            {appUsage.map((app, index) => (
              <motion.div 
                key={app.name} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
              >
                <div className="flex justify-between mb-1">
                  <span>{app.name}</span>
                  <span className="text-vyanamana-500">
                    {Math.floor(app.time / 60)}h {app.time % 60}m
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <motion.div 
                    className="bg-vyanamana-500 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${app.percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg border border-dashed border-muted-foreground/40">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Pickups: <span className="font-medium text-foreground">42 today</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Most active: <span className="font-medium text-foreground">8AM - 10AM</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Card>
  );
};

export default ScreenTimeTracker;
