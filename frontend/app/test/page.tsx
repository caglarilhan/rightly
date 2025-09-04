"use client";

import { useState } from "react";

export default function TestPage() {
  const [count, setCount] = useState(0);
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      
      {/* Simple Counter Test */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Counter Test</h2>
        <p>Count: {count}</p>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            console.log("Button clicked!");
            setCount(count + 1);
          }}
        >
          Increment
        </button>
      </div>

      {/* Tab Test */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Tab Test</h2>
        <div className="flex gap-2 mb-4">
          <button 
            className={`px-4 py-2 rounded ${activeTab === "tab1" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => {
              console.log("Tab 1 clicked!");
              setActiveTab("tab1");
            }}
          >
            Tab 1
          </button>
          <button 
            className={`px-4 py-2 rounded ${activeTab === "tab2" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => {
              console.log("Tab 2 clicked!");
              setActiveTab("tab2");
            }}
          >
            Tab 2
          </button>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          {activeTab === "tab1" ? "Tab 1 Content" : "Tab 2 Content"}
        </div>
      </div>

      {/* Modal Test */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Modal Test</h2>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => {
            console.log("Modal button clicked!");
            alert("Modal test!");
          }}
        >
          Open Modal
        </button>
      </div>
    </div>
  );
}
