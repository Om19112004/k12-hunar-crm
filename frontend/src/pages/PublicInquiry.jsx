
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { api } from "../services/api";

export default function PublicInquiry() {
  const initialForm = {
    user_type: "Parent",
    category: "Admission",
    name: "",
    email: "",
    phone: "",
    message: "",
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    setIsError(false);

    try {
      await api.submitInquiry(form);
      setResponse("Your inquiry has been submitted successfully!");
      setForm(initialForm);
    } catch (error) {
      setIsError(true);
      setResponse(error.message || "Unable to submit your inquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="navbar">
        <h2>K12 Hunar</h2>
        <span>Inquiry Portal</span>
      </header>

      <main className="container">
        <section className="intro">
          <p className="eyebrow">WE ARE HERE TO HELP</p>
          <h1>How can we help you?</h1>
          <p>Submit your inquiry and our team will get back to you.</p>
        </section>

        <form className="inquiry-card" onSubmit={handleSubmit}>
          <h2>Submit an Inquiry</h2>
          <p className="subtitle">
            Please provide your details below.
          </p>

          <div className="form-grid">
            <label>
              I am a *
              <select
                name="user_type"
                value={form.user_type}
                onChange={handleChange}
              >
                <option value="Parent">Parent</option>
                <option value="Student">Student</option>
                <option value="School">School</option>
              </select>
            </label>

            <label>
              Inquiry Category *
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="Scholarship">Scholarship</option>
                <option value="Concert">Concert</option>
                <option value="Admission">Admission</option>
                <option value="General Query">General Query</option>
              </select>
            </label>

            <label>
              Full Name *
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                maxLength={100}
              />
            </label>

            <label>
              Email Address *
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                maxLength={255}
              />
            </label>

            <label>
              Phone Number *
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                maxLength={20}
              />
            </label>

            <label className="full-width">
              Your Message *
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your inquiry here..."
                rows={5}
                required
              />
            </label>
          </div>

          {response && (
            <p
              className="response"
              style={
                isError
                  ? { background: "#fff0f0", color: "#bd3030" }
                  : {}
              }
              role="alert"
            >
              {response}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Inquiry"}
            {!loading && <ArrowRight size={17} />}
          </button>
        </form>

        <footer style={{ textAlign: "center", marginTop: "25px" }}>
          <Link
            to="/admin/login"
            style={{
              color: "#68758a",
              fontSize: "13px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ShieldCheck size={15} />
            Admin access
          </Link>
        </footer>
      </main>
    </div>
  );
}
