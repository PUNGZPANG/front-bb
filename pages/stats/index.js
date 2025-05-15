import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import config from '../../context/config';

export default function PublicStats() {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check authentication status on client-side only
        const accessToken = localStorage.getItem('access');
        setIsAuthenticated(!!accessToken);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);

                const accessToken = localStorage.getItem('access');
                
                if (!accessToken) {
                    setError('Please log in to view statistics.');
                    setLoading(false);
                    return;
                }

                const headers = { Authorization: `Bearer ${accessToken}` };

                try {
                    // Fetch all data with authentication
                    const [productsRes, ordersRes] = await Promise.all([
                        axios.get(`${config.apiUrl}/api/products/`, { headers }),
                        axios.get(`${config.apiUrl}/api/orders/`, { headers })
                    ]);

                    const products = productsRes.data.length;
                    const orders = ordersRes.data;

                    // Format recent orders with simplified price calculation
                    const recentOrders = orders.slice(0, 5).map(order => {
                        let totalPrice = 0;
                        // Simple price calculation without excessive type checking
                        if (order.total_price) {
                            totalPrice = Number(order.total_price);
                        }
                        
                        return {
                            id: order.id,
                            date: new Date(order.created_at).toLocaleDateString(),
                            status: order.status,
                            total: `$${isNaN(totalPrice) ? '0.00' : totalPrice.toFixed(2)}`
                        };
                    });

                    setStats({
                        products,
                        orders: orders.length,
                        recentOrders
                    });
                } catch (err) {
                    console.error('Error fetching data:', err);
                    if (err.response?.status === 401) {
                        localStorage.removeItem('access');
                        localStorage.removeItem('refresh');
                        setIsAuthenticated(false);
                        setError('Your session has expired. Please log in again.');
                    } else {
                        setError('Failed to load statistics. Please try again later.');
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link href="/" className="flex items-center">
                                <Image
                                    src="/mini-logo.png"
                                    width={50}
                                    height={50}
                                    alt="BlueBorn Logo"
                                    className="h-8 w-auto"
                                />
                                <span className="ml-2 text-xl font-semibold">BlueBorn</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                            <Link href="/catalog" className="text-gray-600 hover:text-gray-900">Catalog</Link>
                            <Link href="/stats" className="text-gray-900 font-semibold">Statistics</Link>
                            {!isAuthenticated && (
                                <Link href="/login" className="text-blue-600 hover:text-blue-800">
                                    Login for access
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">BlueBorn Statistics</h1>
                    
                    {error && (
                        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800">{error}</p>
                            {!isAuthenticated && (
                                <Link href="/login" className="mt-2 inline-block text-blue-600 hover:text-blue-800">
                                    Click here to log in
                                </Link>
                            )}
                        </div>
                    )}

                    {isAuthenticated && (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-8">
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500 truncate">Available Products</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                            {loading ? (
                                                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                                            ) : stats.products}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                            {loading ? (
                                                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                                            ) : stats.orders}
                                        </dd>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders Table */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
                                    <div className="overflow-x-auto">
                                        {loading ? (
                                            <div className="space-y-4">
                                                {[...Array(3)].map((_, i) => (
                                                    <div key={i} className="animate-pulse flex space-x-4">
                                                        <div className="flex-1 space-y-4 py-1">
                                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead>
                                                    <tr>
                                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {stats.recentOrders.map((order) => (
                                                        <tr key={order.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                    order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 