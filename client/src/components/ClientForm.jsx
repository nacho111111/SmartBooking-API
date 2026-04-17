import { useState } from "react";

export default function ClientForm({ onAdd }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fecha: "",
    mascota: "",
    descripcion: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(form);
      }}
    >
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
      
      <input
        type="datetime-local"
        name="fecha"
        value={form.fecha}
        onChange={handleChange}
      />

      <input name="mascota" placeholder="Mascota" value={form.mascota} onChange={handleChange} />
      <input name="descripcion" placeholder="Descripcion" value={form.descripcion} onChange={handleChange} />

      <button type="submit">Guardar</button>
    </form>
  );
}