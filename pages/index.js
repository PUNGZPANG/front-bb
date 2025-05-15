import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';


export default function HomePage() {
  return (
    <>
      <Head>
        <title>Blue Born Official</title>
        <meta name="description" content="Blue Born Jewelry Website" />
      </Head>

      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }} // เปลี่ยนภาพตาม path ที่ใช้จริง
      >
        {/* /* เมนูด้านซ้ายบน */}
        <div className="absolute top-6 left-10 text-white space-y-2 text-sm tracking-wider drop-shadow-lg">
          <Image
            src="/mini-logo.png"
            width={75}
            height={75}
            alt="Mini Logo"
            style={{ width: 'auto', height: '75px' }}
          />
        </div>

        {/* เมนูด้านขวาบน */}
        <div className="absolute top-6 right-6 text-black text-xs space-x-2 tracking-wider">
          <Link href='/' className="hover:underline">HOUSE OF BLUE @ BLUEBORN </Link> / <br></br>
          <Link href='catalog' className="hover:underline">VIEW CATALOGUE</Link> /
          <Link href='about' className="hover:underline">ABOUT US</Link>/ <br></br>
          <Link href='ring-size' className="hover:underline">RING SIZE</Link> /
          <Link href='how-to-measure' className="hover:underline"> HOW TO MEASURE</Link> /
          <Link href='stats' className="hover:underline"> STATISTICS</Link>
        </div>

        {/* โลโก้ตรงกลาง */}
        <div className="flex flex-col items-center justify-center text-center min-h-screen">
          <Image
            src="/blueborn-logo.png"
            alt="Blue Born Logo"
            width={700}
            height={700}
            className="w-[700px] max-w-[70%]"
            priority={true}
            style={{ width: 'auto', height: 'auto' }}
          />

          {/* ปุ่มสมัคร/เข้าสู่ระบบ */}
          <div className="mt-6 space-x-4">
            <button
              className="px-6 py-2 bg-white bg-opacity-20 border border-white text-black rounded-full cursor-pointer"
              onClick={() => window.location.href = '/signup'}
            >
              Sign Up
            </button>
            <button
              className="px-6 py-2 bg-white bg-opacity-20 border border-white text-black rounded-full cursor-pointer"
              onClick={() => window.location.href = '/login'}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
