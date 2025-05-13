import { createContext, useContext, useState, useEffect } from 'react';

// สร้าง CartContext
const CartContext = createContext();

// CartProvider Component
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // ใช้ useEffect ในการโหลดข้อมูลจาก localStorage เมื่อแอปเริ่มทำงาน
    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    // ใช้ useEffect ในการบันทึกข้อมูลใน localStorage ทุกครั้งที่ cart มีการเปลี่ยนแปลง
    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('cartItems', JSON.stringify(cart)); // บันทึกข้อมูลใน localStorage
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            localStorage.setItem('totalPrice', total); // บันทึกราคาใน localStorage
        }
    }, [cart]);
    const updateQuantity = (product_id, quantity) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.product_id === product_id ? { ...item, quantity } : item
            )
        );
    };

    // ฟังก์ชันเพิ่มสินค้าในตะกร้า
    const addToCart = (product) => {
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
    };

    const removeFromCart = (product_id) => {
        setCart((prevCart) => prevCart.filter(item => item.product_id !== product_id));
    };

    const clearCart = () => {
        setCart([]);  // เคลียร์ตะกร้า
    };


    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook สำหรับการใช้งาน CartContext
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

