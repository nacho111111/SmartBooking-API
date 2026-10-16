import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

const ActionContext = createContext(null);

export const ActionProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);

  const defaultErrorHandler = (err) => {
    const mensaje = err.response?.data?.message || err.message || "Ocurrió un error inesperado";
    toast.error(mensaje);
  };

  const run = async (fn, options = {}) => {
    const { onError, successMessage, loadingMessage} = options;

    setCount((c) => c + 1);
    setError(null);

    let toastId = null;
    if (loadingMessage) {
      toastId = toast.loading(loadingMessage);
    }

    try {
      const res = await fn();

      if (successMessage) {
        toast.success(successMessage);
      }
      return res;

    } catch (err) {
      setError(err);
      console.error(err);

      if (onError) {
        onError(err);
      } else {
        return defaultErrorHandler(err);
      }

      throw err;
    } finally {
      
      if (toastId) {
        toast.dismiss(toastId);
      }
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