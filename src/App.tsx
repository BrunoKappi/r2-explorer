/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FileExplorer from './components/FileExplorer';
import UploadsPopup from './features/uploads/UploadsPopup';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigationStore } from './stores/navigationStore';
import { r2Service } from './services/r2Service';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function AppContent() {
  const { buckets, activeBucketName, setBuckets, setActiveBucketName, theme } = useNavigationStore();

  // Sync theme with document class list
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Load buckets on boot
  const { data: bucketsData, isLoading } = useQuery({
    queryKey: ['buckets'],
    queryFn: () => r2Service.listBuckets(),
    retry: 1,
  });

  useEffect(() => {
    if (bucketsData && bucketsData.length > 0) {
      setBuckets(bucketsData);
      if (!activeBucketName) {
        // Default to the first bucket in the list
        setActiveBucketName(bucketsData[0].name);
      }
    }
  }, [bucketsData, activeBucketName, setBuckets, setActiveBucketName]);

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 flex flex-col font-sans select-none overflow-hidden transition-colors">
      
      {/* MAIN LAYOUT CANVAS FRAME */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col justify-start overflow-hidden">
        <FileExplorer />
      </main>

      {/* Floating Upload popups & queues */}
      <UploadsPopup />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
