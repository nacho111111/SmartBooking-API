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
  telefono: infoCita.responses.attendeePhoneNumber.value.replace('+', ''),// quita el +
  hora_atencion: infoCita.startTime,
  nombre_mascota: infoCita.responses.title?.value || "Sin nombre",
  descripcion: infoCita.responses.notes?.value || "Sin descripcion"
  };

  // Busca o crea usuario
  const queryU = `
    INSERT INTO usuarios (nombre_usuario, email, telefono)
    VALUES ($1, $2, $3)
    ON CONFLICT (telefono) 
    DO UPDATE SET 
      nombre_usuario = COALESCE(EXCLUDED.nombre_usuario, usuarios.nombre_usuario),
      email = COALESCE(EXCLUDED.email, usuarios.email)
    RETURNING id_usuario;
  `;

  const result = await client.query(queryU, [
    nuevaCita.nombre, 
    nuevaCita.email, 
    nuevaCita.telefono
  ]);

  const idUsuario = result.rows[0].id_usuario;

  // busca o crea mascota  
  
  const queryM = `
    INSERT INTO mascotas (id_usuario, nombre_mascota)
    VALUES ($1, $2)
    ON CONFLICT (id_usuario, nombre_mascota) 
    DO UPDATE SET nombre_mascota = EXCLUDED.nombre_mascota
    RETURNING id_mascota;
  `;

  const resMascota = await client.query(queryM, [
    idUsuario, 
    nuevaCita.nombre_mascota
  ]);

  const idMascota = resMascota.rows[0].id_mascota;

  await client.query(`
    INSERT INTO citas (id_usuario, hora_atencion, id_mascota, descripcion, id_cal) 
    VALUES ($1, $2, $3, $4, $5) 
    ON CONFLICT (id_cal) DO NOTHING;`,
    [ idUsuario, nuevaCita.hora_atencion, idMascota, nuevaCita.descripcion, nuevaCita.id_cal]
  );
})

export const handleReschedule = transactionHandler(async (req, res, client) => {
    const infoCita = req.body.payload;

    // data cal
    const nuevaCita = {
      id_cal: infoCita.uid,
      nombre: infoCita.responses.name.value,
      hora_atencion: infoCita.startTime,
      nombre_mascota: infoCita.responses.title?.value || "Sin nombre",
      descripcion: infoCita.responses.notes?.value || "Sin descripcion"
    };
    const query = `
    UPDATE citas AS c
      SET estado = $1 
      FROM mascotas AS m
      WHERE m.id_mascota = c.id_mascota
      AND m.nombre_mascota = $2 
      AND c.descripcion = $3 
      AND c.hora_atencion > NOW()
      AND c.estado IS NULL
      RETURNING c.id_usuario, c.id_mascota;`

    let { rows } = await client.query(query,
    [ "REAGENDADA", nuevaCita.nombre_mascota, nuevaCita.descripcion ]);

    if (rows.length != 1) {
      console.error("Error en la integridad de los datos, no existe o esta duplicada una cita a actualizar");
      return res.status(500);
    }
    await client.query(
        "INSERT INTO citas (id_usuario, hora_atencion, id_mascota, descripcion, id_cal) VALUES ($1, $2, $3, $4, $5);",
        [ rows[0].id_usuario, nuevaCita.hora_atencion, rows[0].id_mascota, nuevaCita.descripcion, nuevaCita.id_cal]
    );
    res.status(200);
});

export const handleCancel = asyncHandler(async (req, res) => {
  const infoCita = req.body.payload;

  await pool.query(
      "UPDATE citas SET estado = $1 WHERE id_cal = $2;",
    [ "CANCELADA", infoCita.uid ]);

  res.status(200);
});

// const linkCal = `https://cal.com/nacho-3oejwr/15min?
//                  name=Juan&
//                  email=juan%40mail.com&
//                  attendeePhoneNumber=56987484319&
//                  title=Bobby&
//                  notes=tiene+una+pulga` 