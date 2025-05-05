import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Import services
import { CartProvider } from './services/cartService.tsx';
import { WishlistProvider } from './services/wishlistService.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </CartProvider>
  </StrictMode>,
)
