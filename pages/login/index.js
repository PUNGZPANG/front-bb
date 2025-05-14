import Head from "next/head";
import Image from "next/image";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ตรวจสอบว่า token ถูกเก็บใน localStorage แล้วหรือยัง
  useEffect(() => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      // ถ้ามี access token แล้ว เราอาจจะต้องไปที่หน้าอื่น (เช่น /profile)
      router.push('/catalog');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError("");

    try {
      const response = await axios.post('http://localhost:8000/login/', {
        username: username,
        password: password,
      });

      const { access, refresh } = response.data;

      // เก็บ JWT token ใน localStorage
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      router.push('/catalog'); // Redirect to home page after successful login

    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error.message);
      setError(error.response?.data?.detail || "An unexpected error occurred.");
    } finally {
      setLoading(false);  // Reset loading state
    }
  }

  // ใช้ axios ในการดึงข้อมูลโปรไฟล์
  function fetchProfile() {
    const accessToken = localStorage.getItem('access'); // ใช้ชื่อ 'access' แทน 'access_token'

    if (!accessToken) {
      // ถ้าไม่มี access token ไปที่หน้า login
      window.location.href = '/login';
      return;
    }

    // ส่งคำขอ GET ไปที่ Backend พร้อมกับ Authorization header
    axios.get('http://localhost:8000/profile/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => {
        console.log('Profile data:', response.data);
        // แสดงข้อมูลโปรไฟล์ตามที่ได้รับจาก Backend
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        // จัดการ error เช่น ถ้า token หมดอายุ หรือมีปัญหาจาก Backend
      });
  }

  // ฟังก์ชัน logout
  function logout() {
    // ลบ JWT token ออกจาก localStorage
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');

    // เปลี่ยนหน้าไปยังหน้า login หรือหน้าอื่น ๆ
    window.location.href = '/login';
  };

  return (
    <>
      <Head>
        <title>Login | Blue Born Official</title>
        <meta name="description" content="Blue Born Jewelry Website" />
      </Head>

      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: "url('/background.jpg')" }} // พื้นหลังทะเล
      >
        {/* back to catalog */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => router.push('/catalog')}
            className="text-black px-4 py-2 rounded-full hover:bg-gray-100"
          >
            Back to Catalog
          </button>
        </div>
        {/* กล่องฟอร์มแบบใส + โลโก้แบบล้น */}
        <div className="relative bg-white/70 rounded-3xl px-10 pt-20 pb-10 w-full max-w-md text-center shadow-lg">
          {/* โลโก้ล้นออกด้านบน */}
          <Image
            src="/blueborn-logo.png"
            alt="Blue Born Logo"
            width={240}
            height={240}
            className="mx-auto absolute -top-5 left-1/2 transform -translate-x-1/2"
          />

          {/* ข้อความต้อนรับ */}
          <p
            className="mt-20 text-lg font- text-gray-800 leading-snug mb-6"
            style={{ fontFamily: "Lustria, serif" }}
          >
            Welcome back, Blue Fam!
            <br />
            Login and Keep on
            <br />
            Protect our{" "}
            <span className="bg-blue-900 text-white px-2 py-0.5 ">
              Big Blue!
            </span>
          </p>

          {/* ฟอร์ม Email / Password */}
          <form
            className="space-y-4 text-left"
            style={{ fontFamily: "Lustria, serif" }}
          >
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border-2 border-blue-900/30 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900/70"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-blue-900/30 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900/70"
                placeholder="Enter your password"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </form>

          {/* ปุ่ม Login */}
          <button
            className="mt-5 px-6 py-2 bg-white bg-opacity-20 border border-white text-black rounded-full cursor-pointer"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'SIGN IN'}
          </button>
          {/* ลิงค์ไปยังหน้า Register */}
          <p className="mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-900 font-semibold hover:underline"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
// แป้งแก้เองค่ะ
