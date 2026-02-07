import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    trend?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon, trend }) => (
    <Card>
        <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
            <div className="text-slate-400">{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
            {trend && (
                <div className="flex items-center mt-2 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {trend}
                </div>
            )}
        </CardContent>
    </Card>
);

export default MetricCard;
