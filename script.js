

async function pruebaAsync() {
    const respuesta = await fetch("./libros/libros.json")
    const data = await respuesta.json()
    miPrograma(data)
}
pruebaAsync()

const categorias = ["novelas", "academicos", "infantiles", "cuentos"]

let libros

let carrito = []

function miPrograma(listaLibros){
    
    if(localStorage.getItem("libros")){
        libros = JSON.parse(localStorage.getItem("libros"))
    }
    else{
        libros = listaLibros
        localStorage.setItem("libros", JSON.stringify(libros))
    }
    
    renderizarLibros(libros)
    
    let botonCarrito = document.getElementById("verCarrito")
    botonCarrito.addEventListener("click", renderizarCarrito)

    let botonesFiltrar = document.getElementsByClassName("filtro")
    for (const boton of botonesFiltrar) {
        boton.addEventListener("click", filtrarLibros)
    }
    
}

function filtrarLibros(e){

    let categoria = e.target.id

    for (let i=0; i<4; i++) {
        if(categoria == categorias[i]) {
            let librosFiltrados = libros.filter(libro => libro.categoria === categorias[i])
            renderizarLibros(librosFiltrados)
        }
    }
}

function renderizarLibros(lista){

    let contenedorProductos = document.getElementById("contenedorProductos")

    contenedorProductos.innerHTML = ''

    for (const libro of lista) {
        let tarjetaProducto = document.createElement("div")
        let descripcionProducto = document.createElement("div")
        let clase

        libro.stock < 10 ?  clase = "productoSinStock" : clase = "producto"
        
        descripcionProducto.className = clase

        tarjetaProducto.className = "tarjeta"

        tarjetaProducto.style = `background-image: url(${libro.imgUrl})`

        descripcionProducto.innerHTML = `
            <h3 class="nombreProducto">${libro.nombre}</h3>
            <h4>$${libro.precio}</h4>
            <p>Categoria: ${libro.categoria}</p>
            <p>Quedan ${libro.stock} u.</p>
            <button class="agregar" ><img class="carrito-agregar" id=${libro.id} src="./img/add.png" alt=""></button>
        `
        tarjetaProducto.append(descripcionProducto)
        contenedorProductos.append(tarjetaProducto)
    }

    let botonesAgregar = document.getElementsByClassName("agregar")
    for (const boton of botonesAgregar) {
        boton.addEventListener("click", agregarAlCarrito)
    }

}

function comprar(e){

    localStorage.getItem("carrito") ? carrito = JSON.parse(localStorage.getItem("carrito")) : carrito = []
  
    carrito = carrito.filter(libro => libro.id != e.target.id)

    localStorage.setItem("carrito", JSON.stringify(carrito))

    Swal.fire({
        title: 'Compra exitosa!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
    })    

    renderizarCarrito()

}

function agregarAlCarrito(e) {

    localStorage.getItem("libros") ? libros = JSON.parse(localStorage.getItem("libros")) : libros = listaLibros

    let libro = libros.find(elemento => elemento.id == e.target.id)
    let cantidad = libro.stock

    if(cantidad>0){

        localStorage.getItem("carrito") ? carrito = JSON.parse(localStorage.getItem("carrito")) : carrito = []

        let libroBuscado = libros.find(libro => libro.id == e.target.id)
        let posicionLibro = carrito.findIndex(libro => libro.id == e.target.id)
      
        if (posicionLibro != -1) {
            carrito[posicionLibro] = {
                id: carrito[posicionLibro].id, nombre: carrito[posicionLibro].nombre, precio: carrito[posicionLibro].precio, unidades: carrito[posicionLibro].unidades + 1, imgUrl: carrito[posicionLibro].imgUrl
            }
        } else {
            carrito.push({
                id: libroBuscado.id, nombre: libroBuscado.nombre, precio: libroBuscado.precio, unidades: 1, imgUrl: libroBuscado.imgUrl
            })
        }
    
        localStorage.setItem("carrito", JSON.stringify(carrito))

        Swal.fire({
            title: 'Producto agregado al carrito con exito',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
        })  

        let indice = libros.indexOf(libro)
        libros[indice].stock -= 1
        localStorage.setItem("libros", JSON.stringify(libros))
    }
    else{
        Swal.fire({
            title: 'Producto agotado',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
        })  
    }

    renderizarLibros(libros)
}

function renderizarCarrito() {

    document.getElementById("contenedorProductos").style.display = "none"
    document.getElementById("menu").style.display = "none"
    document.getElementById("catalogo").style.display = "none"
    
    localStorage.getItem("carrito") ? carrito = JSON.parse(localStorage.getItem("carrito")) : carrito = []
    
    let contenedorCarrito = document.getElementById("contenedorCarrito")
    
    contenedorCarrito.innerHTML = `<h2>Mi carrito</h2>`
    for (const itemCarrito of carrito) {
        let subtotal = itemCarrito.precio * itemCarrito.unidades
        contenedorCarrito.innerHTML += `
            <div class="itemCarrito">
                <img class="imgLibro" src=${itemCarrito.imgUrl} alt="">
                <div class="descripcion">
                    <h3>${itemCarrito.nombre}</h3>
                    <h4>Subtotal: $${subtotal}</h4>
                    <h4>Unidades: ${itemCarrito.unidades}</h4>
                </div>
                <div class="botones">
                    <button class="comprar" id=${itemCarrito.id}>Comprar</button>
                    <button class="quitar" id=${itemCarrito.id}>Quitar</button>
                </div>
            </div>
        `
    }

    let contenedorVaciar = document.createElement("div")
    contenedorVaciar.className = "vaciarCarrito"

    contenedorVaciar.innerHTML = `
        <button class="vaciar" id="vaciar">Vaciar carrito</button>
    `
    contenedorCarrito.append(contenedorVaciar)

    let botonVaciar = document.getElementById("vaciar")
    botonVaciar.addEventListener("click", vaciarCarrito)

    let botonesQuitar = document.getElementsByClassName("quitar")
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", quitarDelCarrito)
    }

    let botonesComprar = document.getElementsByClassName("comprar")
    for (const boton of botonesComprar) {
      boton.addEventListener("click", comprar)
    }
}

function quitarDelCarrito(e) {

    localStorage.getItem("carrito") ? carrito = JSON.parse(localStorage.getItem("carrito")) : carrito = []

    let libroCarrito = carrito.find(libro => libro.id == e.target.id)
  
    carrito = carrito.filter(libro => libro.id != e.target.id)

    localStorage.setItem("carrito", JSON.stringify(carrito))

    localStorage.getItem("libros") ? libros = JSON.parse(localStorage.getItem("libros")) : libros = listaLibros

    let libro = libros.find(elemento => elemento.id == e.target.id)

    let indice = libros.indexOf(libro)
    libros[indice].stock += libroCarrito.unidades
    localStorage.setItem("libros", JSON.stringify(libros))

    Swal.fire({
        title: 'Producto retirado del carrito',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
    })

    renderizarCarrito()
}

function vaciarCarrito(e) {
    localStorage.getItem("carrito") ? carrito = JSON.parse(localStorage.getItem("carrito")) : carrito = []

    localStorage.getItem("libros") ? libros = JSON.parse(localStorage.getItem("libros")) : libros = listaLibros

    for (const itemCarrito of carrito) {
        let libro = libros.find(elemento => elemento.id == itemCarrito.id)

        let indice = libros.indexOf(libro)
        libros[indice].stock += itemCarrito.unidades
    }
    
    localStorage.setItem("libros", JSON.stringify(libros))

    carrito = []

    localStorage.setItem("carrito", JSON.stringify(carrito))

    Swal.fire({
        title: 'Carrito vaciado con exito',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
    })

    renderizarCarrito()
}