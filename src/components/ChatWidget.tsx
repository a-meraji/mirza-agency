"use client";
import Script from "next/script";

// Define types for the global window object
declare global {
  interface Window {
    MirzaChat?: {
      init: (config: MirzaChatConfig) => void;
    };
    MirzaChatBox?: new (config: MirzaChatConfig) => {
      init: () => void;
    };
  }
}

// Configuration type
interface MirzaChatConfig {
  apiUrl: string;
  websiteId: string;
  primaryColor: string;
  companyName: string;
  debug?: boolean;
}

export default function ChatWidget() {
  const handleScriptLoad = () => {
    // Default configuration
    const config: MirzaChatConfig = {
      apiUrl: 'http://localhost:8000',
      websiteId: '655aac0e-d812-42d3-ae19-11cdb47cba7b',
      primaryColor: '#ffa620',
      companyName: 'Mirza Agency',
      debug: true
    };
    
    // Create error log element
    const errorLogId = 'mirza-chat-error-log';
    let errorLog = document.getElementById(errorLogId);
    if (!errorLog) {
      errorLog = document.createElement('div');
      errorLog.id = errorLogId;
      errorLog.style.display = 'none';
      document.body.appendChild(errorLog);
    }
    
    // Log errors safely
    const logError = (message: string) => {
      console.error(message);
      if (errorLog) {
        errorLog.textContent += message + '\n';
      }
    };
    
    try {
      // Try to initialize with MirzaChat
      if (window.MirzaChat) {
        window.MirzaChat.init(config);
      } 
      // Fall back to MirzaChatBox if available
      else if (window.MirzaChatBox) {
        const chatBox = new window.MirzaChatBox(config);
        chatBox.init();
      } 
      // Neither integration method is available
      else {
        logError('Neither MirzaChat nor MirzaChatBox is available');
      }
    } catch (error) {
      logError(`Error initializing chat widget: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Script 
      src="https://cdn.jsdelivr.net/npm/mirza-ai-chatbox@1.0.1/dist/mirza-chat-box.js" 
      strategy="afterInteractive"
      onLoad={handleScriptLoad}
      onError={() => console.error('Failed to load chat widget script')}
    />
  );
} 