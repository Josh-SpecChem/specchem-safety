'use client';

import { Button } from '@/components/ui/button';
import { trackLmsEvent } from '@/features/lms/analytics/client';

interface EnrollButtonProps {
  moduleSlug: string;
}

export function EnrollButton({ moduleSlug }: EnrollButtonProps) {
  const handleEnroll = () => {
    trackLmsEvent.ctaClicked('start_training', moduleSlug);
  };

  return (
    <Button size="lg" onClick={handleEnroll}>
      Start Training
    </Button>
  );
}
