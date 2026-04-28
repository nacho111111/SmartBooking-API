export const dailyClean = () => { 
  const AHORA = new Date();
  const HOY_STR = AHORA.toISOString().split('T')[0]; // "2026-04-22"
  const ULTIMA_LIMPIEZA = localStorage.getItem("ultima_limpieza_factura");

  const horaLimpieza = new Date();
  horaLimpieza.setHours(5, 0, 0, 0);

  if (AHORA >= horaLimpieza && ULTIMA_LIMPIEZA !== HOY_STR) {
    localStorage.removeItem("facturacion_borrador");
    localStorage.setItem("ultima_limpieza_factura", HOY_STR);
    console.log("🧹 Borrador diario eliminado a las 5 AM");
  }
};