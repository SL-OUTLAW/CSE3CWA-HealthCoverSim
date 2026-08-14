import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function QuoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    customer_name: "",
    cover_type: "single",
    applicant1_age: "",
    applicant1_cover_history: "yes",
    applicant2_age: "",
    applicant2_cover_history: "yes",
    hospital_cover: "none",
    extras_cover: "none",
    payment_frequency: "monthly",
    annual_discount: 0,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchQuote = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/quotes/${id}`);
          setFormData({
            customer_name: response.data.customer_name || "",
            cover_type: response.data.cover_type || "single",
            applicant1_age: response.data.applicant1_age || "",
            applicant1_cover_history:
              response.data.applicant1_cover_history || "yes",
            applicant2_age: response.data.applicant2_age || "",
            applicant2_cover_history:
              response.data.applicant2_cover_history || "yes",
            hospital_cover: response.data.hospital_cover || "none",
            extras_cover: response.data.extras_cover || "none",
            payment_frequency: response.data.payment_frequency || "monthly",
            annual_discount: response.data.annual_discount || 0,
            notes: response.data.notes || "",
          });
          setFetchError(null);
        } catch (err) {
          console.error("Failed to fetch quote:", err);
          setFetchError("Failed to load quote data");
        } finally {
          setLoading(false);
        }
      };
      fetchQuote();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "payment_frequency") {
      setFormData((prev) => ({
        ...prev,
        payment_frequency: value,
        annual_discount: value === "monthly" ? 0 : prev.annual_discount,
      }));
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        applicant1_age: Number(formData.applicant1_age),
        applicant2_age: Number(formData.applicant2_age),
        annual_discount: Number(formData.annual_discount),
      };

      let response;

      if (isEditMode) {
        response = await api.put(`/quotes/${id}`, payload);
        navigate(`/quotes/${id}`);
      } else {
        response = await api.post("/quotes", payload);
        const newId = response.data.id;
        navigate(`/quotes/${newId}`);
      }
    } catch (err) {
      console.error("Failed to save quote:", err);
      alert("Failed to save quote. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isEditMode && loading) {
    return <p>Loading quote data...</p>;
  }

  if (fetchError) {
    return <p>Error: {fetchError}</p>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">{isEditMode ? "Edit Quote" : "New Quote"}</h2>
      <p className="form-sub-title">
        Enter applicant details to generate a premium estimate.
      </p>
      <form onSubmit={handleSubmit} className="form">
        <div>
          <p className="form-category">CUSTOMER</p>
          <hr className="form-divider" />
        </div>
        <div className="form-input-container">
          <label className="input-label">Customer Name</label>
          <input
            className="form-text-input"
            type="text"
            name="customer_name"
            value={formData.customer_name}
            placeholder="e.g. John Doe"
            onChange={handleChange}
            // pattern for only text and spaces
            onInvalid={(e) => {
              e.target.setCustomValidity("Please enter text only.");
            }}
            onInput={(e) => {
              e.target.setCustomValidity("");
            }}
            pattern="[A-Za-z\s]+"
            required
          />
        </div>
        <div className="form-input-container">
          <label className="input-label">Cover Type</label>
          <div className="radio-options-container">
            <label
              className="radio-options-label"
              style={{
                borderTopLeftRadius: "5px",
                borderBottomLeftRadius: "5px",
              }}
            >
              <input
                className="radio-options"
                type="radio"
                name="cover_type"
                value="single"
                checked={formData.cover_type === "single"}
                onChange={handleChange}
              />
              Single
            </label>

            <label className="radio-options-label">
              <input
                className="radio-options"
                type="radio"
                name="cover_type"
                value="couple"
                checked={formData.cover_type === "couple"}
                onChange={handleChange}
              />
              Couple
            </label>

            <label
              className="radio-options-label"
              style={{
                borderTopRightRadius: "5px",
                borderBottomRightRadius: "5px",
              }}
            >
              <input
                className="radio-options"
                type="radio"
                name="cover_type"
                value="family"
                checked={formData.cover_type === "family"}
                onChange={handleChange}
              />
              Family
            </label>
          </div>
        </div>

        <p className="form-category">APPLICANT 1</p>
        <hr className="form-divider" />

        <div className="form-input-container-double">
          <div className="form-input-container" style={{ marginBottom: "0px" }}>
            <label className="input-label">Age</label>
            <input
              className="form-text-input"
              type="number"
              name="applicant1_age"
              value={formData.applicant1_age}
              onChange={handleChange}
              min="18"
              max="100"
              required
            />
          </div>
          <div className="form-input-container">
            <label className="input-label">Hospital Cover History</label>
            <select
              className="form-select"
              name="applicant1_cover_history"
              value={formData.applicant1_cover_history}
              onChange={handleChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="not sure">Not sure</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-subtext">18-100</label>
        </div>

        {(formData.cover_type === "couple" ||
          formData.cover_type === "family") && (
          <div>
            <p className="form-category">APPLICANT 2</p>
            <hr className="form-divider" />
            <div className="form-input-container-double">
              <div
                className="form-input-container"
                style={{ marginBottom: "0px" }}
              >
                <label className="input-label">Age</label>
                <input
                  className="form-text-input"
                  type="number"
                  name="applicant2_age"
                  value={formData.applicant2_age}
                  onChange={handleChange}
                  min="18"
                  max="100"
                  required
                />
              </div>
              <div className="form-input-container">
                <label className="input-label">Hospital Cover History</label>
                <select
                  className="form-select"
                  name="applicant2_cover_history"
                  value={formData.applicant2_cover_history}
                  onChange={handleChange}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="not sure">Not sure</option>
                </select>
              </div>
            </div>
            <div>
              <label className="form-subtext">18-100</label>
            </div>
          </div>
        )}

        <p className="form-category">COVER TIERS</p>
        <hr className="form-divider" />

        <div className="form-input-container-double">
          <div className="form-input-container">
            <label className="input-label">Hospital Cover</label>
            <select
              className="form-select"
              name="hospital_cover"
              value={formData.hospital_cover}
              onChange={handleChange}
            >
              <option value="none">None</option>
              <option value="basic">Basic</option>
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
            </select>
            <label className="form-subtext">
              LHC Loading applies here only
            </label>
          </div>

          <div className="form-input-container">
            <label className="input-label">Extras Cover</label>
            <select
              className="form-select"
              name="extras_cover"
              value={formData.extras_cover}
              onChange={handleChange}
            >
              <option value="none">None</option>
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        <p className="form-category">PAYMENT</p>
        <hr className="form-divider" />

        <div className="form-input-container-double">
          <div className="form-input-container">
            <label className="input-label">Payment Frequency</label>
            <select
              className="form-select"
              name="payment_frequency"
              value={formData.payment_frequency}
              onChange={handleChange}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="form-input-container">
            <label className="input-label">Annual Discount (%)</label>
            <input
              className="form-text-input"
              type="number"
              name="annual_discount"
              value={formData.annual_discount}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.1"
              disabled={formData.payment_frequency === "monthly"}
            />
          </div>
        </div>

        <div className="form-input-container">
          <label className="input-label" style={{ marginTop: "30px" }}>
            Notes (optional)
          </label>
          <textarea
            className="notes-input"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-btn-container">
          <Link className="form-cancel" to="/">
            Cancel
          </Link>
          <button className="form-create" type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditMode
                ? "Update Quote"
                : "Create Quote"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default QuoteForm;
