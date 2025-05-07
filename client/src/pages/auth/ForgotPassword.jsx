// pages/ForgotPasswordForm.jsx

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '@/store/auth-slice';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    dispatch(forgotPassword(email));
  };

  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md space-y-6 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <Link to="/auth/forgot-password">Forgot Password?</Link>
          <p className="mt-2 text-sm text-gray-500">Enter your email to receive a reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded border p-2 focus:ring focus:border-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </motion.div>
    </div>
  );
}
