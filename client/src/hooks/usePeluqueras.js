import { useEffect, useState } from "react";

export const usePeluqueras = () => {

const [listPeluqueras, setListPeluqueras] = useState(() => {
    const guardadas = localStorage.getItem("lista_peluqueras_config");
    return guardadas ? JSON.parse(guardadas) : ["no hay datos"];
  });

const handleAddPel = (nuevoNombre) => {
    const nombreLimpio = nuevoNombre.trim();
    if (!nombreLimpio) return;
    const nuevaLista = [...listPeluqueras, nombreLimpio];
    setListPeluqueras(nuevaLista);
    localStorage.setItem("lista_peluqueras_config", JSON.stringify(nuevaLista));
  };

  const handleDeletePel = (nombreAEliminar) => {
    const nuevaLista = listPeluqueras.filter(nombre => nombre !== nombreAEliminar);
    setListPeluqueras(nuevaLista);
    localStorage.setItem("lista_peluqueras_config", JSON.stringify(nuevaLista));
  };
  return {
    listPeluqueras,
    handleAddPel,
    handleDeletePel
  }
}