export const checkDailyClean = () => { 
  const AHORA = new Date();
  const HOY_STR = AHORA.toLocaleDateString('sv-SE'); // "2026-04-22"
  const ULTIMA_LIMPIEZA = localStorage.getItem("ultima_limpieza_factura");

  const horaLimpieza = new Date();
  horaLimpieza.setHours(5, 0, 0, 0);

  if (AHORA < horaLimpieza || ULTIMA_LIMPIEZA === HOY_STR) {
    return { shouldClean: false };
  }

  const borradorRaw = localStorage.getItem("facturacion_borrador");
  const estaSincronizado = localStorage.getItem("caja_sincronizada") === "true";

  let pendientes = [];
  if (borradorRaw && !estaSincronizado) {
    try {
      const parsed = JSON.parse(borradorRaw);

      if (Array.isArray(parsed)) {
          pendientes = parsed;
      } else {
          console.error("El borrador no contiene un array:", parsed);
      }
    } catch (e) {
      console.error("Error leyendo borrador desfasado", e);
    }
  }

  return {
    shouldClean: true,
    hoyStr: HOY_STR,
    pendientes, 
  };
};

export const markCleanComplete = (hoyStr) => {
  localStorage.removeItem("facturacion_borrador");
  localStorage.removeItem("caja_sincronizada");
  localStorage.setItem("ultima_limpieza_factura", hoyStr);
};