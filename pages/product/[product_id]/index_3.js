import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';

export default function ProductDetailPage() {
    const router = useRouter();
    const { product_id } = router.query;
    const { addToCart, cartItems } = useCart(); // 🛒 ดึง cartItems
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartShake, setCartShake] = useState(false);

    useEffect(() => {
        if (!product_id) return;

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/product/${product_id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [product_id]);

    const handleAddToCart = () => {
        addToCart(product);
        setCartShake(true);
        setTimeout(() => setCartShake(false), 500);
    };

    // รวมจำนวนสินค้าทั้งหมดในตะกร้า
    const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    if (isLoading) return <p className="text-center mt-20">Loading...</p>;
    if (error) return <p className="text-center mt-20 text-red-500">Error: {error}</p>;
    if (!product) return <p className="text-center mt-20">Product not found</p>;

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

                    {/* Cart Icon */}
                    <Link href="/cart" className={`relative text-2xl ${cartShake ? 'animate-shake' : ''}`}>
                        <FiShoppingCart />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Product Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.product_name}
                            width={800}
                            height={800}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-semibold mb-2">{product.product_name}</h1>
                        <p className="text-gray-600 mb-6">{product.description}</p>

                        <button className="flex items-center justify-between bg-black text-white px-6 py-3 rounded-full shadow mb-6" onClick={handleAddToCart}>
                            <span className="text-lg" >Add to Cart</span>
                            <span className="text-lg">{product.price} ฿</span>
                        </button>

                        <div className="flex gap-8 text-gray-600 text-sm mb-2 border-b pb-2">
                            <span className="border-b-2 border-black text-black">Size</span>
                            <span className="cursor-pointer hover:text-black">Color</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {product.size}
                        </p>
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
