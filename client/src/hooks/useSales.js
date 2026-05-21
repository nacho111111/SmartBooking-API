import { useEffect, useState } from "react";
import { dailyClean } from "../utils/dailyClean"

export const useSales = () => {

    const [salesList, setSalesList] = useState(() => {
        //localStorage.removeItem("facturacion_borrador");
        const saved = localStorage.getItem("facturacion_borrador");
        if (saved) return JSON.parse(saved);
        return [];
    });

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