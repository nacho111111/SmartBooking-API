import { useState, useEffect } from "react";
import { useAction } from "../context/ActionContext";
import { getMascotasMoreInfo, patchMascotaNote } from "../services/api";

export const useMascotas = () => {
 
    const [mascotasInfo, setMascotasInfo] = useState([]); // facturas todo
    const { run } = useAction();

    const handleGetMascotasMoreInfo = (desde, hasta, filtros) => {
        run(async () => {
            const data = await getMascotasMoreInfo(desde, hasta, filtros);
            setMascotasInfo(data)
        })
    }
    const handleSetMascotasNotes= (id,note) => {
        run(async () => {
        await patchMascotaNote(id,note);
        })
    }
    return {
        mascotasInfo,
        handleGetMascotasMoreInfo,
        handleSetMascotasNotes
    }
}