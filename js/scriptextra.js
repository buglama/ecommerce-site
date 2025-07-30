function renderProducts(data) {
    const container = document.getElementById('products');
    container.innerHTML = '';

    data.items.forEach(item => {
        const colorsMap = new Map();
        const sizesSet = new Set();

        item.variants.forEach(v => {
            if (!colorsMap.has(v.appearanceName)) {
                colorsMap.set(v.appearanceName, { color: v.appearanceColorValue, variants: [] });
            }
            colorsMap.get(v.appearanceName).variants.push(v);
            sizesSet.add(v.sizeName);
        });

        const colorsArr = Array.from(colorsMap.entries());
        const sizesArr = Array.from(sizesSet);

        const cleanDescriptionRaw = item.description.replace(/<\/?[^>]+(>|$)/g, "");
        const cleanDescription = cleanDescriptionRaw.length > 80 ? cleanDescriptionRaw.slice(0, 80) + '...' : cleanDescriptionRaw;

        const prices = item.variants.map(v => v.d2cPrice).filter(p => typeof p === 'number');
        const minPrice = prices.length > 0 ? Math.min(...prices) : null;

        const firstColorKey = colorsArr[0][0];
        const firstVariant = colorsMap.get(firstColorKey).variants[0];
        const firstImage = item.images.find(img => img.appearanceId === firstVariant.appearanceId)?.imageUrl || (item.images[0]?.imageUrl || '');

        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
      <div class="image-container">
        <div class="image-overlay-top-left">New</div>
        <img class="product-image" src="${firstImage}" alt="${item.title}" style="max-width: 100%; border-radius: 6px; margin-bottom: 10px;" />
      </div>
      <div class="product-title-p">${item.title}</div>
      <div class="product-price" style="font-weight:bold; margin-bottom: 8px;">
        ${minPrice !== null ? `${minPrice.toFixed(2)} €` : 'Price not available'}
      </div>
      <div class="product-description">${cleanDescription}</div>
      <div class="variants-list colors-list">
        <strong>Colors:</strong> ${colorsArr.map(([name, { color }]) =>
            `<span class="color-option" data-color-name="${name}" style="cursor:pointer" title="${name}">
            <span class="color-dot" style="background:${color}"></span>
          </span>`).join(' ')}
      </div>
      <div class="variants-list sizes-list">
        <strong>Size:</strong>
        <select class="size-dropdown">
          ${sizesArr.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
      </div>
      <div class="buttons">
        <button class="btn-cart">Add to cart</button>
        <button class="btn-buy">Buy Now</button>
      </div>
    `;

        const imgEl = card.querySelector('.product-image');
        const colorSpans = card.querySelectorAll('.color-option');

        let selectedColor = firstColorKey;

        colorSpans.forEach(span => {
            span.addEventListener('click', () => {
                const colorName = span.getAttribute('data-color-name');
                selectedColor = colorName;
                const variantsForColor = colorsMap.get(colorName).variants;
                const imgData = item.images.find(img => img.appearanceId === variantsForColor[0].appearanceId);
                imgEl.src = imgData?.imageUrl || (item.images[0]?.imageUrl || '');
            });
        });

        // ✅ Cart funksiyası
        card.querySelector('.btn-cart').addEventListener('click', () => {
            const selectedSize = card.querySelector('.size-dropdown').value;
            const productId = item.id;
            const cartItem = {
                id: productId,
                title: item.title,
                color: selectedColor,
                size: selectedSize,
                price: minPrice,
                count: 1
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Əgər eyni məhsul, eyni ölçü və rənglə varsa, count artır
            const existingIndex = cart.findIndex(p =>
                p.id === cartItem.id && p.color === cartItem.color && p.size === cartItem.size
            );

            if (existingIndex !== -1) {
                cart[existingIndex].count += 1;
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`"${item.title}" cart-a əlavə olundu!`);
        });

        // Sadə satınalma funksiyası
        card.querySelector('.btn-buy').addEventListener('click', () => {
            alert(`"${item.title}" üçün satınalma başlatıldı!`);
        });

        container.appendChild(card);
    });
}

// Fetch hissəsi
fetch("http://localhost:3000/api/articles")
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            console.error('Backend error:', data);
            document.getElementById('products').innerText = 'Xəta baş verdi, backenddən məlumat gəlmədi.';
            return;
        }
        renderProducts(data);
    })
    .catch(err => {
        console.error('Frontend fetch error:', err);
        document.getElementById('products').innerText = 'Backend ilə əlaqə yoxdur.';
    });
