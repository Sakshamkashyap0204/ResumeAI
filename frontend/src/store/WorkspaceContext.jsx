import { createContext, useContext, useState } from 'react';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [generationContext, setGenerationContext] = useState(null);

  const importConversation = (conversation) => setGenerationContext(conversation);
  const clearGenerationContext = () => setGenerationContext(null);

  return (
    <WorkspaceContext.Provider value={{ generationContext, importConversation, clearGenerationContext }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return context;
}