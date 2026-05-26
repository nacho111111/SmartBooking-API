import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { loginManual, isAuth } from "./utils/manualLogin";

//import "./app.css";

export default function App() {

  const [auth, setAuth] = useState(null)

  useEffect(() => {
    async function checkAuth() {
      const isLogged = await isAuth();
      setAuth(isLogged); 
    }
    checkAuth();
  }, []);

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await loginManual(e.target.value);
    }
  };
  if (auth === null) return <p>Verificando credenciales...</p>;

  if (!auth) {
    return (
      <>
        <p>Falta iniciar sesión</p>
        <input 
          type="password" 
          placeholder="Introduce la contraseña y presiona Enter"
          onKeyDown={handleKeyDown} 
        />
      </>
    );
  }
  return <Dashboard />
}