const nombre = document.getElementById("name")
const email = document.getElementById("email")
const coment = document.getElementById("mensaje")
const form = document.getElementById("form")
const parrafo = document.getElementById("warnings")

form.addEventListener("submit", e=>{
    e.preventDefault()
    let warnings = ""
    let entrar = false
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
    parrafo.innerHTML = ""
    if(nombre.value.length < 6){
        warnings += `El nombre no es valido, minimo 6 caracteres <br>`
        entrar = true
    }
    if(!regexEmail.test(email.value)){
        warnings += `El correo no es valido <br>`
        entrar = true
    }
    if(coment.value.length < 4){
        warnings += `El comentario no es valido <br>`
        entrar = true
    }

    if(entrar){
        parrafo.innerHTML = warnings
    }else{
        Swal.fire({
            title: "El formulario fue enviado satisfactoriamente",
            width: 600,
            padding: "3em",
            color: "#E16464",
            background: "#fff",
            backdrop: 'rgba(165, 11, 0, 0.63)'
        });
    }

})