"use client";

export default function Test() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Basic Test</h1>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => alert("Hello!")}
      >
        Click Me
      </button>
    </div>
  );
}
