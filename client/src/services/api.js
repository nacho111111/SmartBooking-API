const API_URL = "http://localhost:3000";

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error en la petición");
  }
  return res.json();
};

export const getAppointmentsByDay = (dia) =>
    fetch(`${API_URL}/citas/dia/${dia}`).then(handleResponse);
    
export const postUsuario = (data) => 
  fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const postCita = (data) => 
  fetch(`${API_URL}/citas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const postFacturas = (lista) => 
  fetch(`${API_URL}/facturas/multi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lista),
  }).then(handleResponse);