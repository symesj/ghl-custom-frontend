export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold">
          Welcome to GHL Custom Frontend
        </h1>
        <p className="text-lg sm:text-xl text-gray-700">
          Streamlined, secure, and fast — built with Next.js + Tailwind CSS.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
          >
            Login
          </a>
          <a
            href="https://github.com/symesj/ghl-custom-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-400 rounded text-gray-800 hover:bg-gray-200 transition"
          >
            View Code on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
