import Head from 'next/head';
import Image from 'next/image';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error message

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/register/', {
        username,
        full_name: fullName,
        email,
        password,
      });
      console.log(response.data);
      // เมื่อสมัครสำเร็จแล้ว Redirect ไปที่หน้า login
      router.push('/login');
    } catch (error) {
      console.error('Error during sign-up:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.detail || 'An unexpected error occurred.');
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | Blue Born Official</title>
        <meta name="description" content="Blue Born Jewelry Website" />
      </Head>

      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: "url('/background.jpg')" }} // พื้นหลังทะเล
      >
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
          <p className="mt-16 text-lg font- text-gray-800 leading-snug mb-6" style={{ fontFamily: 'Lustria, serif' }}>
            join to be blue<br />
            for our <span className="bg-blue-900 text-white px-2 py-0.5 ">Blue Ocean</span>
          </p>

          {/* ฟอร์ม Email / Password */}
          <form className="space-y-4 text-left" style={{ fontFamily: 'Lustria, serif' }} onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 border-2 border-blue-900/30 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900/70"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border-2 border-blue-900/30 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900/70"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-2 border-2 border-blue-900/30 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900/70"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border-2 border-blue-900/30 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900/70"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border-2 border-blue-900/30 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900/70"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 mt-4 bg-blue-900/70 rounded-full text-white hover:bg-blue-900"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
