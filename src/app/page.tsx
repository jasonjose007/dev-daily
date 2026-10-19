'use client';
import { useState } from 'react';
import SetupModal, { SetupData } from '@/components/SetupModal';
import AlexaUI from '@/components/AlexaUI';

export default function Home() {
  const [setup, setSetup] = useState<SetupData | null>(null);

  if (!setup) {
    return <SetupModal onComplete={setSetup} />;
  }

  return (
    <AlexaUI
      githubUsername={setup.githubUsername}
      githubToken={setup.githubToken}
      onLogout={() => setSetup(null)}
    />
  );
}
