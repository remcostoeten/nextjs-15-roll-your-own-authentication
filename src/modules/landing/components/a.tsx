'use client';

import { getGithubCommits } from '@/api/queries/get-github-commits';
import NumberFlow from '@number-flow/react';
import { useEffect, useState } from 'react';

export function AnimatedNumbers() {
  const [data, setData] = useState<any[]>([]);
  const count = data?.length || 0;

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const result = await getGithubCommits();
        setData(result || []);
      } catch (error) {
        console.error('Error fetching commits:', error);
      }
    };

    fetchCommits();
  }, []);

  return (
    <div className="text-6xl font-bold">
      <NumberFlow
        value={count}
        transformTiming={{ duration: 750, easing: 'ease-out' }}
        spinTiming={{ duration: 750, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        opacityTiming={{ duration: 350, easing: 'ease-out' }}
        format={{ notation: 'standard' }}
      />
    </div>
  );
}
