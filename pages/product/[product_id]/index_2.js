import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';
export default function ProductDetailPage() {
    const router = useRouter();
    const { product_id } = router.query;
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                </div>

                {/* Product Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.product_name}
                            width={800}
                            height={800}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-semibold mb-2">{product.product_name}</h1>
                        <p className="text-gray-600 mb-6">{product.description?.slice(0, 80)}...</p>

                        <div className="flex items-center justify-between bg-black text-white px-6 py-3 rounded-full shadow mb-6">
                            <button className="text-lg" onClick={() => addToCart(product)}>Add to Cart</button>
                            
                            <span className="text-lg">{product.price} ฿</span>
                        </div>
                        
                        <Link href="/cart">
                                <button className="text-lg border border-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition">
                                    Go to Cart
                                </button>
                            </Link>

                        {/* Tabs */}
                        <div className="flex gap-8 text-gray-600 text-sm mb-2 border-b pb-2">
                            <span className="border-b-2 border-black text-black">Description</span>
                            <span className="cursor-pointer hover:text-black">Size</span>
                            <span className="cursor-pointer hover:text-black">Color</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {product.description}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}


