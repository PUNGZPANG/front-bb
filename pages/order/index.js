import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function OrderPage() {
    const router = useRouter();
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('lastOrder');
        if (saved) {
            setOrderData(JSON.parse(saved));

            localStorage.removeItem('cartItems');
            localStorage.removeItem('totalPrice');
        } else {
            router.push('/catalog');
        }
    }, []);


    if (!orderData) {
        return <div className="p-8">Loading...</div>;
    }

    const { customer_name, location, note, total_price, items } = orderData;

    return (
        <>
            <Head>
                <title>Your Order</title>
            </Head>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Order Summary</h1>
                    <div className="mb-4">
                        <p><strong>Customer:</strong> {customer_name}</p>
                        <p><strong>Location:</strong> {location}</p>
                        {note && <p><strong>Note:</strong> {note}</p>}
                        <p className="mt-2"><strong>Total:</strong> ${total_price.toFixed(2)}</p>
                    </div>

                    <h2 className="text-xl font-semibold mb-2">Items:</h2>
                    <ul className="space-y-4">
                        {items.map((item, index) => (
                            <li key={index} className="flex gap-4 items-center border p-3 rounded">
                                {item.image_url && (
                                    <img
                                        src={item.image_url}
                                        alt={item.product_name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                )}
                                <div>
                                    <p className="font-medium">{item.product_name}</p>
                                    <p className="text-sm text-gray-600">
                                        {item.quantity} × ${item.price}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => router.push('/catalog')}
                        className="mt-6 w-full bg-black text-white py-3 rounded-full hover:opacity-90"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </>
    );
}
