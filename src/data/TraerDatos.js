// Función para consumir promesas generalista.
const traerDatos = async (url) => {
    try {
        const respuesta = await fetch(url)
        if (!respuesta.ok) {
            throw new Error(`Ha habido un error: ${respuesta.status} - ${respuesta.statusText}`);
            
        }
        const datos = await respuesta.json();
		return datos;
    } catch (error) {
        throw error
    }
}

export { traerDatos };
