import { useState, useEffect } from 'react';
import { useAppSelector } from './reduxHook';
import { selectPremiumCost, selectUserPremiumCost } from '@/store/slices/bannerSlice.slice';

interface CurrencyData {
  NGN: number;
  USD: number;
  [key: string]: number; // Index signature to allow dynamic access
}

export interface UserCurrencyInfo {
  amount: number | null;
  currencyCode: string | null;
}

interface UseCurrencyByIPResult {
  data: UserCurrencyInfo;
  isLoading: boolean;
  error: string | null;
}

// Constants for the hook
const NIGERIA_COUNTRY_CODE = 'NG'; // ISO 3166-1 alpha-2 code for Nigeria
const IP_GEOLOCATION_API_URL = 'http://ip-api.com/json/'; // Free API for IP geolocation

/**
 * Custom hook to determine user's currency based on IP address
 * and return the corresponding amount from provided data.
 *
 * @param amounts An object containing currency codes as keys and amounts as values (e.g., { NGN: 300, USD: 10 }).
 * @param defaultCurrencyCode Optional: The currency code to use as a fallback if IP lookup fails or is loading. Defaults to 'USD'.
 * @returns An object containing `data` ({ amount, currencyCode }), `isLoading`, and `error`.
 */
export const useCurrencyByIP = (
  amounts: CurrencyData,
  defaultCurrencyCode: 'NGN' | 'USD' = 'USD'
): UseCurrencyByIPResult => {
  const [displayAmount, setDisplayAmount] = useState<number | null>(null);
  const [displayCurrencyCode, setDisplayCurrencyCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const premiumCost = useAppSelector(selectPremiumCost)
  
//     if(premiumCost && premiumCost.amount && premiumCost.currencyCode) return {
//     data: premiumCost,
//     isLoading,
//     error,
//   }

  useEffect(() => {
    // if(premiumCost && premiumCost.amount && premiumCost.currencyCode) return
    let isMounted = true;

    const fetchUserLocation = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(IP_GEOLOCATION_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (isMounted) {
          if (data.status === 'success' && data.countryCode) {
            console.log('User IP Country Code:', data.countryCode);
            if (data.countryCode === NIGERIA_COUNTRY_CODE) {
              setDisplayAmount(amounts.NGN);
              setDisplayCurrencyCode('NGN');
            } else {
              setDisplayAmount(amounts.USD);
              setDisplayCurrencyCode('USD');
            }
          } else {
            console.warn('IP geolocation API failed or returned unexpected data:', data);
            setDisplayAmount(amounts[defaultCurrencyCode]);
            setDisplayCurrencyCode(defaultCurrencyCode);
            setError('Could not determine location, showing default currency.');
          }
        }
      } catch (e: any) {
        if (isMounted) {
          console.error('Error fetching user location:', e);
          setDisplayAmount(amounts[defaultCurrencyCode]);
          setDisplayCurrencyCode(defaultCurrencyCode);
          setError('Network error or API issue, showing default currency.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserLocation();

    return () => {
      isMounted = false;
    };
  }, [premiumCost]);

  return {
    data: { amount: displayAmount, currencyCode: displayCurrencyCode },
    isLoading,
    error,
  };
};