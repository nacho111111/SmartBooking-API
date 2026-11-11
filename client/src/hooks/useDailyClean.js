import { useEffect, useState,useCallback } from "react";
import { checkDailyClean, markCleanComplete } from "../utils/dailyClean";
import { getFacturasByDay, postSincronizarCaja } from "../services/api";
import { useAction } from "../context/ActionContext";
import { toast } from "sonner";
//hook composition
export const useDailyClean = (setSalesList) => { //hook dependiente de useSales
    
    const { run } = useAction();
    // Estados para controlar el Pop-up desde el Dashboard
    const [isCleanModalOpen, setIsCleanModalOpen] = useState(false);
    const [dailyCleanData, setDailyCleanData] = useState({ hoyStr: "", pendientes: [] });
    
    const executeDailyClean = useCallback(async() => {
            const { shouldClean, hoyStr, pendientes } = checkDailyClean();

            if (!shouldClean) return;

            if (pendientes.length > 0) {
                setDailyCleanData({ hoyStr, pendientes });
                setIsCleanModalOpen(true); // pop-up en el Dashboard/Componente
                return; //
            }
            // Si no hay pendientes, limpia directamente
            markCleanComplete(hoyStr);
            setSalesList([]);
            toast.info("Se ha realizado la limpieza diaria de la caja.");
        },[]);

    useEffect(() => { // limpia dia
        executeDailyClean();

        const interval = setInterval(executeDailyClean, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [executeDailyClean]);

    const handleConfirmClean = async () => { // confirmacion de limpieza por parte del usuario
        try {
            if (dailyCleanData.pendientes.length > 0) {
                await handlePostSincronizarCaja(dailyCleanData.pendientes);
                toast.warning(
                    `Se sincronizaron automáticamente ${dailyCleanData.pendientes.length} cita(s) desfasada(s).`
                );
            }
            
            markCleanComplete(dailyCleanData.hoyStr);
            setSalesList([]);
            setIsCleanModalOpen(false);
            toast.success("Limpieza diaria completada con éxito.");
        } catch (err) {
            console.error("Error al sincronizar en la limpieza:", err);
            toast.error("Error al procesar la limpieza diaria.");
        }
    };
    const handleCancelClean = () => {// cancelacion de limpieza por parte del usuario
        setIsCleanModalOpen(false);
        setSalesList([]);
    };
    
    const handlePostSincronizarCaja = (pendientes) => {
        run(async () => {
            await postSincronizarCaja(pendientes);
        });
    }
    return {
        isCleanModalOpen,
        dailyCleanData,
        handleConfirmClean,
        handleCancelClean
    }
}

