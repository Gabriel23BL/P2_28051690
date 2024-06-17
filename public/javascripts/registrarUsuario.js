const registroUsuarios = document.getElementById("registrar");

registroUsuarios.addEventListener("submit", registrar);

async function registrar(e) {
  e.preventDefault();

  const correo = e.target.correo.value;
  const nombre = e.target.nombre.value;
  const comentario = e.target.comentario.value;
  const clave = e.target.clave.value;
  const clave2 = e.target.clave2.value;

  try {
    const response = await fetch("http://localhost:3000/api/usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo, nombre, comentario, clave, clave2 }),
    });
    
    const data = await response.json();

    if (data.status == "ok") { 
      document.getElementById('msj').innerText = `${data.message}`;
      console.log("Usuario creado:", data.message);
      // Aquí puedes agregar lógica para actualizar la UI
    } else {
      console.error("Error al crear el usuario:", data.status);
    }
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
};
