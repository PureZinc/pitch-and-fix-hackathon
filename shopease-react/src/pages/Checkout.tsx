import { useCart } from "../services/cartService";

export default function Checkout() {
    const cartService = useCart();
    const { cart } = cartService;

  return (
    <main>
      <section className="checkout">
        <h1>Checkout</h1>
        <div className="cart-product-grid">
            {cart.map((item, index) => {
                return (
                    <div key={index} className="product-card">
                        <img src={item.imageSrc} alt={item.name} className="product-image" />
                        <div className="product-details">
                            <h2 className="product-name">{item.name}</h2>
                            <p className="product-quantity">Quantity: {item.quantity}</p>
                            <p className="product-price">Total: ${item.price * item.quantity}</p>
                        </div>
                    </div>
                );
            })}
              </div>
              <div className="checkout-details">
                  
              </div>
      </section>
    </main>
  )
}
