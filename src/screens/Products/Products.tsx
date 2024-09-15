import React, { useEffect, useState } from "react";
import "./Products.css"; // Link your CSS here

// Define the structure of a product using an interface
interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    rating: number; // Assuming rating is an integer
}

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]); // Use the Product interface

    // Fetching product data from the API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("https://637067d10399d1995d7ce6ff.mockapi.io/api/v1/products"); // Replace with your API URL
                const data: Product[] = await response.json(); // Ensure data matches Product[]
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <section id="product1" className="section-p1">
            <h2>Featured Products</h2>
            <div className="pro-container">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div className="pro" key={product.id}>
                            <img src={product.image} alt={product.name} />
                            <div className="des">
                                <span>{product.category}</span>
                                <h5>{product.name}</h5>
                                <div className="star">
                                    {[...Array(product.rating)].map((_, index) => (
                                        <i key={index} className="fa fa-star"></i>
                                    ))}
                                </div>
                                <h4>${product.price}</h4>
                            </div>
                            <a className="cart">
                                <i className="fa fa-shopping-cart"></i>
                            </a>
                        </div>
                    ))
                ) : (
                    <p>Loading products...</p>
                )}
            </div>
        </section>
    );
};

export default Products;
