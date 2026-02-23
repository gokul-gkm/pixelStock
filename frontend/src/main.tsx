import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from "sonner";
import { RouterProvider } from 'react-router-dom';
import { router } from './routers/UserRouters.tsx';
import { toastIcons, toastOptions } from './config/toastConfig.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Toaster position="bottom-right" gap={8} toastOptions={toastOptions}icons={toastIcons} />
        <RouterProvider router={router} />

  </StrictMode>,
)
