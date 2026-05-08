import { postLogin } from "../services/api";

export const loginManual = async (password) => {
    try {
        const res = await postLogin(password)
        
        if (res.ok) {
            console.log("✅ Listo");
            window.location.reload()
        } else {
            console.error("❌ Clave incorrecta.");
        }
    } catch (err) {
        console.error("Hubo un error en la conexión", err);
    }
};

window.loginManual = loginManual;