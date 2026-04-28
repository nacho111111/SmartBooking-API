import { pool } from "../db.js";
import { transactionHandler } from "../middlewares/transactionHandler.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const handleCreate = transactionHandler(async (req, res, client) =>{
  const infoCita = req.body.payload;

    // data cal
    const nuevaCita = {
    id_cal: infoCita.uid,
    nombre: infoCita.responses.name.value,
    email: infoCita.responses.email.value,
    telefono: infoCita.responses.attendeePhoneNumber.value,
    hora_atencion: infoCita.startTime,
    nombre_mascota: infoCita.responses.title?.value || "Sin nombre",
    descripcion: infoCita.responses.notes?.value || "Sin descripcion"
    };

    // Busca o Crea por email o telefono 
    let usuario = await client.query(
      "SELECT id_usuario FROM usuarios WHERE email = $1 OR telefono = $2", [nuevaCita.email, nuevaCita.telefono]);

    let idUsuario;
    if (usuario.rows.length === 0) { // comprueba si existe el usuario
      const nuevoUsuario = await client.query(
        "INSERT INTO usuarios (nombre_usuario, email, telefono) VALUES ($1, $2, $3) RETURNING id_usuario ",
        [nuevaCita.nombre, nuevaCita.email, nuevaCita.telefono]
      );
      idUsuario = nuevoUsuario.rows[0].id_usuario;
    } else {
      idUsuario = usuario.rows[0].id_usuario;
    }

    await client.query(
        "INSERT INTO citas (id_usuario, hora_atencion, nombre_mascota, descripcion, id_cal) VALUES ($1, $2, $3, $4, $5)",
        [ idUsuario, nuevaCita.hora_atencion, nuevaCita.nombre_mascota, nuevaCita.descripcion, nuevaCita.id_cal]
    );

    res.status(200).json({ message: "Cita creada con éxito" });
})

export const handleReschedule = transactionHandler(async (req, res, client) => {
    const infoCita = req.body.payload;

    // data cal
    const nuevaCita = {
      id_cal: infoCita.uid,
      hora_atencion: infoCita.startTime,
      nombre_mascota: infoCita.responses.title?.value || "Sin nombre",
      descripcion: infoCita.responses.notes?.value || "Sin descripcion"
    };

    let idUsuario = await client.query(
      "UPDATE citas SET estado = $1 WHERE nombre_mascota = $2 AND descripcion = $3 RETURNING id_usuario",
    [ "REAGENDADA", nuevaCita.nombre_mascota, nuevaCita.descripcion ]);
    
    await client.query(
        "INSERT INTO citas (id_usuario, hora_atencion, nombre_mascota, descripcion, id_cal) VALUES ($1, $2, $3, $4, $5)",
        [ idUsuario, nuevaCita.hora_atencion, nuevaCita.nombre_mascota, nuevaCita.descripcion, nuevaCita.id_cal]
    );

    await client.query(
        "UPDATE citas SET hora_atencion = $1 WHERE id_cal = $2",
        [infoCita.startTime, infoCita.uid]
    );

    res.status(200).json({ message: "Cita reagendada con éxito" });
});

export const handleCancel = asyncHandler(async (req, res) => {
  const infoCita = req.body.payload;

  await pool.query(
      "UPDATE citas SET estado = $1 WHERE id_cal = $2",
    [ "CANCELADA", infoCita.uid ]);

    res.status(200).json({ message: "Cita cancelada con éxito" });
});