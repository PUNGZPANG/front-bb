import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// รับ props ที่ได้จาก getServerSideProps
export default function ProductDetailPage({ product }) {
    if (!product) {
        return <p className="text-center mt-20">Product not found</p>;
    }

    return (
        <>
            <Head>
                <title>{product.name} | Blue Born</title>
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
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={800}
                            height={800}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
                        <p className="text-gray-600 mb-6">{product.shortDescription}</p>

                        <div className="flex items-center justify-between bg-black text-white px-6 py-3 rounded-full shadow mb-6">
                            <button className="text-lg">Add to Cart</button>
                            <span className="text-lg">{product.price}</span>
                        </div>

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