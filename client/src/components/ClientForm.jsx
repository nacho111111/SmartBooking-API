import { useState} from "react";

export default function ClientForm({ onAdd ,setShowForm }) {

  const [form, setForm] = useState({
    nombre_usuario: "",
    email: "",
    telefono: "",
    fecha: "",
    nombre_mascota: "",
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
        setShowForm(false);
      }}
    >
      <input name="nombre_usuario" placeholder="Nombre" value={form.nombre_usuario} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
      
      <input
        type="datetime-local"
        name="fecha"
        value={form.fecha}
        onChange={handleChange}
      />

      <input name="nombre_mascota" placeholder="Mascota" value={form.nombre_mascota} onChange={handleChange} />
      <input name="descripcion" placeholder="Descripcion" value={form.descripcion} onChange={handleChange} />

      <button type="submit">Guardar</button>
    </form>
  );
}