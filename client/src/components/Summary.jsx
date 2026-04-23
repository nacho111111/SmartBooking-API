export default function Summary({ salesList }) {
  const totals = salesList.reduce(
    (acc, a) => {
      if (!a.total_final) return acc;
      console.log("a")
      acc.total += a.total_final;
      acc[a.tipo_pago] += a.total_final;

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