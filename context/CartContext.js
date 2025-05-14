import { createContext, useContext, useState, useEffect } from 'react';
import config from './config';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [cartInitialized, setCartInitialized] = useState(false);
    const [token, setToken] = useState(null);

    // Load token from localStorage and track changes
    useEffect(() => {
        const updateToken = () => {
            const accessToken = localStorage.getItem('access');
            setToken(accessToken);
        };

        updateToken();
        window.addEventListener('storage', updateToken);

        return () => {
            window.removeEventListener('storage', updateToken);
        };
    }, []);

    // Fetch cart from backend if token exists
    useEffect(() => {
        if (!token) {
            // If no token, try to load cart from localStorage
            const storedCart = localStorage.getItem('cartItems');
            if (storedCart) {
                setCart(JSON.parse(storedCart));
            }
            setCartInitialized(true);
            return;
        }

        const loadCart = async () => {
            try {
                const res = await fetch(`${config.apiUrl}/cart/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        // Token might be expired, clear it
                        localStorage.removeItem('access');
                        localStorage.removeItem('refresh');
                        setToken(null);
                        // Load cart from localStorage instead
                        const storedCart = localStorage.getItem('cartItems');
                        if (storedCart) {
                            setCart(JSON.parse(storedCart));
                        }
                    }
                    throw new Error("Failed to fetch cart from server");
                }

                const data = await res.json();
                const formattedCart = data.map(item => ({
                    product_id: item.product.product_id,
                    name: item.product.product_name,
                    price: item.product.price,
                    image: item.product.image,
                    description: item.product.description,
                    quantity: item.quantity
                }));

                setCart(formattedCart);
                // Also update localStorage
                localStorage.setItem('cartItems', JSON.stringify(formattedCart));
            } catch (err) {
                console.error("Error fetching cart:", err);
            } finally {
                setCartInitialized(true);
            }
        };

        loadCart();
    }, [token]);

    // Add item to cart
    const addToCart = async (product) => {
        if (!product) return;

        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.product_id === product.product_id);
            const newCart = existingItem
                ? prevCart.map(item =>
                    item.product_id === product.product_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
                : [...prevCart, { ...product, quantity: 1 }];
            
            // Update localStorage
            localStorage.setItem('cartItems', JSON.stringify(newCart));
            return newCart;
        });

        // If logged in, sync with backend
        if (token) {
            try {
                await fetch(`${config.apiUrl}/cart/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        product_id: product.product_id,
                        quantity: 1
                    })
                });
            } catch (error) {
                console.error("Failed to sync cart with server:", error);
            }
        }
    };

    // Update quantity
    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;

        setCart((prevCart) => {
            const newCart = prevCart.map((item) =>
                item.product_id === productId ? { ...item, quantity } : item
            );
            localStorage.setItem('cartItems', JSON.stringify(newCart));
            return newCart;
        });

        if (token) {
            try {
                await fetch(`${config.apiUrl}/cart/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ product_id: productId, quantity })
                });
            } catch (error) {
                console.error("Failed to update quantity on server:", error);
            }
        }
    };

    // Remove from cart
    const removeFromCart = async (productId) => {
        setCart((prevCart) => {
            const newCart = prevCart.filter(item => item.product_id !== productId);
            localStorage.setItem('cartItems', JSON.stringify(newCart));
            return newCart;
        });

        if (token) {
            try {
                await fetch(`${config.apiUrl}/cart/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ product_id: productId })
                });
            } catch (error) {
                console.error("Failed to remove from cart on server:", error);
            }
        }
    };

    // Clear cart
    const clearCart = async () => {
        setCart([]);
        localStorage.removeItem('cartItems');

        if (token) {
            try {
                await fetch(`${config.apiUrl}/cart/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error("Failed to clear cart on server:", error);
            }
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            updateQuantity,
            isInitialized: cartInitialized
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
