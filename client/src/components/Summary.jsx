export default function Summary({ appointments }) {
  const totals = appointments.reduce(
    (acc, a) => {
      if (!a.total) return acc;

      acc.total += a.total;
      acc[a.tipoPago] += a.total;

      return acc;
    },
    { efectivo: 0, tarjeta: 0, transferencia: 0, total: 0 }
  );

  return (
    <div className="summary">
      <h4>Resumen diario</h4>
      <p>Efectivo: {totals.efectivo}</p>
      <p>Tarjeta: {totals.tarjeta}</p>
      <p>Transferencia: {totals.transferencia}</p>
      <p><b>Total: {totals.total}</b></p>
    </div>
  );
}