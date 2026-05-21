import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryStrip from "./components/CategoryStrip";
import Sidebar from "./components/Sidebar";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import { CONDITIONS } from "./data";

const PAGE_SIZE = 6;
const API_URL = "http://localhost:4000/api/products";

export default function App() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All Categories");
  const [selectedCondition, setSelectedCondition] = useState("Any condition");
  const [checkedBrands, setCheckedBrands] = useState({});
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = useMemo(
    () => [
      "All Categories",
      ...Array.from(new Set(products.map((product) => product.category))).filter(Boolean),
    ],
    [products]
  );

  const brands = useMemo(
    () => Array.from(new Set(products.map((product) => product.brand))).sort(),
    [products]
  );

  useEffect(() => {
    if (brands.length && Object.keys(checkedBrands).length === 0) {
      setCheckedBrands(Object.fromEntries(brands.map((brand) => [brand, true])));
    }
  }, [brands, checkedBrands]);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setError("");
      })
      .catch((err) => setError(err.message || "Fetch error"))
      .finally(() => setLoading(false));
  }, []);

  const cartCount = useMemo(
    () => Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const filteredProducts = useMemo(() => {
    const activeBrands =
      Object.keys(checkedBrands).length === 0
        ? brands
        : Object.entries(checkedBrands).filter(([, enabled]) => enabled).map(([brand]) => brand);

    return products.filter((product) => {
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      if (selectedCat !== "All Categories" && product.category !== selectedCat) {
        return false;
      }

      if (selectedCondition !== "Any condition" && product.condition !== selectedCondition) {
        return false;
      }

      if (activeBrands.length > 0 && !activeBrands.includes(product.brand)) {
        return false;
      }

      if (minPrice) {
        const minValue = Number(minPrice);
        if (!Number.isNaN(minValue) && product.price < minValue) {
          return false;
        }
      }

      if (maxPrice) {
        const maxValue = Number(maxPrice);
        if (!Number.isNaN(maxValue) && product.price > maxValue) {
          return false;
        }
      }

      if (selectedRating && product.rating < selectedRating) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCat, selectedCondition, checkedBrands, minPrice, maxPrice, selectedRating, brands]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCat, selectedCondition, checkedBrands, minPrice, maxPrice, selectedRating]);

  const handleBrandToggle = (brand) =>
    setCheckedBrands((prev) => ({ ...prev, [brand]: !prev[brand] }));

  const handleClearFilters = () => {
    setSelectedCat("All Categories");
    setSelectedCondition("Any condition");
    setCheckedBrands(Object.fromEntries(brands.map((brand) => [brand, true])));
    setMinPrice("");
    setMaxPrice("");
    setSelectedRating(0);
  };

  const handleAddToCart = (product) =>
    setCartItems((prev) => {
      const existing = prev[product.id] ?? { ...product, quantity: 0 };
      return {
        ...prev,
        [product.id]: { ...existing, quantity: existing.quantity + 1 },
      };
    });

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#F8F9FA", minHeight: "100vh", color: "#111" }}>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} cartCount={cartCount} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <Hero />
        <CategoryStrip />

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <Sidebar
            categories={categories}
            brands={brands}
            selectedCat={selectedCat}
            selectedCondition={selectedCondition}
            checkedBrands={checkedBrands}
            minPrice={minPrice}
            maxPrice={maxPrice}
            selectedRating={selectedRating}
            onCategoryChange={setSelectedCat}
            onConditionChange={setSelectedCondition}
            onBrandToggle={handleBrandToggle}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onRatingChange={setSelectedRating}
            onClearFilters={handleClearFilters}
          />
          {loading ? (
            <div style={{ flex: 1, padding: 24, background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB" }}>
              Loading products...
            </div>
          ) : error ? (
            <div style={{ flex: 1, padding: 24, background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", color: "#B91C1C" }}>
              {error}
            </div>
          ) : (
            <ProductGrid
              products={filteredProducts}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              onAddToCart={handleAddToCart}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
