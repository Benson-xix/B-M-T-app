export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-5xl font-bold text-indigo-800 mb-6">
        Welcome to My Full-Stack App!
      </h1>
      <p className="text-xl text-gray-700 mb-8">
        Frontend (Next.js) + Separate Backend (Node.js) 🚀
      </p>
      <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-lg font-medium">
        Get Started
      </button>
    </main>
  );
}