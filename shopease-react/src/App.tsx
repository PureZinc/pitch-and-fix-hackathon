import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Global components
import Header from './components/header';
import Footer from './components/footer';

// Import styles
import './styles/styles.css';
import './styles/cat.css';
import './styles/responsive.css';
import './styles/product-detail.css';

// Import pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';


function App() {
  const pages = [
    { name: 'Home', path: '/', element: <Home /> },
    { name: 'Products', path: '/products', element: <Products /> },
    { name: 'Product Detail', path: '/product/:id', element: <ProductDetail /> },
    { name: 'Wishlist', path: '/wishlist', element: <Wishlist /> },
    { name: 'Blog', path: '/blog', element: <Blog /> },
    { name: 'Contact', path: '/contact', element: <Contact /> },
    { name: 'Checkout', path: '/checkout', element: <Checkout /> },
  ];

  return (
    <Router>
      <Header />
      <Routes>
        {pages.map((page) => (
          <Route key={page.name} path={page.path} element={page.element} />
        ))}
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
