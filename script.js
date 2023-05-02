
fetch("./data.json")
  .then(respuesta => respuesta.json())
  .then(Productos => {
    productosRenderizados(Productos) 
  } )


let carrito = []
let montoAPagar
let productoSeleccionado
let verCarrito = document.getElementById("verCarrito")
let nodalContainer = document.getElementById("nodal-container")

if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"))
}




function productosRenderizados(Productos) {

  let contenedorDiscografia = document.getElementById("contenedorDiscografia")
  for (const producto of Productos) {
    let tarjetaDisco = document.createElement("div")
    tarjetaDisco.className = "tarjetaDisco"
    tarjetaDisco.id = producto.id
    tarjetaDisco.innerHTML = `
  <h2 class=tituloDisco>${producto.articulo}</h2>
  <img class=tarjeta-imagen src=${producto.img}>
  <h3 class=precio-tarjeta>$ ${producto.precio}</h3>
  <h3 class=boton-tarjeta id=${producto.id}></h3>
`
    contenedorDiscografia.appendChild(tarjetaDisco)
    botonComprar = document.getElementById(producto.id)
    botonComprar.addEventListener("click", (e)=> agregarAlCarrito(e, Productos))

  }

}

  function agregarAlCarrito(e, prods) {
    productoSeleccionado = prods.find(producto => producto.id === Number(e.target.id))
    toast()
    if (carrito.some(producto => producto.id === productoSeleccionado.id)) {
      let productoEnCarrito = carrito.findIndex(producto => producto.id == productoSeleccionado.id)
      carrito[productoEnCarrito].unidades++
      carrito[productoEnCarrito].subtotal = carrito[productoEnCarrito].precio * carrito[productoEnCarrito].unidades
      
    } else {
      carrito.push({
        id: productoSeleccionado.id,
        articulo: productoSeleccionado.articulo,
        precio: productoSeleccionado.precio,
        unidades: 1,
        subtotal: productoSeleccionado.precio
      })
    }
    actualizarStorage()
  }


verCarrito.addEventListener("click", verProdCarrito)

function verProdCarrito(e) {

  nodalContainer.innerHTML = ""
 nodalContainer.style.display = "flex"
  let nodalHeader = document.createElement("div")
  nodalHeader.className = "nodal-header"

  nodalContainer.append(nodalHeader)

  let nodalButton = document.createElement("span")
  nodalButton.innerText = "x"
  nodalButton.className = "nodal-header-button"

  nodalHeader.append(nodalButton)


  let finalizarCompraBoton = document.createElement("h1")
  finalizarCompraBoton.innerText = "Finalizar Compra"
  finalizarCompraBoton.className = "finalizar-compra"

  nodalHeader.append(finalizarCompraBoton)

  finalizarCompraBoton.addEventListener("click", finalizarCompra)

  nodalButton.addEventListener("click", () => {
    nodalContainer.style.display = "none"

  })
  montoAPagar = carrito.reduce((acum, productoSeleccionado) => acum + productoSeleccionado.subtotal, 0)

  let totalbuying = document.createElement("div")
  totalbuying.classList = "total-content"
  totalbuying.innerHTML = `Total: $${montoAPagar}`
  nodalHeader.append(totalbuying)


  carrito.forEach((productoSeleccionado) => {
    let carritoContent = document.createElement("div")
    carritoContent.className = "modal-content"
    carritoContent.innerHTML = `
        <h3>${productoSeleccionado.articulo}</h3>
        <p>$ ${productoSeleccionado.precio}</p>
        <span class=restar> - </span>
        <p>${productoSeleccionado.unidades}</p>
        <span class=sumar> + </span>
        <P>Subtotal: $${productoSeleccionado.subtotal}</P>
        <span class=eliminar-unidad> ❌ </span>
        `
    nodalContainer.append(carritoContent)

    let restar = carritoContent.querySelector(".restar")
    restar.addEventListener("click", () => {
      if (productoSeleccionado.unidades !== 1) {
        productoEnCarrito = carrito.findIndex(producto => producto.id == productoSeleccionado.id)
        carrito[productoEnCarrito].unidades--
        carrito[productoEnCarrito].subtotal = carrito[productoEnCarrito].precio * carrito[productoEnCarrito].unidades
        verProdCarrito()
        actualizarStorage()
      }

    })
    let sumar = carritoContent.querySelector(".sumar")
    sumar.addEventListener("click", () => {
      productoEnCarrito = carrito.findIndex(producto => producto.id == productoSeleccionado.id)
      carrito[productoEnCarrito].unidades++
      carrito[productoEnCarrito].subtotal = carrito[productoEnCarrito].precio * carrito[productoEnCarrito].unidades    
      actualizarStorage()
      verProdCarrito()
    })

    let eliminarUnidad = carritoContent.querySelector(".eliminar-unidad")
    eliminarUnidad.addEventListener("click", ()=>{
      eliminarUnidadCarrito(productoSeleccionado.id)
    })
  })

}

let eliminarUnidadCarrito = (id) => {
  let encontrarId = carrito.find((element) => element.id=== id)

  carrito = carrito.filter((carritoId) => {
    return carritoId !== encontrarId

  })
  verProdCarrito()
  actualizarStorage()
}


function toast() {
  Toastify({
    text: "Producto agregado al Carrito",
    duration: 3000,
    newWindow: true,
    close: false,
    gravity: "top",
    position: "center",
    stopOnFocus: false,
    style: {
      background: "rgb(49, 157, 49)",
    },
    onClick: function () { }
  }).showToast();
}

function actualizarStorage() {
  const carritoJson = JSON.stringify(carrito)
  localStorage.setItem("carrito", carritoJson)
}


function finalizarCompra() {
  Swal.fire({
    icon: 'success',
    text: 'Muchas Gracias por su compra',
  })
  localStorage.removeItem("carrito")
  localStorage.setItem("carrito", [])
  localStorage.clear()
  nodalContainer.innerHTML = ""
  carrito = []

}


