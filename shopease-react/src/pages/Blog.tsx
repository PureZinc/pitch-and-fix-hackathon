import { getBlogs } from "../services/useBackend";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Blog {
    title: string
}

export default function Blog() {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        getBlogs().then(bs => setBlogs(bs)).catch(() => setBlogs([]))
    }, [])

  return (
      <main>
          <h2>Blogs</h2>
          <div className="products-grid">
              {blogs.map((blog, index) => (
                  <div className="product-card" key={index}>
                    <div className="product-details">
                          <h3 className="product-title">{blog.title}</h3>
                          <Link to="/">Read More</Link>
                    </div>
                </div>
              ))}
          </div>
    </main>
  )
}
