import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ShippingPage() {
    const router = useRouter();
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.termsAccepted) {
            console.log('Shipping Info:', formData);
            router.push('/ConfirmationPage');
        } else {
            alert('Please accept the terms before continuing.');
        }
    };

    return (
        <>
            <Head>
                <title>Shipping Information</title>
                <meta name="description" content="Shipping Information for Blue Born" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Lustria&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-white font-[Lustria] px-6 pt-4 pb-10">
                {/* Navbar: โลโก้ + ปุ่ม Continue */}
                <div className="flex justify-between items-center mb-8">
                    {/* ปุ่ม Continue Shopping อยู่ซ้าย */}
                    <Link href="/catalog">
                        <button className="px-4 py-1.5 text-l border border-black rounded-full hover:bg-black hover:text-white transition">
                            BACK
                        </button>
                    </Link>

                    {/* โลโก้ชิดขวา */}
                    <Image
                        src="/mini-logo.jpg"
                        alt="Blue Born Logo"
                        width={80}
                        height={80}
                    />
                </div>

                {/* Shipping Form */}
                <div className="flex-grow flex items-center justify-center">
                    <div className="w-full max-w-3xl border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-1">Shipping information</h2>
                        <p className="text-sm text-gray-500 mb-6">We ship within 2 working days</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="First Name"
                                className="w-full border px-4 py-2 rounded outline-none"
                                value={formData.name}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="location"
                                placeholder="Location"
                                className="w-full border px-4 py-2 rounded outline-none"
                                value={formData.location}
                                onChange={handleChange}
                            />

                            <textarea
                                name="note"
                                placeholder="Note"
                                className="w-full border px-4 py-2 rounded outline-none resize-y min-h-[80px]"
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
                </div>
            </div>
        </>
    );
}