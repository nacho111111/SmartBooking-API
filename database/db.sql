CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20) NOT NULL,
    creado_el TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- /////////////////


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

-- /////////////////

BEGIN;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_pago_enum') THEN
        CREATE TYPE tipo_pago_enum AS ENUM ('efectivo', 'tarjeta', 'transferencia');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS facturas (
    id SERIAL PRIMARY KEY,
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


CREATE INDEX idx_facturas_usuario ON facturas(id_usuario);
CREATE INDEX idx_facturas_cita ON facturas(id_cita);
CREATE INDEX idx_facturas_fecha ON facturas(creado_el);