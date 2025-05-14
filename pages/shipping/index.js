import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import config from '../../context/config';

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
    const [error, setError] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(`${config.apiUrl}/api/orders/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    shipping_address: formData.location,
                    items: cartItems
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const data = await response.json();
            localStorage.removeItem('cartItems');
            localStorage.removeItem('totalPrice');
            router.push('/order-confirmation');
        } catch (error) {
            console.error('Fetch Error:', error);
            setError('Failed to create order. Please try again.');
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
