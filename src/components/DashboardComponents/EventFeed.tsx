import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export interface Event {
  id: string;
  type: 'join' | 'leave' | 'reassign' | 'inactive' | 'metric';
  message: string;
  timestamp: string;
  icon?: React.ReactNode;
  payload?: any;
}

interface EventFeedProps {
  events: Event[];
  pageSize?: number; // number of events per page
}

const EventFeed: React.FC<EventFeedProps> = ({ events, pageSize = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(events.length / pageSize);

  const startIdx = (currentPage - 1) * pageSize;
  const pagedEvents = events.slice(startIdx, startIdx + pageSize);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
        <CardDescription>Network activity and operational changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pagedEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
              <div className="mt-0.5">{event.icon}</div>
              <div className="flex-1">
                <p className="text-sm text-slate-900">{event.message}</p>
                <p className="text-xs text-slate-500 mt-1">{event.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between mt-4 items-center">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventFeed;
