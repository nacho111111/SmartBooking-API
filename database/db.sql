CREATE TYPE chat_role AS ENUM ('user', 'model', 'system');
CREATE TYPE tipo_pago_enum AS ENUM ('efectivo', 'transferencia', 'debito', 'credito');

-- /////////////////
-- TABLA USUARIOS
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(255),
    email VARCHAR(255),
    telefono VARCHAR(20) NOT NULL UNIQUE,
    creado_el TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    bot_active BOOLEAN DEFAULT true,
    CONSTRAINT unique_telefono UNIQUE (telefono)
);

-- TABLA CITAS
CREATE TABLE citas (
    id_cita SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    hora_atencion TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    nombre_mascota VARCHAR(100) NOT NULL,
    descripcion TEXT,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_cal VARCHAR(255) UNIQUE,
    estado VARCHAR(255),
    peluquera VARCHAR(255),
    asistio BOOLEAN,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- TABLA FACTURAS
CREATE TABLE facturas (
    id_factura SERIAL PRIMARY KEY,
    id_cita INTEGER UNIQUE,
    id_usuario INTEGER NOT NULL,
    total_peluqueria NUMERIC(12,2) DEFAULT 0.00,
    total_productos NUMERIC(12,2) DEFAULT 0.00,
    total_final NUMERIC(12,2) GENERATED ALWAYS AS (total_peluqueria + total_productos) STORED,
    tipo_pago tipo_pago_enum NOT NULL,
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cita_factura FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE SET NULL,
    CONSTRAINT fk_usuario_factura FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);

-- TABLA CHAT_HISTORY
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    whatsapp_number VARCHAR(20) NOT NULL,
    role chat_role NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_usuario FOREIGN KEY (whatsapp_number) REFERENCES usuarios(telefono) ON UPDATE CASCADE ON DELETE CASCADE
);
-- TABLA MASCOTAS

CREATE TABLE mascotas (
    id_mascota SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    nombre_mascota VARCHAR(100) NOT NULL,
    notas TEXT,
    creado_el TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_usuario 
        FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id_usuario) 
        ON DELETE CASCADE,

    CONSTRAINT uq_usuario_mascota 
        UNIQUE (id_usuario, nombre_mascota)
);

ALTER TABLE citas 

    DROP COLUMN IF EXISTS nombre_mascota,

    ADD COLUMN id_mascota INTEGER NOT NULL,

    ADD CONSTRAINT fk_mascota_cita 
        FOREIGN KEY (id_mascota) 
        REFERENCES mascotas(id_mascota) 
        ON DELETE CASCADE;

-- Índices para Citas
CREATE INDEX idx_citas_usuario ON citas(id_usuario);
CREATE INDEX idx_citas_fecha ON citas(hora_atencion);

-- Índices para Usuarios
CREATE INDEX idx_usuario_nombre ON usuarios(nombre_usuario); -- Corregido de 'nombre' a 'nombre_usuario'
CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_usuarios_tel ON usuarios(telefono);

-- Índices para Facturas
CREATE INDEX idx_facturas_usuario ON facturas(id_usuario);
CREATE INDEX idx_facturas_cita ON facturas(id_cita);
CREATE INDEX idx_facturas_fecha ON facturas(creado_el);

-- Índices para Chat History
CREATE INDEX idx_chat_history_num ON chat_history(whatsapp_number);


-- /////////////////

UPDATE usuarios  -- borrar +
SET telefono = REPLACE(telefono, '+', '') 
WHERE telefono LIKE '+%';



CREATE INDEX idx_citas_id_mascota ON citas(id_mascota);
CREATE INDEX idx_mascotas_id_usuario ON mascotas(id_usuario);
ALTER TABLE citas 

    DROP COLUMN IF EXISTS nombre_mascota,

    ADD COLUMN id_mascota INTEGER NOT NULL,
    
    ADD CONSTRAINT fk_mascota_cita 
        FOREIGN KEY (id_mascota) 
        REFERENCES mascotas(id_mascota) 
        ON DELETE CASCADE;