// src/pages/AuthPage.jsx
import {
  useEffect,
  useRef,
  useState,
  Fragment,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import * as THREE from 'three';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

/* ---------------- Google icon ---------------- */

const GoogleIcon = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04
      2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23
      1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99
      20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43
      8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09
      14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6
      3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

/* ---------------- Component ---------------- */

export default function AuthPage({ onAuthSuccess }) {
  /* state */
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  /* router */
  const navigate = useNavigate();

  /* vanta */
  const vantaRef = useRef(null);

  useEffect(() => {
    let effect;
    import('vanta/dist/vanta.globe.min').then(({ default: GLOBE }) => {
      effect = GLOBE({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0x616161,
        color2: 0xb3a4a4,
        backgroundColor: 0xf9f9f9,
        size: 0.9,
      });
    });
    return () => effect?.destroy();
  }, []);

  /* helpers */
  const update = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSuccess = (user) => {
    onAuthSuccess?.(user);
    navigate('/');
  };

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url =
        mode === 'signup'
          ? 'https://raiseit.onrender.com/api/auth/register'
          : 'https://raiseit.onrender.com/api/auth/login';

      const body =
        mode === 'signup'
          ? {
              name: form.name,
              email: form.email,
              password: form.password,
            }
          : {
              email: form.email,
              password: form.password,
            };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Authentication failed.');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      handleSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* google */
  const handleGoogle = () => {
    setGoogleLoading(true);
    window.location.href = 'https://raiseit.onrender.com/api/auth/google';
  };

  /* render */
  return (
    <Fragment>
      {/* Vanta background */}
      <div ref={vantaRef} className="fixed inset-0 z-0" />

      {/* page content */}
      <main className="relative z-10 flex min-h-screen flex-col md:flex-row">
        {/* left half with blur/glass */}
        <section
          className="flex w-full flex-col justify-center px-6 py-12
                     bg-white/10 backdrop-blur-sm md:w-1/2"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto w-full max-w-md"
          >
            <header className="mb-10 text-center">
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {mode === 'login'
                  ? 'Welcome Back!'
                  : 'Create an Account'}
              </h1>
              <p className="text-lg text-gray-700">
                {mode === 'login'
                  ? 'Enter your credentials to access your account.'
                  : 'Enter your information to get started.'}
              </p>
            </header>

            {/* form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="name"
                      className="text-base font-medium text-gray-800"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={update('name')}
                      required
                      disabled={loading}
                      className="h-12 bg-white/20"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-base font-medium text-gray-800"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={update('email')}
                  required
                  disabled={loading}
                  className="h-12 bg-white/20"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-base font-medium text-gray-800"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={update('password')}
                  required
                  disabled={loading}
                  className="h-12 bg-white/20"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-md bg-red-50 p-2 text-center
                    text-sm text-red-600"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-gray-900 text-base
                  font-medium text-white hover:bg-gray-800"
              >
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {loading
                  ? 'Please wait...'
                  : mode === 'login'
                  ? 'Log In'
                  : 'Create Account'}
              </Button>

              {/* divider */}
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300/60" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 font-medium text-gray-600">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* google */}
              <Button
                variant="outline"
                disabled={googleLoading}
                onClick={handleGoogle}
                className="h-12 w-full bg-white font-medium hover:bg-gray-100"
              >
                {googleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <GoogleIcon className="mr-2" />
                )}
                Continue with Google
              </Button>

              {/* switch mode */}
              <p className="mt-8 text-center text-base text-gray-700">
                {mode === 'login'
                  ? "Don't have an account?"
                  : 'Already have an account?'}
                <Button
                  type="button"
                  variant="link"
                  onClick={() =>
                    setMode((m) =>
                      m === 'login' ? 'signup' : 'login',
                    )
                  }
                  className="pl-1 font-medium text-gray-900
                    hover:text-gray-700"
                >
                  {mode === 'login' ? 'Sign up' : 'Log in'}
                </Button>
              </p>
            </form>
          </motion.div>
        </section>

        {/* right half (raw globe, no blur) */}
        <div className="hidden md:block md:w-1/2" />
      </main>
    </Fragment>
  );
}