import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  return 'dark';
  // add back once dynamic theming is needed
  // const [hasHydrated, setHasHydrated] = useState(false);

  // useEffect(() => {
  //   setHasHydrated(true);
  // }, []);

  // const colorScheme = useRNColorScheme();

  // if (hasHydrated) {
  //   return colorScheme;
  // }

  // return 'light';
}
