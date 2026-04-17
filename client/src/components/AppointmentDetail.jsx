import { useState, useEffect } from "react";

export default function AppointmentDetail({ selected, onUpdate }) {
  const [local, setLocal] = useState(null);

  useEffect(() => {
    setLocal(selected);
  }, [selected]);

  if (!local) return <p>Selecciona una cita</p>;

  const handleChange = (e) => {
    setLocal({ ...local, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const total =
      Number(local.precio || 0) + Number(local.productos || 0);

    onUpdate({ ...local, total });
  };

  return (
    <div>
      <h3>Detalle</h3>

      <label>Asistió</label>
      <select name="asistio" onChange={handleChange}>
        <option value="true">Sí</option>
        <option value="false">No</option>
      </select>

      <input
        name="precio"
        placeholder="Precio peluquería"
        onChange={handleChange}
      />

      <input
        name="productos"
        placeholder="Productos"
        onChange={handleChange}
      />

      <select name="tipoPago" onChange={handleChange}>
        <option value="efectivo">Efectivo</option>
        <option value="tarjeta">Tarjeta</option>
        <option value="transferencia">Transferencia</option>
      </select>

      <button onClick={handleSave}>Guardar</button>
    </div>
  );
}