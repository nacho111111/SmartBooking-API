import { postUsuario, postCita } from "./api";

export const createAppointmentWithUser = async (form) => {

  // 1.usuario
  const user = await postUsuario({
    nombre: form.nombre,
    email: form.email,
    telefono: form.telefono,
  });

  // 2.cita
  const cita = await postCita({
    id_usuario: user.id_usuario,
    hora_atencion: form.fecha,
    nombre_mascota: form.mascota,
    descripcion: form.descripcion,
  });

  // 3. return usuario + cita
  return {
    ...cita,
    id_usuario : user.id_usuario,
    nombre_usuario: user.nombre,
    email: user.email,
    telefono: user.telefono,
  };
};