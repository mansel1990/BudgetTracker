import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/budget-tracker"
          className="p-6 bg-blue-500 text-white rounded-xl shadow-lg text-center hover:bg-blue-600 transition"
        >
          <h2 className="text-xl font-semibold">Budget Tracker</h2>
        </Link>
        <Link
          href="/trading-journal"
          className="p-6 bg-green-500 text-white rounded-xl shadow-lg text-center hover:bg-green-600 transition"
        >
          <h2 className="text-xl font-semibold">Trading Journal</h2>
        </Link>
      </div>
    </div>
  );
}
