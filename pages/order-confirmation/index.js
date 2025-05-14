import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OrderConfirmationPage() {
    const router = useRouter();

    useEffect(() => {
        // Clear cart data from localStorage if not already cleared
        localStorage.removeItem('cartItems');
        localStorage.removeItem('totalPrice');
    }, []);

    return (
        <>
            <Head>
                <title>Order Confirmation | Blue Born Official</title>
            </Head>

            <div className="min-h-screen bg-white px-6 pt-4 pb-10">
                <div className="flex justify-between items-center mb-8">
                    <Link href="/catalog">
                        <button className="px-4 py-1.5 text-l border border-black rounded-full hover:bg-black hover:text-white">
                            BACK TO CATALOG
                        </button>
                    </Link>
                    <img src="/mini-logo.jpg" alt="Logo" className="w-20" />
                </div>

                <div className="max-w-2xl mx-auto text-center py-16">
                    <h1 className="text-3xl font-semibold mb-4">Thank You for Your Order!</h1>
                    <p className="text-gray-600 mb-8">
                        Your order has been successfully placed. We'll process it right away.
                    </p>
                    
                    <div className="space-y-4">
                        <Link href="/orders">
                            <button className="w-full bg-black text-white py-3 rounded-full hover:opacity-90">
                                View My Orders
                            </button>
                        </Link>
                        
                        <Link href="/catalog">
                            <button className="w-full border border-black py-3 rounded-full hover:bg-black hover:text-white">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
} 