export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 p-8 text-center">
      <h1 className="text-5xl font-bold mb-4">
        Welcome to <span className="text-blue-600">Fast Ai Boss</span>
      </h1>
      <p className="text-lg mb-6">
        Your streamlined Go High Level dashboard — powered by Next.js & Tailwind CSS
      </p>

      <div className="flex gap-4">
        <a
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Login to Dashboard
        </a>
        <a
          href="https://github.com/symesj/ghl-custom-frontend"
          target="_blank"
          className="px-6 py-3 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
        >
          View Code on GitHub
        </a>
      </div>

      <p className="mt-10 text-sm text-gray-400">
        Built by Jon Symes 🚀
      </p>
    </main>
  );
}
