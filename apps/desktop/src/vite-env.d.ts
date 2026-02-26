/// <reference types="vite/client" />

declare global {
  interface Window {
    fedshield?: {
      platform: string;
    };
  }
}

export {};
