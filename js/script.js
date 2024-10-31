// Selecionando elementos
const menu = document.querySelector("#menu");
const cartBtn = document.querySelector("#cart-btn");
const cartModal = document.querySelector("#cart-modal");
const cartItemsContainer = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const checkoutBtn = document.querySelector("#checkout-btn");
const closeModalBtn = document.querySelector("#close-modal-btn");
const cartCounter = document.querySelector("#cart-count");
const addressInput = document.querySelector("#address");
const addressWarn = document.querySelector("#address-warn");
const hourWarn = document.querySelector("#hour-warn");

let cart = [];

// functions
function showCartModal() {
  cartModal.classList.remove("hidden");
  cartModal.classList.add("flex");
}

function closeModal() {
  cartModal.classList.remove("flex");
  cartModal.classList.add("hidden");
}

// função para adicionar no carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

// atualiza o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col",
    );

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>

        <div>
          <button class="remove-cart-btn" data-name="${item.name}">
            Remover
          </button>
        </div>
      </div>
    `;

    total += item.price * item.quantity;
    cartTotal.innerHTML = total.toFixed(2);

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

// remover item do carrinho

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

function checkHour() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;
}

const spanItem = document.querySelector("#date-span");
const isOpen = checkHour();

if (!isOpen) {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-600");
} else {
  spanItem.classList.add("bg-green-600");
  spanItem.classList.remove("bg-red-600");
}
// eventos
cartBtn.addEventListener("click", () => {
  // Abrir modal
  updateCartModal();
  showCartModal();
});

closeModalBtn.addEventListener("click", () => {
  // Fechar modal
  closeModal();
});

cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove("flex");
    cartModal.classList.add("hidden");
  }
});

menu.addEventListener("click", (e) => {
  let parentButton = e.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const productName = parentButton.getAttribute("data-name");
    const productPrice = +parentButton.getAttribute("data-price");

    // adicionar no carrinho
    addToCart(productName, productPrice);
  }
});

cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-cart-btn")) {
    const name = e.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

addressInput.addEventListener("input", (e) => {
  let inputValue = e.target.value;

  if (inputValue !== "") {
    addressWarn.classList.add("hidden");
    addressInput.classList.remove("border-red-500");
  }
});

checkoutBtn.addEventListener("click", () => {
  const addressInputValue = addressInput.value;

  const hour = checkHour();

  if (hour === false) {
    hourWarn.classList.remove("hidden");
    return;
  } else {
    hourWarn.classList.add("hidden");
  }

  if (cart.length === 0) return;

  if (!addressInputValue) {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
  }

  // enviar pedido para o whats
  const cartItems = cart
    .map((item) => {
      return ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = ""; // adicione seu telefone aqui

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank",
  );
});
