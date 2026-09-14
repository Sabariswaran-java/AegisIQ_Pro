// aegisiq-frontend/context/AegisContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

const AegisContext = createContext<any>(null);

export const AegisProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [workflowState, setWorkflowState] = useState({ acknowledged: false });
  
  // New: Store AI Outputs across the loop
  const [aiWorkflowData, setAiWorkflowData] = useState({
    twinResult: null,
    whatIfResult: null,
    xaiExplanation: null
  });

  return (
    <AegisContext.Provider value={{ 
      selectedAsset, setSelectedAsset, 
      workflowState, setWorkflowState, 
      aiWorkflowData, setAiWorkflowData 
    }}>
      {children}
    </AegisContext.Provider>
  );
};

export const useAegis = () => useContext(AegisContext);