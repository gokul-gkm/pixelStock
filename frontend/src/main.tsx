import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from "sonner";
import { RouterProvider } from 'react-router-dom';
import { router } from './routers/UserRouters.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Toaster position="bottom-right" gap={8}
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13.5,
              fontWeight: 500,
              borderRadius: 14,
              padding: "11px 16px",
            },
          }}
        />
        <RouterProvider router={router} />

  </StrictMode>,
)
