import { useState } from "react";

export const useAction = () => {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);

  const run = async (fn, options = {}) => {
    const { onError } = options;

    setCount(c => c + 1);
    setError(null);

    try {
      return await fn();
    } catch (err) {
      setError(err);
      console.error(err);
      if (onError) onError(err);
    } finally {
      setCount(c => c - 1);
    }
  };

  return {
    loading: count > 0,
    error,
    run
  };
};