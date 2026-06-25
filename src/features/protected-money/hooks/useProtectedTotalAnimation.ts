import { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";

let hasPlayedProtectedTotalEntrance = false;

export function useProtectedTotalAnimation() {
  const [displayedTotal, setDisplayedTotal] = useState(0);
  const totalAnim = useRef(new Animated.Value(0)).current;
  const totalAnimListenerId = useRef<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      totalAnim.stopAnimation();
      if (totalAnimListenerId.current) {
        totalAnim.removeListener(totalAnimListenerId.current);
      }
    };
  }, [totalAnim]);

  function animateTotal(fromValue: number, toValue: number) {
    if (totalAnimListenerId.current) {
      totalAnim.removeListener(totalAnimListenerId.current);
    }

    totalAnim.stopAnimation();
    totalAnim.setValue(fromValue);
    setDisplayedTotal(fromValue);

    totalAnimListenerId.current = totalAnim.addListener(({ value }) => {
      if (!isMountedRef.current) return;
      setDisplayedTotal(value);
    });

    Animated.timing(totalAnim, {
      toValue,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      if (!isMountedRef.current) return;
      setDisplayedTotal(toValue);
    });
  }

  function resolveTotal(toValue: number, options?: { animateFrom?: number }) {
    if (
      typeof options?.animateFrom === "number" &&
      options.animateFrom !== toValue
    ) {
      animateTotal(options.animateFrom, toValue);
      return;
    }

    if (!hasPlayedProtectedTotalEntrance) {
      hasPlayedProtectedTotalEntrance = true;
      if (toValue !== 0) {
        animateTotal(0, toValue);
        return;
      }
    }

    setDisplayedTotal(toValue);
  }

  return { displayedTotal, resolveTotal };
}
