import { useState } from "react";

const STEPS = ["Shipping", "Payment", "Confirmation"];

export default function CheckoutPage({ cartItems, token, onBackToCart, onFinish }) {
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", email: "",
    address: "", city: "", state: "", zip: "", country: "United States",
  });
  const [payment, setPayment] = useState({
    cardName: "", cardNumber: "", expiry: "", cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNum, setOrderNum] = useState("");

  const items = Object.values(cartItems);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  /* ── Validation ── */
  function validateShipping() {
    const e = {};
    if (!shipping.firstName.trim()) e.firstName = "Required";
    if (!shipping.lastName.trim()) e.lastName = "Required";
    if (!shipping.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!shipping.address.trim()) e.address = "Required";
    if (!shipping.city.trim()) e.city = "Required";
    if (!shipping.state.trim()) e.state = "Required";
    // if (!shipping.zip.match(/^\d{5}(-\d{4})?$/)) e.zip = "Valid ZIP required";
    return e;
  }

  function validatePayment() {
    const e = {};
    if (!payment.cardName.trim()) e.cardName = "Required";
    const digits = payment.cardNumber.replace(/\s/g, "");
    if (!digits.match(/^\d{16}$/)) e.cardNumber = "16-digit card number required";
    if (!payment.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) e.expiry = "MM/YY format required";
    if (!payment.cvv.match(/^\d{3,4}$/)) e.cvv = "3-4 digit CVV required";
    return e;
  }

  async function handleNext() {
    if (step === 0) {
      const e = validateShipping();
      if (Object.keys(e).length) { setErrors(e); return; }
      setErrors({});
      setStep((s) => s + 1);
    } else if (step === 1) {
      const e = validatePayment();
      if (Object.keys(e).length) { setErrors(e); return; }
      setErrors({});
      
      if (!token) {
        alert("You must be logged in to place an order.");
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await fetch("http://localhost:4000/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ items, shipping, total })
        });
        
        const data = await res.json();
        if (res.ok) {
          setOrderNum(data.orderNumber);
          setStep((s) => s + 1);
        } else {
          alert(data.error || "Failed to place order.");
        }
      } catch (err) {
        alert("Could not connect to server");
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  function handleCardNumberChange(val) {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    setPayment((p) => ({ ...p, cardNumber: formatted }));
  }

  function handleExpiryChange(val) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    setPayment((p) => ({ ...p, expiry: formatted }));
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Back Button */}
      <button
        onClick={step === 0 ? onBackToCart : () => setStep((s) => s - 1)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#3B5BDB", fontSize: 14, fontWeight: 500,
          display: "flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 24,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {step === 0 ? "Back to Cart" : "Back"}
      </button>

      {/* Stepper */}
      <StepIndicator steps={STEPS} current={step} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, marginTop: 28, alignItems: "start" }}>
        {/* Left Panel */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 28 }}>
          {step === 0 && (
            <ShippingForm
              values={shipping}
              errors={errors}
              onChange={(field, val) => setShipping((p) => ({ ...p, [field]: val }))}
            />
          )}
          {step === 1 && (
            <PaymentForm
              values={payment}
              errors={errors}
              onChange={(field, val) => setPayment((p) => ({ ...p, [field]: val }))}
              onCardNumberChange={handleCardNumberChange}
              onExpiryChange={handleExpiryChange}
            />
          )}
          {step === 2 && (
            <ConfirmationView
              shipping={shipping}
              items={items}
              total={total}
              orderNumber={orderNum}
              onFinish={onFinish}
            />
          )}

          {step < 2 && (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              style={{
                marginTop: 28, width: "100%",
                background: isSubmitting ? "#93C5FD" : "linear-gradient(135deg, #3B5BDB, #4F46E5)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "15px 0", fontSize: 16, fontWeight: 700,
                cursor: isSubmitting ? "not-allowed" : "pointer", letterSpacing: 0.3,
                boxShadow: "0 4px 14px rgba(59,91,219,0.3)",
              }}
            >
              {isSubmitting ? "Processing..." : (step === 0 ? "Continue to Payment →" : "Place Order →")}
            </button>
          )}
        </div>

        {/* Order Summary */}
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB",
          padding: 24, position: "sticky", top: 90,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", margin: "0 0 16px" }}>
            Order Summary
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{
                  width: 44, height: 44, background: "#F4F5F7", borderRadius: 8,
                  flexShrink: 0, overflow: "hidden",
                }}>
                  <img src={item.img} alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, color: "#374151", margin: 0, fontWeight: 500,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: 11, color: "#9CA3AF", margin: "2px 0 0" }}>
                    Qty: {item.quantity}
                  </p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#111", whiteSpace: "nowrap" }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            <SRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <SRow label="Shipping" value={shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
              valueColor={shippingCost === 0 ? "#16A34A" : undefined} />
            <SRow label="Tax (8%)" value={`$${tax.toFixed(2)}`} />
            <div style={{ borderTop: "2px solid #F3F4F6", margin: "4px 0" }} />
            <SRow label="Total" value={`$${total.toFixed(2)}`} isBold />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step Indicator ── */
function StepIndicator({ steps, current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 4 }}>
      {steps.map((label, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i <= current ? "#3B5BDB" : "#E5E7EB",
              color: i <= current ? "#fff" : "#9CA3AF",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 14, transition: "background 0.2s",
            }}>
              {i < current ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : i + 1}
            </div>
            <span style={{
              fontSize: 12, fontWeight: i === current ? 600 : 400,
              color: i <= current ? "#3B5BDB" : "#9CA3AF",
            }}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, height: 2, background: i < current ? "#3B5BDB" : "#E5E7EB",
              margin: "0 8px", marginBottom: 18, transition: "background 0.2s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Shipping Form ── */
function ShippingForm({ values, errors, onChange }) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: "0 0 20px" }}>
        Shipping Information
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="First Name" id="firstName" value={values.firstName} error={errors.firstName}
          onChange={(v) => onChange("firstName", v)} />
        <Field label="Last Name" id="lastName" value={values.lastName} error={errors.lastName}
          onChange={(v) => onChange("lastName", v)} />
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Email Address" id="email" value={values.email} error={errors.email}
            type="email" onChange={(v) => onChange("email", v)} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Street Address" id="address" value={values.address} error={errors.address}
            onChange={(v) => onChange("address", v)} />
        </div>
        <Field label="City" id="city" value={values.city} error={errors.city}
          onChange={(v) => onChange("city", v)} />
        <Field label="State / Province" id="state" value={values.state} error={errors.state}
          onChange={(v) => onChange("state", v)} />
        <Field label="ZIP / Postal Code" id="zip" value={values.zip} error={errors.zip}
          onChange={(v) => onChange("zip", v)} />
        <div>
          <label style={labelStyle}>Country</label>
          <select
            value={values.country}
            onChange={(e) => onChange("country", e.target.value)}
            style={inputStyle}
          >
            {["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Nigeria", "Other"]
              .map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

/* ── Payment Form ── */
function PaymentForm({ values, errors, onChange, onCardNumberChange, onExpiryChange }) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: "0 0 6px" }}>Payment Details</h2>
      <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>
        Your payment info is encrypted and secure.
      </p>

      {/* Card visual preview */}
      <div style={{
        background: "linear-gradient(135deg, #3B5BDB, #4F46E5)",
        borderRadius: 16, padding: "22px 24px", marginBottom: 24, color: "#fff",
        position: "relative", overflow: "hidden", minHeight: 120,
      }}>
        <div style={{
          position: "absolute", top: -30, right: -30,
          width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)",
        }} />
        <div style={{ fontSize: 20, letterSpacing: 4, fontWeight: 500, marginBottom: 16 }}>
          {values.cardNumber || "•••• •••• •••• ••••"}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span>{values.cardName || "CARD HOLDER NAME"}</span>
          <span>{values.expiry || "MM/YY"}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Name on Card" id="cardName" value={values.cardName} error={errors.cardName}
            onChange={(v) => onChange("cardName", v)} placeholder="As printed on card" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Card Number</label>
          <input
            id="cardNumber"
            value={values.cardNumber}
            onChange={(e) => onCardNumberChange(e.target.value)}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            style={{ ...inputStyle, ...(errors.cardNumber ? errorBorder : {}) }}
          />
          {errors.cardNumber && <span style={errorStyle}>{errors.cardNumber}</span>}
        </div>
        <div>
          <label style={labelStyle}>Expiry Date</label>
          <input
            id="expiry"
            value={values.expiry}
            onChange={(e) => onExpiryChange(e.target.value)}
            placeholder="MM/YY"
            maxLength={5}
            style={{ ...inputStyle, ...(errors.expiry ? errorBorder : {}) }}
          />
          {errors.expiry && <span style={errorStyle}>{errors.expiry}</span>}
        </div>
        <div>
          <Field label="CVV" id="cvv" value={values.cvv} error={errors.cvv}
            type="password" maxLength={4} placeholder="•••"
            onChange={(v) => onChange("cvv", v)} />
        </div>
      </div>
    </div>
  );
}

/* ── Confirmation View ── */
function ConfirmationView({ shipping, items, total, orderNumber, onFinish }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "linear-gradient(135deg, #DCFCE7, #BBF7D0)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px",
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Order Confirmed!</h2>
      <p style={{ color: "#6B7280", marginBottom: 6 }}>Thank you, <strong>{shipping.firstName}</strong>!</p>
      <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 24 }}>
        A confirmation will be sent to <strong>{shipping.email}</strong>
      </p>

      <div style={{
        background: "#F9FAFB", borderRadius: 12, padding: "16px 20px",
        border: "1px solid #E5E7EB", marginBottom: 24, textAlign: "left",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#6B7280" }}>Order #</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#3B5BDB" }}>{orderNumber}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#6B7280" }}>Delivering to</span>
          <span style={{ fontSize: 13, color: "#374151" }}>{shipping.city}, {shipping.state}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#6B7280" }}>Total charged</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>${total.toFixed(2)}</span>
        </div>
      </div>

      <div style={{
        background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)",
        borderRadius: 10, padding: "12px 18px",
        fontSize: 13, color: "#3730A3", marginBottom: 28,
      }}>
        🚚 Estimated delivery: <strong>3–5 business days</strong>
      </div>

      <button
        onClick={onFinish}
        style={{
          background: "linear-gradient(135deg, #3B5BDB, #4F46E5)",
          color: "#fff", border: "none", borderRadius: 10,
          padding: "14px 36px", fontSize: 15, fontWeight: 700,
          cursor: "pointer", letterSpacing: 0.3,
          boxShadow: "0 4px 14px rgba(59,91,219,0.3)",
        }}
      >
        Continue Shopping
      </button>
    </div>
  );
}

/* ── Shared field helpers ── */
const labelStyle = { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 };
const inputStyle = {
  width: "100%", padding: "10px 14px", 
  borderWidth: "1px", borderStyle: "solid", borderColor: "#D1D5DB",
  borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box",
  transition: "border-color 0.15s",
};
const errorBorder = { borderColor: "#EF4444" };
const errorStyle = { fontSize: 11, color: "#EF4444", display: "block", marginTop: 4 };

function Field({ label, id, value, error, onChange, type = "text", placeholder, maxLength }) {
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, ...(error ? errorBorder : {}) }}
        onFocus={(e) => { e.target.style.borderColor = "#3B5BDB"; e.target.style.boxShadow = "0 0 0 3px rgba(59,91,219,0.1)"; }}
        onBlur={(e) => { e.target.style.borderColor = error ? "#EF4444" : "#D1D5DB"; e.target.style.boxShadow = "none"; }}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}

function SRow({ label, value, isBold, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: 13, color: isBold ? "#111" : "#6B7280", fontWeight: isBold ? 700 : 400 }}>{label}</span>
      <span style={{ fontSize: isBold ? 16 : 13, color: valueColor || (isBold ? "#111" : "#374151"), fontWeight: isBold ? 700 : 500 }}>
        {value}
      </span>
    </div>
  );
}
