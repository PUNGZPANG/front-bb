import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CatalogPage() {
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:8000/product/all'); // เปลี่ยนตาม URL จริงของ backend
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        // Check if the user is logged in by checking the access token in localStorage
        const token = localStorage.getItem('access');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsLoggedIn(false);
        // Optionally redirect the user to another page after logging out (e.g., homepage)
        window.location.href = '/catalog';
    };

    const filtered = products.filter((p) =>
        p.product_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head>
                <title>Catalog | Blue Born Official</title>
                <meta name="description" content="Blue Born Jewelry Website" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Lustria&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-white font-[Lustria] text-center px-6 py-10">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex-1 flex justify-start">
                        <img src="/mini-logo.jpg" alt="Blue Born Logo" className="w-20" />
                    </div>

                    <div className="flex-1 flex justify-center">
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-[100%] border border-black rounded-full px-6 py-2 text-xl text-gray-700 placeholder:text-gray-400 font-[Lustria] outline-none"
                        />
                    </div>

                    <div className="flex-1 flex justify-end gap-8">
                        <Link href="/CartPage">
                            <button className="text-xl hover:text-gray-500">CART</button>
                        </Link>
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="text-xl hover:text-gray-500"
                            >
                                LOGOUT
                            </button>
                        ) : (
                            <Link href="/login">
                                <button className="text-xl hover:text-gray-500">LOGIN</button>
                            </Link>
                        )}
                    </div>
                </div>

                {loading ? (
                    <p className="text-gray-500 text-lg">Loading products...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {filtered.map((product, index) => (
                            <div key={index}>
                                <Link href={`/product/${product.product_id}`}>
                                    <div className="aspect-square bg-gray-100 overflow-hidden rounded shadow cursor-pointer hover:opacity-90 transition">
                                        <img
                                            src={product.image}
                                            alt={product.product_name}
                                            width={600}
                                            height={600}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                </Link>
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium">{product.product_name}</h3>
                                    <p className="text-sm text-gray-700">{product.price} THB</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
