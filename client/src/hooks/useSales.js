import { useEffect, useState } from "react";
import { dailyClean } from "../utils/dailyClean"
import { getFacturasByDay } from "../services/api";
export const useSales = () => {

    const [salesList, setSalesList] = useState(() => {
        //localStorage.removeItem("facturacion_borrador");
        const saved = localStorage.getItem("facturacion_borrador");
        if (saved) return JSON.parse(saved);
        return [];
    });
    useEffect(() => {// no hay local, pide a db
        const getFacturas = async () => {
            if (salesList.length === 0) {
                try {
                    const hoy = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                        .toISOString()
                        .split("T")[0];
                    const facturasDB = await getFacturasByDay(hoy);
                    
                    if (facturasDB && facturasDB.length > 0) {
                        setSalesList(facturasDB);
                    }
                } catch (error) {
                    console.error("Error get facturas de la DB:", error);
                }
            }
        };
        getFacturas();
    }, []); 

    useEffect(() => {
        if (salesList.length > 0) {
            localStorage.setItem("facturacion_borrador", JSON.stringify(salesList));
        }
        else {
            localStorage.removeItem("facturacion_borrador");
        }
    }, [salesList]);

    useEffect(() => { // limpia dia
        const runClean = () => {
            const cleaned = dailyClean();
            if (cleaned) {
                setSalesList([]);
            }
        };
        runClean();
        const interval = setInterval(runClean, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSyncAppointments = (appointments,peluqueras) => {
        if (!appointments || appointments.length === 0) {
            return;
        }
        const idsExistentes = new Set(appointments.map(f => f.id_cita));
        setSalesList(prevList => {
            const listaSegura = Array.isArray(prevList) ? prevList : [];

            const ventasFiltradas = listaSegura.filter(
                factura => idsExistentes.has(factura.id_cita)
            );

            const idsExistentesEnVentas = new Set(
                ventasFiltradas.map(f => f.id_cita)
            );

            const nuevasCitas = appointments.filter(
                cita => !idsExistentesEnVentas.has(cita.id_cita)
            );
            const ordenIdsCorrecto = appointments.map(c => c.id_cita);

            const ordenEstaCorrecto = ventasFiltradas.length === listaSegura.length && 
                ventasFiltradas.every((factura, index) => factura.id_cita === ordenIdsCorrecto[index]);
            // no hay cambios en la lista 
            if (nuevasCitas.length === 0 && ordenEstaCorrecto) {
                return listaSegura;
            }

            let listaFinal = [...ventasFiltradas];
                
            if (nuevasCitas.length > 0) {
                const nuevasFacturas = nuevasCitas.map((cita) => ({
                asistio: true,
                peluquera: peluqueras?.[0] || "Sin asignar",
                id_cita: cita.id_cita,
                id_usuario: cita.id_usuario,
                total_peluqueria: 0,
                total_productos: 0,
                total_final: 0,
                tipo_pago: "efectivo",
                }));
                listaFinal = [...listaFinal, ...nuevasFacturas];  
            }

            listaFinal.sort((a, b) => ordenIdsCorrecto.indexOf(a.id_cita) - ordenIdsCorrecto.indexOf(b.id_cita));
            return listaFinal;
        })
    };

    const handlerUpdateFactura = (index, field, value) => {
        setSalesList(prev => {
            const updated = [...prev];
            const factura = { ...updated[index] };

            if (field === "total_peluqueria" || field === "total_productos") {
                factura[field] = Number(value) || 0;

                factura.total_final = 
                    Number(factura.total_peluqueria) + 
                    Number(factura.total_productos);
            } else {
                factura[field] = value;
            }
            updated[index] = factura;
            return updated;
        });
    };
    return {
        salesList,
        handleSyncAppointments,
        handlerUpdateFactura
    }
}