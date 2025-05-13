import React from 'react';

export default function AdminDashboard() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-semibold mb-2">🧬 BlueBorn</h1>
                    <div className="text-sm text-gray-600">Jaymin Leonheart</div>
                    <div className="text-xs text-gray-400">jay@purpleist.com</div>
                </div>
                <nav className="mt-6">
                    <ul>
                        <li className="px-6 py-3 bg-gray-100 font-semibold">Dashboard</li>
                        <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Products</li>
                        <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Orders</li>
                        <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Customers</li>
                        <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Logout</li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Dashboard</h2>
                    <div className="relative">
                        <input type="text" placeholder="Search something here" className="pl-10 pr-4 py-2 rounded-md border border-gray-300 w-96" />
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>
                </header>

                {/* Cards Section */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white shadow-lg p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold">99,999</h3>
                        <p className="text-sm text-gray-600">Orders This Month</p>
                        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-11/12 h-full bg-blue-500"></div>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold">999</h3>
                        <p className="text-sm text-gray-600">New Customers This Month</p>
                    </div>
                    <div className="bg-white shadow-lg p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold">16,614</h3>
                        <p className="text-sm text-gray-600">Average Daily Sales</p>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Product Orders</h3>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-500">Avg. xx orders per day</p>
                        <input type="text" placeholder="Search" className="py-2 px-4 border rounded-md w-64" />
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="py-2 border-b">ORDER ID</th>
                                <th className="py-2 border-b">CREATED</th>
                                <th className="py-2 border-b">CUSTOMER</th>
                                <th className="py-2 border-b">TOTAL</th>
                                <th className="py-2 border-b">STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(10)].map((_, i) => (
                                <tr key={i} className="border-b">
                                    <td className="py-2">#ORD-100{i}</td>
                                    <td className="py-2">2025-05-09</td>
                                    <td className="py-2">Customer {i + 1}</td>
                                    <td className="py-2">$1000</td>
                                    <td className="py-2">Completed</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
