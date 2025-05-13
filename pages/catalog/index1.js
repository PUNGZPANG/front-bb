import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CatalogPage() {
    const [search, setSearch] = useState('');

    const products = [
        { name: 'Pomegranate', price: '145000 THB', image: '/products/pomegranate.jpg' },
        { name: 'Spring', price: '350000 THB', image: '/products/spring.jpg' },
        { name: 'Underworld', price: '98000 THB', image: '/products/underworld.jpg' },
        // เพิ่มสินค้าอื่นๆ ได้ที่นี่
    ];

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head>
                <title>Catalog | Blue Born Official</title>
                <meta name="description" content="Blue Born Jewelry Website" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Lustria&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-white font-[Lustria] text-center px-6 py-10">

                {/* Logo + Nav */}
                <div className="flex justify-between items-center mb-8">
                    {/* ซ้าย: โลโก้ */}
                    <div className="flex-1 flex justify-start">
                        <img
                            src="/mini-logo.jpg"
                            alt="Blue Born Logo"
                            className="w-20"
                        />
                    </div>

                    {/* กลาง: ช่องค้นหา */}
                    <div className="flex-1 flex justify-center">
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-[100%] border border-black rounded-full px-6 py-2 text-xl text-gray-700 placeholder:text-gray-400 font-[Lustria] outline-none"
                        />
                    </div>

                    {/* ขวา: ปุ่ม Cart และ User */}
                    <div className="flex-1 flex justify-end gap-8">
                        <Link href="/CartPage">
                            <button className="text-xl hover:text-gray-500">CART</button>
                        </Link>
                        <Link href="/UserPage">
                            <button className="text-xl hover:text-gray-500">ACCOUNT</button>
                        </Link>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {filtered.map((product, index) => (
                        <div key={index}>
                            <Link href={`/product-detail?name=${encodeURIComponent(product.name)}`}>
                                <div className="aspect-square bg-gray-100 overflow-hidden rounded shadow cursor-pointer hover:opacity-90 transition">
                                    <Image
                                        src={product.image}
                                        alt={product.product_name}
                                        width={600}
                                        height={600}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </Link>
                            <div className="mt-4">
                                <h3 className="text-lg font-medium">{product.name}</h3>
                                <p className="text-sm text-gray-700">{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
