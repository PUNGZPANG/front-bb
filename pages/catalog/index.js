import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { AiOutlineHeart } from 'react-icons/ai';
import config from '../../context/config';

export default function CatalogPage() {
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setError(null);
                const res = await fetch(`${config.apiUrl}/product/all`);
                if (!res.ok) {
                    throw new Error(`Server responded with status: ${res.status}`);
                }
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setError('Unable to load products. Please try again later.');
                setProducts([]); // Reset products on error
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
            </Head>

            <div className="min-h-screen bg-white font-[Lustria] text-center px-6 py-10">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex-1 flex justify-start">
                        <Image src="/mini-logo.jpg" alt="Blue Born Logo" width={80} height={80} className="w-20" />
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
                        <Link href="/cart">
                            <button className="text-2xl hover:text-gray-500" title="Cart">
                                <FiShoppingCart />
                            </button>
                        </Link>

                        <Link href="/favorites">
                            <button className="text-2xl hover:text-gray-500" title="My Favorites">
                                <AiOutlineHeart />
                            </button>
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
                    <div className="flex items-center justify-center min-h-[400px]">
                        <p className="text-gray-500 text-lg">Loading products...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                        <p className="text-red-500 text-lg">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-4 py-2 bg-blue-900 text-white rounded-full hover:bg-blue-800"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {filtered.map((product, index) => (
                            <div key={index}>
                                <Link href={`/product/${product.product_id}`}>
                                    <div className="aspect-square bg-gray-100 overflow-hidden rounded shadow cursor-pointer hover:opacity-90 transition">
                                        <Image
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
