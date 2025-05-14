import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import config from '../../context/config';

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('access');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(`${config.apiUrl}/api/orders/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Head>
                <title>My Orders | Blue Born Official</title>
            </Head>

            <div className="min-h-screen bg-white px-6 pt-4 pb-10">
                <div className="flex justify-between items-center mb-8">
                    <button
                        className="px-4 py-1.5 text-l border border-black rounded-full hover:bg-black hover:text-white"
                        onClick={() => router.push('/catalog')}
                    >
                        BACK TO CATALOG
                    </button>
                    <img src="/mini-logo.jpg" alt="Logo" className="w-20" />
                </div>

                <h1 className="text-3xl font-semibold mb-6">My Orders</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-8">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                        <button
                            onClick={() => router.push('/catalog')}
                            className="bg-black text-white px-6 py-2 rounded-full hover:opacity-90"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="border rounded-lg p-6 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                                        <p className="text-gray-600">{formatDate(order.created_at)}</p>
                                    </div>
                                    <span className="text-lg font-semibold">
                                        ${order.total_price.toFixed(2)}
                                    </span>
                                </div>
                                
                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-medium mb-2">Shipping Details</h4>
                                    <p className="text-gray-600">{order.customer_name}</p>
                                    <p className="text-gray-600">{order.location}</p>
                                    {order.note && (
                                        <p className="text-gray-600 mt-2">
                                            <span className="font-medium">Note: </span>
                                            {order.note}
                                        </p>
                                    )}
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-medium mb-2">Items</h4>
                                    <div className="space-y-3">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    {item.image_url && (
                                                        <img
                                                            src={item.image_url}
                                                            alt={item.product_name}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{item.product_name}</p>
                                                        <p className="text-gray-600">
                                                            Quantity: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-medium">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
} 