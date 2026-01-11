import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-8xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-4">
                    404
                </h1>
                <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
                <p className="text-white/60 mb-8 max-w-md">
                    The page you`&apos;re looking for doesn`&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-full px-8 py-4 transition-all duration-300 hover:scale-[1.02]"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}
