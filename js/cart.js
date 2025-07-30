document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');

    const rawCart = localStorage.getItem('cart');
    if (!rawCart) {
        container.innerHTML = '<p>Səbət boşdur.</p>';
        return;
    }

    const cart = JSON.parse(rawCart);
    if (cart.length === 0) {
        container.innerHTML = '<p>Səbət boşdur.</p>';
        return;
    }

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';

        div.innerHTML = `
      <input type="checkbox" class="select-item" data-index="${index}" />
      <img src="${item.image}" alt="${item.title}" />
      <div class="cart-info">
        <div class="cart-title">${item.title}</div>
        <div>Price: <strong>${item.price.toFixed(2)} €</strong></div>
        <div>Color: <span style="background:${item.color}; width:12px; height:12px; display:inline-block; border-radius:50%; border:1px solid #000;"></span> ${item.colorName}</div>
        <div>Size: ${item.size}</div>
      </div>
    `;

        container.appendChild(div);
    });

    // Handle checkbox logic
    container.addEventListener('change', () => {
        const checkedItems = document.querySelectorAll('.select-item:checked');
        checkoutBtn.disabled = checkedItems.length === 0;
    });

    checkoutBtn.addEventListener('click', () => {
        const selectedIndexes = Array.from(document.querySelectorAll('.select-item:checked')).map(input =>
            parseInt(input.dataset.index)
        );

        const selectedItems = selectedIndexes.map(i => cart[i]);

        console.log('Seçilmiş məhsullar:', selectedItems);

        // TODO: Burda checkout yönləndirməsi və ya saxlanılması
        alert(`${selectedItems.length} məhsul seçildi. Checkout prosesi başlayır...`);
    });
});
