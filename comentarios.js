const JSON_BIN_URL = "https://api.jsonbin.io/v3/b/67e6f7698960c979a57a5c4e";
const JSON_BIN_API_KEY = "$2a$10$OTUY/ZUBpn6OI.iIUy7dC.yKbe5RK.0g5PKDawHGS3RO1j4jITm0O";  // La obtienes en JSONBin

async function obtenerComentarios() {
    try {
        const respuesta = await fetch(JSON_BIN_URL, {
            method: "GET",
            headers: {
                "X-Master-Key": JSON_BIN_API_KEY
            }
        });
        const datos = await respuesta.json();
        return datos.record.comentarios || [];
    } catch (error) {
        console.error("❌ Error al obtener comentarios:", error);
        return [];
    }
}

async function guardarComentario() {
    let comentario = document.getElementById("comentario").value;
    if (comentario.trim() === "") return alert("Escribe un comentario");

    let comentarios = await obtenerComentarios();
    comentarios.push(comentario);

    try {
        await fetch(JSON_BIN_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": JSON_BIN_API_KEY
            },
            body: JSON.stringify({ comentarios })
        });

        document.getElementById("comentario").value = "";
        mostrarComentarios();
    } catch (error) {
        console.error("❌ Error al guardar comentario:", error);
    }
}

async function mostrarComentarios() {
    let lista = document.getElementById("listaComentarios");
    lista.innerHTML = "";

    let comentarios = await obtenerComentarios();
    comentarios.forEach(comentario => {
        let li = document.createElement("li");
        li.textContent = comentario;
        lista.appendChild(li);
    });
}

// Cargar comentarios al abrir la página
document.addEventListener("DOMContentLoaded", mostrarComentarios);

// Hacer accesible la función en el HTML
window.guardarComentario = guardarComentario;

