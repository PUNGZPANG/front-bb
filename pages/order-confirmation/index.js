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
                            CONTINUE SHOPPING
                        </button>
                    </Link>
                    <img src="/mini-logo.jpg" alt="Blue Born Logo" className="w-20" />
                </div>

                <div className="max-w-2xl mx-auto text-center mt-12">
                    <div className="mb-8">
                        <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>

                    <h1 className="text-3xl font-semibold mb-4">Order Confirmed!</h1>
                    <p className="text-gray-600 mb-8">
                        Thank you for your order. We'll send you a confirmation email with your order details.
                    </p>

                    <Link href="/catalog">
                        <button className="bg-black text-white px-8 py-3 rounded-full hover:opacity-90">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
} 