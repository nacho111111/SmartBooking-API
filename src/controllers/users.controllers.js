import { pool } from "../db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
    const { rows } = await pool.query("SELECT * from usuarios");
    res.json(rows);
});

export const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM usuarios WHERE id_usuario = $1",[id]);
    if (rows.length ===0){
        return res.status(404).json({ message: "User not found" })
    }
    res.json(rows[0]);  
});

export const createUser = asyncHandler(async (req, res) => {
    const { nombre, email, telefono } = req.body;
    const { rows } = await pool.query(
        "INSERT INTO usuarios (nombre_usuario, email, telefono) VALUES ($1, $2, $3) RETURNING *",
        [nombre, email, telefono]
    );
    res.status(201).json(rows[0]);
        
});

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *",[id]);
    if (rowCount === 0){
        return res.status(404).json({ message: "Usuario no encontrado" })
    }
    res.sendStatus(204);
});

export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono } = req.body;
    const { rows } = await pool.query(
        "UPDATE usuarios SET nombre_usuario = $1, email = $2, telefono = $3 WHERE id_usuario = $4 RETURNING *",
        [nombre, email, telefono, id])
    if (rowCount === 0){
        return res.status(404).json({ message: "Usuario no encontrado" })
    }
    res.json(rows[0]);
});

