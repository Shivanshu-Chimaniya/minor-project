import {useGoogleLogin} from "@react-oauth/google";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {useAuth} from "../context/AuthContext";

const GoogleLogin = () => {
	const auth = useAuth();

	const googleLogin = useGoogleLogin({
		onSuccess: auth.responseGoogle,
		onError: auth.responseGoogle,
		flow: "auth-code",
	});

	return <button onClick={googleLogin}>Sign in with Google</button>;
};

const GoogleLoginButton = () => {
	return (
		<GoogleOAuthProvider clientId="1059649440026-a1s6aatv4phlb7lfiqidipg7bq0r80n9.apps.googleusercontent.com">
			<GoogleLogin />
		</GoogleOAuthProvider>
	);
};

export default GoogleLoginButton;
