"use client";

import { useState } from "react";

export default function SimpleTest() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Test</h1>
      <p>Count: {count}</p>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => {
          alert("Button clicked!");
          setCount(count + 1);
        }}
      >
        Click Me
      </button>
    </div>
  );
}
