import { getAuth, postLogin } from "../services/api";

export const loginManual = async (password) => {
    try {
        const res = await postLogin(password)
        
        if (res.message) {
            console.log("✅ Listo");
            window.location.reload()
        } else {
            console.error("❌ Clave incorrecta.");
        }
    } catch (err) {
        console.error("Hubo un error en la conexión", err);
    }
};

export const isAuth = async () => {
    const res = await getAuth()
    if (!res.authorized){
        return false;
    }
    return true;
}

window.loginManual = loginManual;