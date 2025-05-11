import { useDispatch } from 'react-redux';
import { googleLogin } from '@/store/auth-slice';
import { GoogleLogin } from '@react-oauth/google'; // Assuming you're using this
import { toast } from 'sonner';

export default function GoogleLoginButton() {
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    if (!token) return toast.error("Google token missing");

    dispatch(googleLogin(token))
      .unwrap()
      .then((res) => {
        toast.success("Google login successful!");
        // Optional: redirect or close modal
      })
      .catch((err) => {
        toast.error(err || "Google login failed");
      });
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => toast.error("Google Sign-In failed")}
    />
  );
}
