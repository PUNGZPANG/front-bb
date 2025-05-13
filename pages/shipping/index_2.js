import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext'; // ต้องมี context นี้

export default function ShippingPage() {
    const router = useRouter();
    const { cartItems, total, clearCart } = useCart(); // ดึงจาก CartContext

    const [step, setStep] = useState('form'); // 'form' | 'confirmation'
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        note: '',
        termsAccepted: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.termsAccepted) {
            alert('Please accept the terms before continuing.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/orders/create/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: formData.name,
                    location: formData.location,
                    note: formData.note,
                    total_price: total,
                    items: cartItems.map((item) => ({
                        product_name: item.product_name,
                        price: item.price,
                        quantity: item.quantity,
                        image_url: item.image,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            setStep('confirmation');
            clearCart(); // ล้างตะกร้า
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('There was a problem placing your order. Please try again.');
        }
    };

    return (
        <>
            <Head>
                <title>Shipping Information</title>
            </Head>

            <div className="min-h-screen bg-white font-[Lustria] px-6 pt-4 pb-10">
                {/* Navbar */}
                <div className="flex justify-between items-center mb-8">
                    <Link href="/catalog">
                        <button className="px-4 py-1.5 text-l border border-black rounded-full hover:bg-black hover:text-white transition">
                            BACK
                        </button>
                    </Link>
                    <Image src="/mini-logo.jpg" alt="Logo" width={80} height={80} />
                </div>

                {/* Step 1: Shipping Form */}
                {step === 'form' && (
                    <div className="max-w-3xl mx-auto border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-1">Shipping information</h2>
                        <p className="text-sm text-gray-500 mb-6">We ship within 2 working days</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                className="w-full border px-4 py-2 rounded"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="location"
                                placeholder="Shipping Address"
                                className="w-full border px-4 py-2 rounded"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                            <textarea
                                name="note"
                                placeholder="Note (optional)"
                                className="w-full border px-4 py-2 rounded resize-y min-h-[80px]"
                                value={formData.note}
                                onChange={handleChange}
                            />
                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                                <label className="text-sm">
                                    I accept the terms<br />
                                    <a href="#" className="underline text-gray-600 hover:text-black">
                                        Read our T&Cs
                                    </a>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded-full mt-4 hover:opacity-90"
                            >
                                Save shipping information
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: Order Confirmation */}
                {step === 'confirmation' && (
                    <div className="max-w-xl mx-auto border rounded-lg p-6 text-center shadow-sm">
                        <h2 className="text-2xl font-semibold mb-4">✅ Order Confirmed!</h2>
                        <p className="mb-2">Thank you, <strong>{formData.name}</strong>.</p>
                        <p className="mb-4">We will ship your order to:</p>
                        <div className="bg-gray-100 rounded p-4 mb-4 text-left">
                            <p><strong>Address:</strong> {formData.location}</p>
                            {formData.note && <p><strong>Note:</strong> {formData.note}</p>}
                        </div>
                        <p className="text-lg font-medium mb-6">Your payment was successful.</p>

                        <Link href="/catalog">
                            <button className="px-6 py-2 bg-black text-white rounded-full hover:opacity-90">
                                Back to Shop
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
