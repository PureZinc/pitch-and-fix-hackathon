const BACKEND_URL = "http://localhost:3000";

export const getProducts = async () => {
  const response = await fetch(`${BACKEND_URL}/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

export const getProductById = async (id: string) => {
  const response = await fetch(`${BACKEND_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
};

export const postNewsletterSubscription = async (email: string) => {
  const response = await fetch(`${BACKEND_URL}/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    throw new Error("Failed to subscribe to newsletter");
  }
  return response.json();
}

export const getBlogs = async () => {
  const response = await fetch(`${BACKEND_URL}/blogs`);
  if (!response.ok) {
    throw new Error("Failed to fetch blogs");
  }
  return response.json();
}
