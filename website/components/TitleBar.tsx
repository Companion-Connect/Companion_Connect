import { JSX } from "preact";

export const TitleBar = () => {
  return (
    <div class="flex items-center justify-between p-4 bg-white shadow-md">
      <div class="flex items-center">
        <img src="/logo.png" alt="Logo" class="h-8 w-8 mr-2" />
        <h1 class="text-xl font-bold">CompanionConnect</h1>
      </div>
      <div class="flex items-center">
        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Sign In
        </button>
        <button class="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
          Sign Up
        </button>
      </div>
    </div>
  );
};
