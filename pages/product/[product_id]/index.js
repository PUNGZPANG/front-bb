import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import config from '../../../context/config';

export default function ProductDetailPage() {
    const router = useRouter();
    const { product_id } = router.query;
    const { addToCart, cart } = useCart();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartShake, setCartShake] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const totalItems = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    useEffect(() => {
        const token = localStorage.getItem('access');
        setIsAuthenticated(!!token);
        setIsCheckingAuth(false);
    }, []);

    useEffect(() => {
        if (!product_id) return;

        const fetchData = async () => {
            try {
                setError(null);
                const response = await fetch(`${config.apiUrl}/product/${product_id}`);
                if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
                const data = await response.json();
                setProduct(data);

                // Check if favorited only if authenticated
                if (isAuthenticated) {
                    const token = localStorage.getItem('access');
                    const favRes = await fetch(`${config.apiUrl}/api/favorites/`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (favRes.ok) {
                        const favData = await favRes.json();
                        const isFav = Array.isArray(favData) && favData.some(item => item.product_id === parseInt(product_id));
                        setIsFavorited(isFav);
                    } else if (favRes.status === 401) {
                        // Token expired
                        localStorage.removeItem('access');
                        localStorage.removeItem('refresh');
                        setIsAuthenticated(false);
                    }
                }
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [product_id, isAuthenticated]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product);
        setCartShake(true);
        setTimeout(() => setCartShake(false), 500);
    };

    const toggleFavorite = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        try {
            const token = localStorage.getItem('access');
            const res = await fetch(`${config.apiUrl}/api/favorite/${product_id}/toggle/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setIsFavorited(!isFavorited);
            } else if (res.status === 401) {
                // Token expired
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                setIsAuthenticated(false);
                router.push('/login');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (isLoading || isCheckingAuth) return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
    if (error) return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">Error: {error}</p></div>;
    if (!product) return <div className="flex items-center justify-center min-h-screen"><p>Product not found</p></div>;

    return (
        <>
            <Head>
                <title>{product.product_name} | Blue Born</title>
            </Head>

            <div className="min-h-screen bg-white font-[Lustria] px-6 pt-4 pb-10">
                {/* Navbar */}
                <div className="flex justify-between items-center mb-8">
                    <Link href="/catalog">
                        <button className="px-4 py-1.5 text-l border border-black rounded-full hover:bg-black hover:text-white transition">
                            BACK
                        </button>
                    </Link>

                    <img src="/mini-logo.jpg" alt="Blue Born Logo" className="w-20" />

                    <Link href="/cart" className={`relative text-2xl ${cartShake ? 'animate-shake' : ''}`}>
                        <FiShoppingCart />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                        <Image
                            src={product.image}
                            alt={product.product_name}
                            width={800}
                            height={800}
                            className="object-cover w-full h-full"
                            priority={true}
                        />
                    </div>

                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-semibold mb-2">{product.product_name}</h1>
                        <p className="text-gray-600 mb-4">{product.description?.slice(0, 80)}...</p>

                        {/* Favorite Button */}
                        <button
                            onClick={toggleFavorite}
                            className="flex items-center gap-1 text-red-500 text-lg mb-4 self-start"
                        >
                            {isFavorited ? <AiFillHeart /> : <AiOutlineHeart />}
                            {isFavorited ? 'Favorited' : 'Add to Favorites'}
                        </button>

                        {/* Add to Cart */}
                        <button className="flex items-center justify-between bg-black text-white px-6 py-3 rounded-full shadow mb-6" onClick={handleAddToCart}>
                            <span className="text-lg" >Add to Cart</span>
                            <span className="text-lg">{product.price} ฿</span>
                        </button>

                        {/* Select Options */}
                        <div className="flex gap-8 text-gray-600 text-md mb-2 border-b pb-2">
                            <span>Size / Color</span>
                        </div>

                        <div className="flex gap-4 mb-4">
                            <span className="text-sm text-gray-700 leading-relaxed">
                                {product.size}
                            </span>
                            <span className="text-sm text-gray-700 leading-relaxed">
                                {product.color}
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-5px); }
                    40%, 80% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 1s;
                }
            `}</style>
        </>
    );
}
