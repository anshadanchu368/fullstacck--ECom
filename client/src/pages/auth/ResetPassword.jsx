import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '@/store/auth-slice';

const passwordRequirements = [
  { id: "length", label: "At least 8 characters", regex: /.{8,}/ },
  { id: "lowercase", label: "One lowercase letter", regex: /[a-z]/ },
  { id: "uppercase", label: "One uppercase letter", regex: /[A-Z]/ },
  { id: "number", label: "One number", regex: /[0-9]/ },
  { id: "special", label: "One special character", regex: /[^A-Za-z0-9]/ },
];

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailForLogin, setEmailForLogin] = useState(''); // To display the email after reset


  const dispatch = useDispatch();
  const { token } = useParams();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const resultAction = await dispatch(resetPassword({ token, password }));
      console.log('Reset password result:', resultAction);

      if (resetPassword.fulfilled.match(resultAction)) {
        if (resultAction.payload?.success) {
          // Store the email if returned from the API
          const userEmail = resultAction.payload.email;
          setEmailForLogin(userEmail);
          
          toast.success('Password reset successful. You can now log in.');
          
          // Slight delay before redirecting
          setTimeout(() => {
            navigate('/auth/login');
          }, 2000);
        } else {
          toast.error(resultAction.payload?.message || 'Reset failed');
        }
      } else {
        console.error('Reset failed:', resultAction);
        toast.error(resultAction.payload || 'Password reset failed. Please try again.');
      }
    } catch (error) {
      console.error('Exception during password reset:', error);
      toast.error('An unexpected error occurred');
    }
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
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-lg font-medium">Reset Your Password</h2>
          <p className="mt-2 text-sm text-gray-500">Enter a new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              className="w-full rounded border p-2 pr-10 focus:ring focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <span
              className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
            </span>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              className="w-full rounded border p-2 pr-10 focus:ring focus:border-primary"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
            <span
              className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-gray-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
            </span>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
        
        {emailForLogin && (
          <div className="text-center text-sm text-green-600">
            Password reset for {emailForLogin}. Redirecting to login...
          </div>
        )}
      </motion.div>
    </div>
  );
}