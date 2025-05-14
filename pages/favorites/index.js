import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import config from '../../context/config';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem('access'); // ใช้ JWT ที่เก็บไว้
                if (!token) {
                    router.push('/login');
                    return;
                }

                const res = await fetch(`${config.apiUrl}/api/favorites/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch favorites');

                const data = await res.json();
                setFavorites(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
    if (favorites.length === 0) return <p className="text-center mt-10">You have no favorite products yet.</p>;

    return (
        <div className="min-h-screen bg-white font-[Lustria] p-6">
            <Link href="/catalog">
                <button className="px-4 py-1.5 text-l border border-black rounded-full hover:bg-black hover:text-white transition">
                    BACK
                </button>
            </Link>
            <h1 className="text-3xl font-semibold mb-6 text-center">Your Favorites</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {favorites.map(product => (
                    <Link key={product.product_id} href={`/product/${product.product_id}`}>
                        <div className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer">
                            <img src={product.image} alt={product.product_name} className="w-full h-48 object-cover rounded mb-4" />
                            <h2 className="text-xl font-semibold">{product.product_name}</h2>
                            <p className="text-gray-500 text-sm">{product.description?.slice(0, 60)}...</p>
                            <p className="mt-2 text-black">{product.price} ฿</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
