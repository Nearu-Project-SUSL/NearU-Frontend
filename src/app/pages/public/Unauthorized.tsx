import { useNavigate, Link } from "react-router";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 via-transparent to-red-600/10 animate-gradient"></div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-400/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10 max-w-md w-full">
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-400/30 rounded-3xl p-8 shadow-2xl shadow-red-400/10 text-center animate-slideUp">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-400/50 animate-pulse">
                        <ShieldAlert className="w-10 h-10 text-white" />
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-red-400 mb-4">Access Denied</h1>

                    {/* Message */}
                    <p className="text-gray-300 text-lg mb-2">Unauthorized Access</p>
                    <p className="text-gray-400 mb-8">
                        You do not have permission to access this page. Please contact an administrator if you believe this is an error.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={goBack}
                            className="flex-1 bg-black/40 hover:bg-black/60 border-2 border-red-400/20 hover:border-red-400/40 text-white py-3 rounded-xl transition-all hover:scale-105 duration-300 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </button>
                        <Link
                            to="/"
                            className="flex-1 bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white py-3 rounded-xl transition-all hover:scale-105 duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-400/30"
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </Link>
                    </div>
                </div>

                {/* Help Text */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Need help? <Link to="/login" className="text-red-400 hover:text-red-300 transition-colors">Contact Support</Link>
                </p>
            </div>
        </div>
    )
}

export default Unauthorized;
