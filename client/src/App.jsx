import { useEffect, useState } from "react";
import AppointmentList from "./components/AppointmentList";
import AppointmentDetail from "./components/AppointmentDetail";
import ClientForm from "./components/ClientForm";
import Summary from "./components/Summary";
import "./app.css";

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/citas/hoy")
      .then((res) => res.json())
      .then(setAppointments)
      .catch(() => console.log("backend no conectado"));
  }, []);

  const handleAdd = async (form) => {
    try {
      // 1. crear usuario
      const resUser = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono
        })
      });

      if (!resUser.ok) {
        const text = await resUser.text();
        console.error("Error backend:", text);
        return;
      }

      const user = await resUser.json();

      // 2. crear cita
      const resCita = await fetch("http://localhost:3000/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: user.id,
          hora_atencion: form.fecha,
          nombre_mascota: form.mascota,
          descripcion: form.descripcion
        })
      });

      if (!resCita.ok) {
        const text = await resCita.text();
        console.error("Error backend:", text);
        return;
      }

      const cita = await resCita.json();

      const nuevaCita = {
        ...cita,    
        nombre: user.nombre, 
        email: user.email,
        telefono: user.telefono
      };

      setAppointments([...appointments, nuevaCita]);

    } catch (error) {
      console.error(error);
  }
};

  const handleUpdate = (updated) => {
    setAppointments(
      appointments.map((a) => (a === updated ? updated : a))
    );
  };

  return (
    <div className="container">
      <div className="left">
        <h3>Día de hoy</h3>

        <button onClick={() => setShowForm(!showForm)}>
          + Agregar cliente
        </button>

        {showForm && <ClientForm onAdd={handleAdd} />}

        <AppointmentList
          appointments={appointments}
          onSelect={setSelected}
        />
      </div>

      <div className="right">
        <AppointmentDetail
          selected={selected}
          onUpdate={handleUpdate}
        />

        <Summary appointments={appointments} />
      </div>
    </div>
  );
}