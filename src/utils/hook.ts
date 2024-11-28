import { useEffect } from "react";

const useEffectAsync = <T>(
  effect: () => Promise<T>,
  deps?: React.DependencyList
) => {
  useEffect(() => {
    effect();
  }, deps);
};

export { useEffectAsync };
