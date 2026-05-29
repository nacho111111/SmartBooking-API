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
    return {
        salesList,
        setSalesList
    }
}