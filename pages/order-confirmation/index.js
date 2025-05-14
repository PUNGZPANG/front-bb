import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

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
                    <button
                        className="px-4 py-1.5 text-l border border-black rounded-full hover:bg-black hover:text-white"
                        onClick={() => router.push('/catalog')}
                    >
                        BACK TO CATALOG
                    </button>
                    <Image 
                        src="/mini-logo.jpg" 
                        alt="Logo" 
                        width={80}
                        height={80}
                        className="w-20" 
                    />
                </div>

                <div className="text-center py-8">
                    <h1 className="text-3xl font-semibold mb-4">Thank you for your order!</h1>
                    <p className="text-gray-600 mb-6">We&apos;ll send you a confirmation email with your order details.</p>
                    <button
                        onClick={() => router.push('/orders')}
                        className="bg-black text-white px-6 py-2 rounded-full hover:opacity-90"
                    >
                        View My Orders
                    </button>
                </div>
            </div>
        </>
    );
} 