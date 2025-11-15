import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "@/pages/home";
import ItemsPage from "@/pages/items";
import PurchasePage from "@/pages/purchase";
import { queryClient } from "@/shared/utils/queryClient";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/items", element: <ItemsPage /> },
  { path: "/purchase", element: <PurchasePage /> }
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<p className="p-6 text-slate-400">画面を読み込み中...</p>}>
        <RouterProvider router={router} />
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
