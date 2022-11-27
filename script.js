const categorias = ["novelas", "academicos", "infantiles", "cuentos"]

const listaLibros = [
    {id:0, nombre:"el corazon delator", categoria:"cuentos", precio: 1200, stock: 10, imgUrl: "./img/corazon.jpg"}, 
    {id:1, nombre:"sapo pepe", categoria:"infantiles", precio: 1700, stock: 37, imgUrl: "./img/sapo.jpg"}, 
    {id:2, nombre:"1984", categoria:"novelas", precio: 2500, stock: 21, imgUrl: "./img/1984.jpg"}, 
    {id:3, nombre:"el proceso", categoria:"novelas", precio: 1800, stock: 9, imgUrl: "./img/proceso.jpg"}, 
    {id:4, nombre:"quimica 2", categoria:"academicos", precio: 1500, stock: 25, imgUrl: "./img/quimica.jpg"}, 
    {id:5, nombre:"cien años de soledad", categoria:"novelas", precio: 2755, stock: 24, imgUrl: "./img/cien.jpg"}, 
    {id:6, nombre:"el principito", categoria:"cuentos", precio: 800, stock: 33, imgUrl: "./img/principito.jpg"}, 
    {id:7, nombre:"alicia en el pais de las maravillas", categoria:"cuentos", precio: 1250, stock: 7, imgUrl: "./img/alicia.jpg"}, 
    {id:8, nombre:"historia del siglo xx", categoria:"academicos", precio: 2189, stock: 11, imgUrl: "./img/historia.jpg"}, 
    {id:9, nombre:"la sombra sobre innsmouth", categoria:"cuentos", precio: 850, stock: 19, imgUrl: "./img/sombra.jpg"}, 
    {id:10, nombre:"la oruga muy hambrienta", categoria:"infantiles", precio: 1100, stock: 1, imgUrl: "./img/oruga.jpg"}, 
    {id:11, nombre:"demian", categoria:"novelas", precio: 1300, stock: 12, imgUrl: "./img/demian.jpg"}, 
    {id:12, nombre:"rebelion en la granja", categoria:"novelas", precio: 1700, stock: 26, imgUrl: "./img/rebelion.jpg"}, 
    {id:13, nombre:"mujercitas", categoria:"infantiles", precio: 940, stock: 10, imgUrl: "./img/mujercitas.jpg"}, 
    {id:14, nombre:"mecanica clasica", categoria:"academicos", precio: 3100, stock: 8, imgUrl: "./img/mecanica.jpg"}, 
    {id:15, nombre:"el pozo y el pendulo", categoria:"cuentos", precio: 1530, stock: 17, imgUrl: "./img/pozo.jpg"}, 
    {id:16, nombre:"luna de pluton", categoria:"infantiles", precio: 50, stock: 100, imgUrl: "./img/luna.jpg"}
]

let libros

let carrito = []

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

function filtrarLibros(categoria){
    let librosFiltrados = libros.filter(libro => libro.categoria === categorias[categoria])
    renderizarLibros(librosFiltrados)
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
            <button id="comprar" class="comprar" onclick=comprar(${libro.id}) >Comprar</button>
            <button class="agregar" ><img class="carrito-agregar" id=${libro.id} src="./img/add.png" alt=""></button>
        `
        tarjetaProducto.append(descripcionProducto)
        contenedorProductos.append(tarjetaProducto)
    }

    /* let botonesComprar = document.getElementsByClassName("comprar")
    for (const boton of botonesComprar) {
      boton.addEventListener("click", comprar)
    }
    */

    let botonesAgregar = document.getElementsByClassName("agregar")
    for (const boton of botonesAgregar) {
      boton.addEventListener("click", agregarAlCarrito)
    }

}

function comprar(idLibro){
    
    localStorage.getItem("libros") ? libros = JSON.parse(localStorage.getItem("libros")) : libros = listaLibros

    let libro = libros.find(elemento => elemento.id === idLibro)
    let cantidad = libro.stock

    if(cantidad>0){
        let indice = libros.indexOf(libro)
        libros[indice].stock -= 1
        localStorage.setItem("libros", JSON.stringify(libros))
        alert("Compra exitosa!")
    }
    else{
        alert("Se agotó el stock de este producto.")
    }

    location.reload()
}

function agregarAlCarrito(e) {

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

    alert("Producto agregado al carrito con exito")
}

function renderizarCarrito() {

    document.getElementById("contenedorProductos").style.display = "none"
    document.getElementById("menu").style.display = "none"
    document.getElementById("catalogo").style.display = "none"
    
    localStorage.getItem("carrito") ? carrito = JSON.parse(localStorage.getItem("carrito")) : carrito = []
    
    let contenedorCarrito = document.getElementById("contenedorCarrito")
    
    contenedorCarrito.innerHTML = `<h2>Mi carrito</h2>`
    for (const itemCarrito of carrito) {
        contenedorCarrito.innerHTML += `
            <div class="itemCarrito">
                <img class="imgLibro" src=${itemCarrito.imgUrl} alt="">
                <div class="descripcion">
                    <h3>${itemCarrito.nombre}</h3>
                    <h4>Precio: $${itemCarrito.precio}</h4>
                    <h4>Unidades: ${itemCarrito.unidades}</h4>
                    <button class="quitar" id=${itemCarrito.id}>Quitar</button>
                </div>
            </div>
        `
    }

    let botonesQuitar = document.getElementsByClassName("quitar")
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", quitarDelCarrito)
    }
}

function quitarDelCarrito(e) {

    localStorage.getItem("carrito") ? carrito = JSON.parse(localStorage.getItem("carrito")) : carrito = []
  
    carrito = carrito.filter(libro => libro.id != e.target.id)

    console.log(e.target.id)

    localStorage.setItem("carrito", JSON.stringify(carrito))

    alert("Producto quitado del carrito con exito")

    renderizarCarrito()
}
