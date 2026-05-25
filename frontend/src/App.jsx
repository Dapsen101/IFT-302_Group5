import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryStrip from "./components/CategoryStrip";
import Sidebar from "./components/Sidebar";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { CONDITIONS } from "./data";


const PAGE_SIZE = 12;
const API_URL = "https://ift-302-group5.onrender.com/api/products";

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

  const [page, setPage] = useState("shop");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // ── Auth state ────────────────────────────────────────────────
  const [user, setUser] = useState(null); // { name, email }
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Check auth on load
  useEffect(() => {
    if (token) {
      fetch("https://ift-302-group5.onrender.com/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          setToken(null);
          localStorage.removeItem("token");
        }
      })
      .catch(() => {
        setToken(null);
        localStorage.removeItem("token");
      });
    }
  }, [token]);

  const handleLogin = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    setPage("shop");
  };

  const handleSignup = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    setPage("shop");
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setCartItems({});
    setPage("shop");
  };

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
        const prods = data.products || [];
        setProducts(prods);
        // Debug: log image URLs to help diagnose missing images
        try {
          console.log('Loaded products:', prods.length, prods.map(p => ({ id: p.id, img: p.img })).slice(0, 10));
        } catch (e) {}
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
        if (!Number.isNaN(minValue) && product.price < minValue) return false;
      }
      if (maxPrice) {
        const maxValue = Number(maxPrice);
        if (!Number.isNaN(maxValue) && product.price > maxValue) return false;
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
      return { ...prev, [product.id]: { ...existing, quantity: existing.quantity + 1 } };
    });

  const handleUpdateQty = (id, qty) => {
    if (qty < 1) { handleRemoveFromCart(id); return; }
    setCartItems((prev) => ({ ...prev, [id]: { ...prev[id], quantity: qty } }));
  };

  const handleRemoveFromCart = (id) =>
    setCartItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const handleFinishOrder = () => {
    setCartItems({});
    setPage("shop");
  };

  // ── Auth-only pages (no navbar/footer) ──────────────────────
  if (page === "login") {
    return <LoginPage onLogin={handleLogin} onGoToSignup={() => setPage("signup")} />;
  }
  if (page === "signup") {
    return <SignupPage onSignup={handleSignup} onGoToLogin={() => setPage("login")} />;
  }

  // ── Shared Navbar ─────────────────────────────────────────────
  const navbar = (
    <Navbar
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      cartCount={cartCount}
      onCartClick={() => setPage("cart")}
      onSignInClick={() => setPage("login")}
      user={user}
      onLogout={handleLogout}
      onNavigate={setPage}
    />
  );

  if (page === "cart") {
    return (
      <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "var(--bg-main)", minHeight: "100vh", color: "var(--text-main)" }}>
        {navbar}
        <CartPage
          cartItems={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemoveFromCart}
          onCheckout={() => setPage("checkout")}
          onContinueShopping={() => setPage("shop")}
        />
        <Footer />
      </div>
    );
  }

  if (page === "checkout") {
    const CheckoutPage = require("./pages/CheckoutPage").default;
    return (
      <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "var(--bg-main)", minHeight: "100vh", color: "var(--text-main)" }}>
        {navbar}
        <CheckoutPage
          cartItems={cartItems}
          token={token}
          onBackToCart={() => setPage("cart")}
          onFinish={handleFinishOrder}
        />
        <Footer />
      </div>
    );
  }

  // ── New Pages ───────────────────────────────────────────────
  if (page === "orders") {
    return (
      <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "var(--bg-main)", minHeight: "100vh", color: "var(--text-main)" }}>
        {navbar}
        <OrdersPage token={token} onNavigate={setPage} />
        <Footer />
      </div>
    );
  }
  
  if (page === "wishlist") {
    return (
      <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "var(--bg-main)", minHeight: "100vh", color: "var(--text-main)" }}>
        {navbar}
        <WishlistPage onNavigate={setPage} />
        <Footer />
      </div>
    );
  }

  if (page === "profile") {
    return (
      <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "var(--bg-main)", minHeight: "100vh", color: "var(--text-main)" }}>
        {navbar}
        <ProfilePage user={user} />
        <Footer />
      </div>
    );
  }

  if (page === "settings") {
    return (
      <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "var(--bg-main)", minHeight: "100vh", color: "var(--text-main)" }}>
        {navbar}
        <SettingsPage />
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "var(--bg-main)", minHeight: "100vh", color: "var(--text-main)" }}>
      {navbar}

      <div style={{ width: "100%", padding: "20px 16px" }}>
        {!searchQuery && (
          <>
            <Hero />
            <CategoryStrip />
          </>
        )}

        <div style={{ display: "flex", gap: "clamp(16px, 3vw, 24px)", alignItems: "flex-start", flexWrap: "wrap", position: "relative" }}>
          
          {/* Mobile Filter Button */}
          {!searchQuery && (
            <div className="show-mobile" style={{ width: "100%", marginBottom: "16px" }}>
              <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                style={{
                  width: "100%", padding: "10px", background: "var(--bg-card)",
                  border: "1px solid var(--border-main)", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  color: "var(--text-main)", fontWeight: "600"
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                {showMobileFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          )}

          {!searchQuery && (
            <div 
              style={{ 
                display: showMobileFilters ? "flex" : "none", 
                flex: "0 0 auto", width: "100%", minHeight: "auto", 
                background: "var(--bg-card)", padding: "16px", borderRadius: "8px", 
                border: "1px solid var(--border-main)" 
              }} 
              className="show-mobile"
            >
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
            </div>
          )}

          {!searchQuery && (
            <div style={{ display: "flex", flex: "0 0 auto", width: "230px", minHeight: "100vh" }} className="hide-mobile">
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
            </div>
          )}
          
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={{ flex: 1, padding: 24, background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border-main)" }}>
                Loading products...
              </div>
            ) : error ? (
              <div style={{ flex: 1, padding: 24, background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border-main)", color: "var(--danger)" }}>
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
      </div>

      <Footer />
    </div>
  );
}
