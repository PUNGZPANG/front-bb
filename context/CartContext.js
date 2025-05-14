import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [cartInitialized, setCartInitialized] = useState(false);
    const [token, setToken] = useState(null);

    // Load token from localStorage and track changes
    useEffect(() => {
        const updateToken = () => {
            const accessToken = localStorage.getItem("access");
            setToken(accessToken);
        };

        updateToken();
        window.addEventListener("storage", updateToken);

        return () => {
            window.removeEventListener("storage", updateToken);
        };
    }, []);

    // Fetch cart from backend if token exists
    useEffect(() => {
        if (!token) return;

        const loadCart = async () => {
            try {
                const res = await fetch("http://localhost:8000/cart/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch cart from server");
                }

                const data = await res.json();

                setCart(data.map(item => ({
                    product_id: item.product.product_id,
                    name: item.product.product_name,
                    price: item.product.price,
                    image: item.product.image,
                    description: item.product.description,
                    quantity: item.quantity
                })));

                setCartInitialized(true);
            } catch (err) {
                console.error("Error fetching cart:", err);
            }
        };

        loadCart();
    }, [token]);

    // Load from localStorage if not logged in
    useEffect(() => {
        if (!token && !cartInitialized) {
            const storedCart = localStorage.getItem('cartItems');
            if (storedCart) {
                setCart(JSON.parse(storedCart));
                setCartInitialized(true);
            }
        }
    }, [token, cartInitialized]);

    // Save to localStorage when cart changes
    useEffect(() => {
        if (typeof window !== "undefined" && cartInitialized) {
            localStorage.setItem('cartItems', JSON.stringify(cart));
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            localStorage.setItem('totalPrice', total);
        }
    }, [cart, cartInitialized]);

    // Add item to cart
    const addToCart = async (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.product_id === product.product_id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.product_id === product.product_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });

        if (token) {
            try {
                await fetch("http://localhost:8000/cart/", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        product_id: product.product_id,
                        quantity: 1,
                    }),
                });
            } catch (error) {
                console.error("Failed to add to cart on server:", error);
            }
        }
    };

    // Update item quantity (local only)
    const updateQuantity = async (product_id, quantity) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.product_id === product_id ? { ...item, quantity } : item
            )
        );

        if (token) {
            try {
                await fetch("http://localhost:8000/cart/", {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ product_id, quantity }),
                });
            } catch (error) {
                console.error("Failed to update quantity on server:", error);
            }
        }
    };


    // Remove item from cart
    const removeFromCart = async (product_id) => {
        setCart((prevCart) => prevCart.filter(item => item.product_id !== product_id));

        if (token) {
            try {
                await fetch("http://localhost:8000/cart/", {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ product_id }),
                });
            } catch (error) {
                console.error("Failed to remove from cart on server:", error);
            }
        }
    };

    const clearCart = async () => {
        setCart([]);

        if (token) {
            try {
                await fetch("http://localhost:8000/cart/", {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                });
            } catch (error) {
                console.error("Failed to clear cart on server:", error);
            }
        }
    };


    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
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
