CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20) NOT NULL,
    creado_el TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (name, email) VALUES ('john', 'john@gmail.com');

SELECT FROM usuarios;

BEGIN;

CREATE TABLE IF NOT EXISTS citas (
    id SERIAL PRIMARY KEY,

    id_usuario INTEGER NOT NULL,
    CONSTRAINT fk_usuario
        FOREIGN KEY(id_usuario) 
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    hora_atencion TIMESTAMP NOT NULL,
    
    nombre_mascota VARCHAR(100) NOT NULL,
    descripcion TEXT,
    
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMIT;

BEGIN;
CREATE INDEX IF NOT EXISTS idx_citas_usuario ON citas(id_usuario);
CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas(hora_atencion);
CREATE INDEX IF NOT EXISTS idx_usuario_fecha ON usuarios(nombre);
CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuarios(email);

COMMIT;