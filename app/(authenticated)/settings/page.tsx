"use client";

export default function SettingsPage() {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🖌️ Brand Styling</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Primary Color</label>
          <input type="color" className="w-20 h-10 border rounded" defaultValue="#0f0c29" />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">Logo Upload</label>
          <input type="file" className="block w-full border rounded p-2" />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">Brand Name</label>
          <input
            type="text"
            placeholder="e.g., Fast AI Boss"
            className="w-full border rounded p-2"
          />
        </div>

        <button className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
}
