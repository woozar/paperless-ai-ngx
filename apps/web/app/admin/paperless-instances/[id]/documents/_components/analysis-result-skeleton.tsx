'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Clock, Cpu, ArrowDown, ArrowUp, Euro } from 'lucide-react';

export function AnalysisResultSkeleton() {
  return (
    <>
      {/* Metadata badges with colors */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className="border-cyan-500 bg-cyan-500/10 py-1.5 whitespace-nowrap text-cyan-700 dark:text-cyan-400"
        >
          <Clock className="mr-1 h-3 w-3" />
          <Skeleton className="h-3 w-24 bg-cyan-500/30" />
        </Badge>
        <Badge
          variant="outline"
          className="border-purple-500 bg-purple-500/10 py-1.5 whitespace-nowrap text-purple-700 dark:text-purple-400"
        >
          <Cpu className="mr-1 h-3 w-3" />
          <Skeleton className="h-3 w-24 bg-purple-500/30" />
        </Badge>
        <Badge
          variant="outline"
          className="border-blue-500 bg-blue-500/10 py-1.5 whitespace-nowrap text-blue-700 dark:text-blue-400"
        >
          <Skeleton className="h-3 w-10 bg-blue-500/30" />
          <ArrowDown className="h-3 w-3" />
        </Badge>
        <Badge
          variant="outline"
          className="border-green-500 bg-green-500/10 py-1.5 whitespace-nowrap text-green-700 dark:text-green-400"
        >
          <Skeleton className="h-3 w-8 bg-green-500/30" />
          <ArrowUp className="h-3 w-3" />
        </Badge>
        <Badge
          variant="outline"
          className="border-amber-500 bg-amber-500/10 py-1.5 whitespace-nowrap text-amber-700 dark:text-amber-400"
        >
          <Skeleton className="h-3 w-12 bg-amber-500/30" />
          <Euro className="h-3 w-3" />
        </Badge>
      </div>

      {/* Analysis results skeleton */}
      <div className="space-y-4 rounded-lg border p-4">
        <div className="space-y-3">
          {/* Title */}
          <div>
            <Skeleton className="mb-1 h-3 w-16" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          {/* Correspondent */}
          <div>
            <Skeleton className="mb-1 h-3 w-20" />
            <Skeleton className="h-5 w-1/2" />
          </div>

          {/* Document Type */}
          <div>
            <Skeleton className="mb-1 h-3 w-24" />
            <Skeleton className="h-5 w-1/3" />
          </div>

          {/* Tags */}
          <div>
            <Skeleton className="mb-2 h-3 w-12" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>

          {/* Date */}
          <div>
            <Skeleton className="mb-1 h-3 w-14" />
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Confidence */}
          <div>
            <Skeleton className="mb-1 h-3 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>

          {/* Reasoning */}
          <div>
            <Skeleton className="mb-1 h-3 w-20" />
            <Skeleton className="mb-1 h-4 w-full" />
            <Skeleton className="mb-1 h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Apply All Button skeleton */}
        <div className="border-t pt-4">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </>
  );
}
