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
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
                const total = parseFloat(localStorage.getItem('totalPrice')) || 0;
                setCartItems(items);
                setTotalPrice(total);
            } catch (err) {
                console.error('Error loading cart data:', err);
                setError('Error loading cart data. Please try again.');
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        try {
            setIsSubmitting(true);
            setError('');

            const token = localStorage.getItem('access');
            if (!token) {
                router.push('/login');
                return;
            }

            if (!formData.termsAccepted) {
                setError('Please accept the terms and conditions');
                return;
            }

            const orderData = {
                customer_name: formData.name.trim(),
                location: formData.location.trim(),
                note: formData.note ? formData.note.trim() : '',
                total_price: parseFloat(totalPrice),
                items: cartItems.map(item => ({
                    product_name: item.name ? item.name.trim() : '',
                    price: parseFloat(item.price),
                    quantity: parseInt(item.quantity, 10),
                    image_url: item.image || ''
                }))
            };

            console.log('Submitting order with data:', orderData);

            const response = await fetch(`${config.apiUrl}/api/orders/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const responseData = await response.json();
            console.log('Response status:', response.status);
            console.log('Response data:', responseData);

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to create order');
            }

            // Clear cart and redirect only if order was successful
            localStorage.removeItem('cartItems');
            localStorage.removeItem('totalPrice');
            router.push('/order-confirmation');
        } catch (error) {
            console.error('Full error details:', error);
            setError(error.message || 'Failed to create order. Please try again.');
        } finally {
            setIsSubmitting(false);
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

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="w-full border px-4 py-2 rounded"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        maxLength="200"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Shipping Address"
                        className="w-full border px-4 py-2 rounded"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        maxLength="500"
                    />
                    <textarea
                        name="note"
                        placeholder="Note (optional)"
                        className="w-full border px-4 py-2 rounded resize-y min-h-[80px]"
                        value={formData.note}
                        onChange={handleChange}
                        maxLength="500"
                    />
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                            className="mt-1"
                            required
                        />
                        <label className="text-sm">
                            I accept the terms and conditions
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-black text-white py-3 rounded-full mt-4 hover:opacity-90 ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSubmitting ? 'Processing...' : 'Save shipping information'}
                    </button>
                </form>
            </div>
        </>
    );
}
