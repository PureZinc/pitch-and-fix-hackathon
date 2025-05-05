import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Global components
import Header from './components/header';
import Footer from './components/footer';


// Import styles
import './styles/styles.css';
import './styles/cat.css';
import './styles/responsive.css';
import './styles/product-detail.css';


function App() {
  const pages = [
    { name: 'Home', path: '/', element: <h1>Home</h1> },
    { name: 'Products', path: '/products', element: <h1>Products</h1> },
    { name: 'Cart', path: '/cart', element: <h1>Cart</h1> },
    { name: 'Product Detail', path: '/product/:id', element: <h1>Product Detail</h1> },
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
