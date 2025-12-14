const products = [
    {
        id: 1,
        name: "Chocolate Paradise",
        category: "chocolate",
        price: 45.99,
        emoji: "🍫",
        description: "Rich dark chocolate cake with chocolate ganache and chocolate shavings",
        badge: "Bestseller",
        features: [
            "3 layers of moist chocolate sponge",
            "Belgian dark chocolate ganache",
            "Handmade chocolate decorations",
            "Serves 8-10 people"
        ]
    },
    {
        id: 2,
        name: "Strawberry Dream",
        category: "fruit",
        price: 42.99,
        emoji: "🍓",
        description: "Fresh strawberry layers with vanilla cream and strawberry glaze",
        badge: "Fresh",
        features: [
            "Made with fresh organic strawberries",
            "Light vanilla cream filling",
            "Topped with fresh berries",
            "Serves 8-10 people"
        ]
    },
    {
        id: 3,
        name: "Classic Vanilla",
        category: "classic",
        price: 38.99,
        emoji: "🎂",
        description: "Traditional vanilla cake with buttercream frosting and elegant decorations",
        features: [
            "Madagascar vanilla bean",
            "Smooth buttercream frosting",
            "Perfect for any occasion",
            "Serves 10-12 people"
        ]
    },
    {
        id: 4,
        name: "Red Velvet Romance",
        category: "classic",
        price: 46.99,
        emoji: "❤️",
        description: "Velvety smooth red cake with cream cheese frosting",
        badge: "Popular",
        features: [
            "Classic red velvet recipe",
            "Premium cream cheese frosting",
            "Elegant red interior",
            "Serves 8-10 people"
        ]
    },
    {
        id: 5,
        name: "Lemon Sunshine",
        category: "fruit",
        price: 41.99,
        emoji: "🍋",
        description: "Zesty lemon cake with lemon curd filling and meringue topping",
        features: [
            "Fresh lemon zest and juice",
            "Tangy lemon curd filling",
            "Light and refreshing",
            "Serves 8-10 people"
        ]
    },
    {
        id: 6,
        name: "Caramel Delight",
        category: "special",
        price: 48.99,
        emoji: "🍮",
        description: "Caramel-infused layers with salted caramel drizzle",
        badge: "Chef's Special",
        features: [
            "Homemade caramel sauce",
            "Salted caramel buttercream",
            "Caramel drip decoration",
            "Serves 8-10 people"
        ]
    },
    {
        id: 7,
        name: "Black Forest Magic",
        category: "chocolate",
        price: 47.99,
        emoji: "🍒",
        description: "Chocolate cake with cherry filling and whipped cream",
        features: [
            "Dark chocolate sponge",
            "Cherry compote filling",
            "Whipped cream layers",
            "Serves 10-12 people"
        ]
    },
    {
        id: 8,
        name: "Tropical Paradise",
        category: "fruit",
        price: 44.99,
        emoji: "🥥",
        description: "Coconut and pineapple layers with passion fruit cream",
        badge: "Exotic",
        features: [
            "Fresh tropical fruits",
            "Coconut cream layers",
            "Passion fruit glaze",
            "Serves 8-10 people"
        ]
    },
    {
        id: 9,
        name: "Tiramisu Tower",
        category: "special",
        price: 49.99,
        emoji: "☕",
        description: "Coffee-soaked layers with mascarpone cream and cocoa dust",
        features: [
            "Authentic Italian recipe",
            "Premium mascarpone cheese",
            "Coffee liqueur infusion",
            "Serves 8-10 people"
        ]
    },
    {
        id: 10,
        name: "Rainbow Bliss",
        category: "special",
        price: 52.99,
        emoji: "🌈",
        description: "Six colorful layers with vanilla cream and sprinkles",
        badge: "Instagram Favorite",
        features: [
            "6 vibrant colored layers",
            "Vanilla buttercream",
            "Perfect for celebrations",
            "Serves 12-14 people"
        ]
    },
    {
        id: 11,
        name: "Matcha Zen",
        category: "special",
        price: 46.99,
        emoji: "🍵",
        description: "Japanese matcha green tea cake with white chocolate ganache",
        features: [
            "Premium matcha powder",
            "White chocolate ganache",
            "Delicate green tea flavor",
            "Serves 8-10 people"
        ]
    },
    {
        id: 12,
        name: "Cookies & Cream",
        category: "chocolate",
        price: 43.99,
        emoji: "🍪",
        description: "Oreo-filled chocolate cake with cookies and cream frosting",
        badge: "Kids Favorite",
        features: [
            "Loaded with Oreo cookies",
            "Cookies and cream frosting",
            "Chocolate cookie base",
            "Serves 10-12 people"
        ]
    }
];

let cart = [];
let currentCategory = 'all';
let searchQuery = '';

function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    let filteredProducts = products.filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="font-size: 3rem;">😔</p>
                <p style="font-size: 1.2rem; color: #999;">No cakes found matching your criteria</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <span>${product.emoji}</span>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}, event)">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart-btn')) {
                const productId = parseInt(card.dataset.productId);
                showProductDetails(productId);
            }
        });
    });
}

function addToCart(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    showNotification(`${product.emoji} ${product.name} added to cart!`);
    saveCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
    saveCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCart();
            updateCartCount();
            saveCart();
        }
    }
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some delicious cakes to get started!</p>
            </div>
        `;
        cartTotal.textContent = '0.00';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${item.price} each</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    cartTotal.textContent = total.toFixed(2);
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('product-modal');
    const detailsContainer = document.getElementById('product-details');

    detailsContainer.innerHTML = `
        <div class="product-detail-image">${product.emoji}</div>
        <div class="product-detail-info">
            <span class="product-detail-category">${product.category}</span>
            <h2>${product.name}</h2>
            <p class="product-detail-description">${product.description}</p>
            <div class="product-features">
                <h4>Features:</h4>
                <ul>
                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            <div class="product-detail-price">$${product.price}</div>
            <button class="btn btn-primary" onclick="addToCart(${product.id}); closeProductModal();">Add to Cart</button>
        </div>
    `;

    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
}

function showNotification(message) {
    const notification = document.getElementById('cart-notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function saveCart() {
    localStorage.setItem('sweetDreamsCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('sweetDreamsCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

document.getElementById('cart-icon').addEventListener('click', () => {
    document.getElementById('cart-modal').classList.add('active');
    renderCart();
});

document.getElementById('close-cart').addEventListener('click', () => {
    document.getElementById('cart-modal').classList.remove('active');
});

document.getElementById('close-product').addEventListener('click', closeProductModal);

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        renderProducts();
    });
});

document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
});

document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('❌ Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    showNotification(`🎉 Order placed! Total: $${total.toFixed(2)} for ${itemCount} item(s)`);
    
    setTimeout(() => {
        cart = [];
        updateCartCount();
        renderCart();
        saveCart();
        document.getElementById('cart-modal').classList.remove('active');
    }, 2000);
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('✅ Message sent! We\'ll get back to you soon.');
    e.target.reset();
});

document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('📧 Subscribed! Welcome to our sweet community!');
    e.target.reset();
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

window.addEventListener('load', () => {
    loadCart();
    renderProducts();
});
