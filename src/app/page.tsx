'use client';

import { Features } from '@/modules/landing/components/features';
import { Container } from '@/shared/components/ui/container';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Container className="flex-1 w-full max-w-[1400px] mx-auto px-4">
        <div className="space-y-24 py-8 md:py-12">
          <Features />
        </div>
      </Container>
    </main>
  );
}
