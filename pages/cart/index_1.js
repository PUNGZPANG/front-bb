// pages/cart.js

import { useCart } from '@/context/CartContext';
import Head from 'next/head';
import Link from 'next/link';

export default function CartPage() {
    const { cart } = useCart();

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = 150;
    const total = subtotal + deliveryFee;

    return (
        <>
            <Head>
                <title>Cart | Blue Born Official</title>
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

                <h1 className="text-2xl font-semibold mb-6">Order Summary</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 flex flex-col gap-4">
                        {cart.map(item => (
                            <div key={item.id} className="border rounded p-4 flex flex-col md:flex-row gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="aspect-square w-full md:w-48 object-cover rounded"
                                />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold">{item.name}</h2>
                                        <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-sm">Qty : {item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border rounded p-6 bg-gray-50">
                        <h3 className="text-lg font-semibold mb-4">Total</h3>

                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>฿ {subtotal.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between mb-4">
                            <span>Delivery</span>
                            <span>฿ {deliveryFee.toLocaleString()}</span>
                        </div>

                        <hr className="my-4" />

                        <Link href="/shipping">
                            <button className="w-full py-2 border border-black rounded-full hover:bg-black hover:text-white transition flex justify-between px-4">
                                <span>Checkout</span>
                                <span>฿ {total.toLocaleString()}</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
