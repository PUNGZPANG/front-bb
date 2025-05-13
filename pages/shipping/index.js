import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ShippingPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        note: '',
        termsAccepted: false,
    });

    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // ✅ โหลดข้อมูลจาก localStorage หลังจาก component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
            const total = localStorage.getItem('totalPrice') || 0;

            setCartItems(items);
            setTotalPrice(total);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!formData.termsAccepted) {
    //         alert('Please accept the terms before continuing.');
    //         return;
    //     }

    //     try {
    //         const response = await fetch('http://localhost:8000/api/orders/create/', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 customer_name: formData.name,
    //                 location: formData.location,
    //                 note: formData.note,
    //                 total_price: totalPrice,
    //                 items: cartItems.map(item => ({
    //                     product_name: item.name,
    //                     price: item.price,
    //                     quantity: item.quantity,
    //                     image_url: item.image,
    //                 })),
    //             }),
    //         });

    //         if (response.ok) {
    //             router.push('/confirmation');
    //         } else {
    //             const data = await response.json();
    //             console.error('Error:', data);
    //             alert('There was an error placing your order.');
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         alert('An error occurred while placing your order.');
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.termsAccepted) {
            alert('Please accept the terms before continuing.');
            return;
        }

        const orderItems = cartItems.map(item => ({
            product_name: item.name || item.product_name || "Unnamed Product",  // fallback to avoid nulls
            price: parseFloat(item.price || 0),
            quantity: parseInt(item.quantity || 1),
            image_url: item.image || item.image_url || '',
        }));

        // Extra safeguard to ensure no item is missing required fields
        const hasInvalidItems = orderItems.some(item =>
            !item.product_name || !item.price || !item.quantity
        );

        if (hasInvalidItems) {
            alert("Some cart items are missing necessary info.");
            console.error("Invalid items:", orderItems);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/orders/create/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: formData.name,
                    location: formData.location,
                    note: formData.note,
                    total_price: parseFloat(totalPrice),
                    items: orderItems,
                }),
            });

            if (response.ok) {
                localStorage.setItem('lastOrder', JSON.stringify({
                    customer_name: formData.name,
                    location: formData.location,
                    note: formData.note,
                    total_price: parseFloat(totalPrice),
                    items: orderItems,
                }));
                router.push('/order');
            } else {
                const data = await response.json();
                console.error('Server Error:', data);
                alert('There was an error placing your order.');
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            alert('An error occurred while placing your order.');
        }
    };


    return (
        <>
            <Head>
                <title>Shipping Information</title>
            </Head>

            <div className="min-h-screen bg-white px-6 pt-4 pb-10">
                <div className="flex justify-between items-center mb-8">
                    <button
                        className="px-4 py-1.5 text-l border border-black rounded-full hover:bg-black hover:text-white"
                        onClick={() => router.push('/cart')}
                    >
                        BACK
                    </button>
                    <img src="/mini-logo.jpg" alt="Logo" className="w-20" />
                </div>

                <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="w-full border px-4 py-2 rounded"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Shipping Address"
                        className="w-full border px-4 py-2 rounded"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="note"
                        placeholder="Note (optional)"
                        className="w-full border px-4 py-2 rounded resize-y min-h-[80px]"
                        value={formData.note}
                        onChange={handleChange}
                    />
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                            className="mt-1"
                        />
                        <label className="text-sm">
                            I accept the terms and conditions
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-full mt-4 hover:opacity-90"
                    >
                        Save shipping information
                    </button>
                </form>
            </div>
        </>
    );
}
