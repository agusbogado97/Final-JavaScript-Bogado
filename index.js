const btnCart = document.querySelector('.container-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});

document.addEventListener("DOMContentLoaded", function() {
    const productosContainer = document.querySelector(".container-items");
    const contadorProductos = document.getElementById("contador-productos");
    const carritoProductos = document.querySelector(".container-cart-products");
    const totalPagar = document.querySelector(".total-pagar");
    const closeButtonIcons = document.querySelectorAll(".icon-close");

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let total = JSON.parse(localStorage.getItem("total")) || 0;

    const productosHTML = document.querySelectorAll(".item");
    productosHTML.forEach((productoHTML, index) => {
        const botonAgregar = productoHTML.querySelector("button");
        botonAgregar.addEventListener("click", () => {
            const titulo = productoHTML.querySelector("h2").textContent;
            const precio = parseInt(productoHTML.querySelector(".price").textContent.slice(1));

            carrito.push({ titulo, precio });
            total += precio;

            contadorProductos.textContent = carrito.length;
            actualizarCarrito();
            guardarEnLocalStorage();

            Swal.fire({
                title: "Producto Agregado",
                text: `${titulo} ha sido agregado al carrito.`,
                icon: "success",
            });
        });
    });

    fetch("./productos.json")
        .then(response => response.json())
        .then(data => {
            data.forEach((producto, index) => {
                const item = document.createElement("div");
                item.className = "item";
                item.innerHTML = `
                    <figure>
                        <img src="${producto.image}" alt="${producto.title}"/>
                    </figure>
                    <div class="info-product">
                        <h2>${producto.title}</h2>
                        <p class="price">$${producto.price}</p>
                        <button>Añadir al carrito</button>
                    </div>
                `;

                productosContainer.appendChild(item);

                const botonAgregar = item.querySelector("button");
                botonAgregar.addEventListener("click", () => {
                    carrito.push({ titulo: producto.title, precio: producto.price });
                    total += producto.price;

                    contadorProductos.textContent = carrito.length;
                    actualizarCarrito();
                    guardarEnLocalStorage();

                    Swal.fire({
                        title: "Item agregado al carrito",
                        icon: "success",
                    })

                });
            });
        })
        .catch(error => {
            console.error("Error al cargar los productos:", error);
        });

    carritoProductos.addEventListener("click", (event) => {
        if (event.target.classList.contains("icon-close")) {
            const index = event.target.dataset.index;
            const removedPrecio = carrito[index].precio;
            carrito.splice(index, 1);
            total -= removedPrecio;

            contadorProductos.textContent = carrito.length;
            actualizarCarrito();
            guardarEnLocalStorage();
        }
    });

    function actualizarCarrito() {
        carritoProductos.innerHTML = "";

        carrito.forEach((item, index) => {
            const productoCarrito = document.createElement("div");
            productoCarrito.className = "cart-product";
            productoCarrito.innerHTML = `
                <div class="info-cart-product">
                    <span class="cantidad-producto-carrito">${index + 1}</span>
                    <p class="titulo-producto-carrito">${item.titulo}</p>
                    <span class="precio-producto-carrito">$${item.precio}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close" data-index="${index}">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            `;

            carritoProductos.appendChild(productoCarrito);
        });

        totalPagar.textContent = `$${total}`;
    }

    function guardarEnLocalStorage() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
        localStorage.setItem("total", JSON.stringify(total));
    }
});
