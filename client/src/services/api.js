const API_URL = import.meta.env.VITE_API_URL

const handleResponse = async (res) => {
  if (res.status === 204) return null;

  const bodyText = await res.text();

  if (!res.ok) {
    let errorMessage = "Error desconocido";
    try {
      const errorData = JSON.parse(bodyText);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (parseError) {
      errorMessage = bodyText || `Código de error: ${res.status}`;
    }
    const error = new Error(errorMessage);
    error.status = res.status;
    throw error;
  }

  try {
    return JSON.parse(bodyText);
  } catch (e) {
    return bodyText;
  }
};

export const getAppointmentsByDay = (dia) =>
    fetch(`${API_URL}/citas/dia/${dia}`,{credentials: 'include'}).then(handleResponse);
    
export const postCitaFull = (data) => 
  fetch(`${API_URL}/citas/full`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: 'include'
  }).then(handleResponse);

export const postFacturas = (lista) => 
  fetch(`${API_URL}/facturas/multi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lista),
    credentials: 'include'
  }).then(handleResponse);

export const putCitas = (lista) => 
  fetch(`${API_URL}/citas/multi`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lista),
    credentials: 'include'
  }).then(handleResponse);

export const patchMascotaNote = (id,note) =>
  fetch(`${API_URL}/mascotas`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      {
        "id": id,
        "note": note
      }
    ),
    credentials: 'include'
  }).then(handleResponse);

export const getHistoryNums = () =>
  fetch(`${API_URL}/contacts`, {credentials: 'include'}).then(handleResponse);

export const getMessByNum = (num) =>
  fetch(`${API_URL}/messages/${num}`, {credentials: 'include'}).then(handleResponse);

export const postSendMessage = (from, msg) =>
  fetch(`${API_URL}/messages/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      {
        "to": from,
        "message": msg
      }
    ),
    credentials: 'include'
  }).then(handleResponse);
  
export const patchBotActive = (num,val) =>
  fetch(`${API_URL}/botactive/${num}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_active: val }),
        credentials: 'include'
    }).then(handleResponse);

export const getAuth = () =>
  fetch(`${API_URL}/api/login`, {credentials: 'include'}).then(handleResponse);

export const postLogin = (password) =>
  fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
    credentials: 'include'
    }).then(handleResponse);

export const getFacturasMoreInfo = (desde = 1, hasta = 10, filtros = {}) => {
  const params = new URLSearchParams({
  desde: desde.toString(),
  hasta: hasta.toString(),
  ...filtros
  });

  return fetch(`${API_URL}/facturas?${params.toString()}`, {
    credentials: 'include'
  }).then(handleResponse);

}

export const getMascotasMoreInfo = (desde = 1, hasta = 10, filtros = {}) => {
  const params = new URLSearchParams({
  desde: desde.toString(),
  hasta: hasta.toString(),
  ...filtros // { nombre_mascota: 'Luna' } 
  });

  return fetch(`${API_URL}/mascotas?${params.toString()}`, {
    credentials: 'include'
    }).then(handleResponse);
};
