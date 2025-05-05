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


function App() {
  const pages = [
    { name: 'Home', path: '/', element: <Home /> },
    { name: 'Products', path: '/products', element: <Products /> },
    { name: 'Product Detail', path: '/product/:id', element: <h1>Product Detail</h1> },
    { name: 'Wishlist', path: '/wishlist', element: <h1>Wishlist</h1> },
    { name: 'Blog', path: '/blog', element: <h1>Blog</h1> },
    { name: 'Contact', path: '/contact', element: <h1>Contact</h1> },
    { name: 'Checkout', path: '/checkout', element: <h1>Checkout</h1> },
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
