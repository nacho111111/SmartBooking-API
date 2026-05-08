CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20) NOT NULL,
    creado_el TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- /////////////////


BEGIN;

CREATE TABLE IF NOT EXISTS citas (
    id_cita SERIAL PRIMARY KEY,

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
ALTER TABLE citas ADD COLUMN id_externo_cal VARCHAR(255);
ALTER TABLE citas ADD COLUMN estado VARCHAR(255);
ALTER TABLE citas ADD COLUMN peluquera VARCHAR(255);
ALTER TABLE citas ADD COLUMN asistio BOOLEAN DEFAULT NULL;

BEGIN;



COMMIT;

-- /////////////////

BEGIN;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_pago_enum') THEN
        CREATE TYPE tipo_pago_enum AS ENUM ('efectivo', 'tarjeta', 'transferencia');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS facturas (
    id_factura SERIAL PRIMARY KEY,
    id_cita INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    total_peluqueria NUMERIC(12, 2) DEFAULT 0.00,
    total_productos NUMERIC(12, 2) DEFAULT 0.00,
    total_final NUMERIC(12, 2) GENERATED ALWAYS AS (total_peluqueria + total_productos) STORED,
    tipo_pago tipo_pago_enum NOT NULL,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Relaciones
    CONSTRAINT CONSTRAINT fk_cita_factura 
        FOREIGN KEY (id_cita) 
        REFERENCES citas(id) 
        ON DELETE SET NULL,
        
    CONSTRAINT fk_usuario_factura 
        FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id) 
        ON DELETE RESTRICT
);

COMMIT;


CREATE TYPE chat_role AS ENUM ('user', 'model');

CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    whatsapp_number VARCHAR(20) NOT NULL,
    role chat_role NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



ALTER TABLE usuarios ADD COLUMN bot_active BOOLEAN DEFAULT TRUE;
ALTER TABLE chat_history DROP COLUMN bot_active;

DELETE FROM usuarios
WHERE ctid NOT IN (
    SELECT MIN(ctid)
    FROM usuarios
    GROUP BY telefono
);

DELETE FROM facturas
WHERE id_usuario IN (
    SELECT id_usuario 
    FROM usuarios
    WHERE ctid NOT IN (
        SELECT MIN(ctid)
        FROM usuarios
        GROUP BY telefono 
    )
);

ALTER TABLE usuarios ADD CONSTRAINT unique_usuario_telefono UNIQUE (telefono);

UPDATE usuarios  -- borrar +
SET telefono = REPLACE(telefono, '+', '') 
WHERE telefono LIKE '+%';

CREATE INDEX idx_citas_usuario ON citas(id_usuario);
CREATE INDEX idx_citas_fecha ON citas(hora_atencion);
CREATE INDEX idx_usuario_fecha ON usuarios(nombre);
CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_usuarios_tel ON usuarios(telefono);
CREATE INDEX idx_facturas_usuario ON facturas(id_usuario);
CREATE INDEX idx_facturas_cita ON facturas(id_cita);
CREATE INDEX idx_facturas_fecha ON facturas(creado_el);
CREATE INDEX idx_chat_history_num ON chat_history(whatsapp_number);

DROP INDEX idx_chat_history_whatsapp_number;

ALTER TABLE usuarios 
DROP CONSTRAINT unique_usuario_telefono;

ALTER TABLE chat_history
ADD CONSTRAINT fk_chat_usuario
FOREIGN KEY (whatsapp_number) 
REFERENCES usuarios(telefono)
ON UPDATE CASCADE
ON DELETE CASCADE;
