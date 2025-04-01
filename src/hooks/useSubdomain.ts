'use client';

import { useState, useEffect } from 'react';

export function useSubdomain() {
  const [hasFaSubdomain, setHasFaSubdomain] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get the hostname from window.location
    const hostname = window.location.hostname;
    
    // Check if the hostname starts with 'fa.'
    const isFaSubdomain = hostname.startsWith('fa.');
    
    setHasFaSubdomain(isFaSubdomain);
    setIsLoading(false);
  }, []);

  return {
    hasFaSubdomain,
    isLoading
  };
}

export default useSubdomain; 