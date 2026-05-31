import React, { createContext, useContext, useState } from "react";

const ActionContext = createContext(null);

export const ActionProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);

  const defaultErrorHandler = (err) => {
    const mensaje = err.response?.data?.message || err.message || "Ocurrió un error inesperado";
    alert(`⚠️ Error: ${mensaje}`);
  };

  const run = async (fn, options = {}) => {
    const { onError } = options;

    setCount((c) => c + 1);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError(err);
      console.error(err);
      if (onError) {
        onError(err);
      } else {
        defaultErrorHandler(err);
      }
    } finally {
      setCount((c) => c - 1);
    }
  };

  // valores globales
  const value = {
    loading: count > 0,
    error,
    run
  };

  return (
    <ActionContext.Provider value={value}>
      {children}
    </ActionContext.Provider>
  );
};

// contexto único
export const useAction = () => {
  const context = useContext(ActionContext);
  
  if (!context) {
    throw new Error("useAction debe ser usado dentro de un ActionProvider");
  }
  
  return context;
};