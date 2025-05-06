import { useCart } from "../services/cartService";
import type { CartItem } from "../services/cartService";
import { useState, useCallback } from "react";
import { postCheckout, type CheckoutInterface } from "../services/useBackend";

// Styles
import styles from '../styles/checkout.module.css';

const CheckoutForm: React.FC<{cart: CartItem[]}> = ({cart}) => {
  const [formFields, setFormFields] = useState<Omit<CheckoutInterface, 'items'>>({
    email: "",
    address: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  }, []);

  const handleFormSubmission = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form fields
    if (!formFields.email || !formFields.address || !formFields.cardNumber || !formFields.expiryDate || !formFields.cvv) {
      alert("Please fill in all the required fields.");
      return;
    }

    // Set up post data
    const postData: CheckoutInterface = {
      ...formFields, items: cart
    };

    // Send through Backend Endpoint
    postCheckout(postData)
      .then(() => {
        // Reset form fields
        setFormFields({
          email: "",
          address: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [formFields, cart]);

  const FormGroup = useCallback(({
    label,
    id,
    name,
    type = "text",
    placeholder,
    value,
    isTextarea = false
  }: {
    label: string;
    id: string;
    name: string;
    type?: string;
    placeholder: string;
    value: string;
    isTextarea?: boolean;
  }) => (
    <div className={styles.formGroup}>
      <label htmlFor={id} className={styles.formLabel}>{label}</label>
      {isTextarea ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          required
          className={styles.formTextarea}
          value={value}
          onChange={handleFieldChange}
        ></textarea>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          required
          className={styles.formInput}
          value={value}
          onChange={handleFieldChange}
        />
      )}
    </div>
  ), [handleFieldChange]);

  return (
    <form onSubmit={handleFormSubmission} className={styles.checkoutForm}>
      <FormGroup
        label="Email"
        id="email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formFields.email}
      />
      <FormGroup
        label="Address"
        id="address"
        name="address"
        placeholder="Enter your address"
        value={formFields.address}
        isTextarea
      />
      <FormGroup
        label="Card Number"
        id="cardNumber"
        name="cardNumber"
        placeholder="Enter your card number"
        value={formFields.cardNumber}
      />
      <FormGroup
        label="Expiry Date"
        id="expiryDate"
        name="expiryDate"
        placeholder="MM/YY"
        value={formFields.expiryDate}
      />
      <FormGroup
        label="CVV"
        id="cvv"
        name="cvv"
        placeholder="Enter CVV"
        value={formFields.cvv}
      />
      <button type="submit" className={styles.submitButton}>Place Order</button>
    </form>
  );
};


export default function Checkout() {
  const cartService = useCart();
  const { cart, removeFromCart } = cartService;
  
  const CheckoutItemCard: React.FC<{item: CartItem}> = ({item}) => {
    return (
      <div className={styles.productCard}>
        <img src={item.imageSrc} alt={item.name} className={styles.productImage} />
        <div className={styles.productDetails}>
            <h2 className={styles.productName}>{item.name}</h2>
            <p className={styles.productQuantity}>Quantity: {item.quantity}</p>
          <p className={styles.productPrice}>Total: ${(item.price * item.quantity).toFixed(2)}</p>
            <button
              className={styles.addToCartBtn}
              onClick={() => {
                if (window.confirm(`Are you sure you want to remove ${item.name} from the cart?`)) {
                  removeFromCart(item.id);
                }
              }}
            >
              Remove from Cart
            </button>
        </div>
      </div>
    )
  }

  return (
    <main>
      <section className={styles.checkout}>
        <h1>Checkout</h1>
        <div className={styles.cartProductGrid}>
          {cart.map((item, index) => <CheckoutItemCard item={item} key={index} />)}
        </div>
        <div className={styles.checkoutDetails}>
          <h2>Order Summary</h2>
          <p>Total Items: {cart.reduce((total, item) => total + item.quantity, 0)}</p>
          <p>
            Total Price: $
            {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
          </p>
          <CheckoutForm cart={cart} />
        </div>
      </section>
    </main>
  )
}
