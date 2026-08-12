import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

// If id exists = edit mode
function QuoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // form state
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

  // data for edit if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchQuote = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/quotes/${id}`);
          // set existing data
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

  // handle input changes - save to state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // create or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let response;

      if (isEditMode) {
        // PUT request to update
        response = await api.put(`/quotes/${id}`, formData);
        navigate(`/quotes/${id}`);
      } else {
        // POST request to create
        response = await api.post("/quotes", formData);
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

  // render
  return (
    <div>
      <h2>{isEditMode ? "Edit Quote" : "Create New Quote"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer Name</label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Cover Type</label>
          <select
            name="cover_type"
            value={formData.cover_type}
            onChange={handleChange}
          >
            <option value="single">Single</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
          </select>
        </div>

        <h3>Applicant 1</h3>
        <div>
          <label>Age</label>
          <input
            type="number"
            name="applicant1_age"
            value={formData.applicant1_age}
            onChange={handleChange}
            min="18"
            max="100"
            required
          />
        </div>
        <div>
          <label>Hospital Cover History</label>
          <select
            name="applicant1_cover_history"
            value={formData.applicant1_cover_history}
            onChange={handleChange}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="not sure">Not sure</option>
          </select>
        </div>

        {/* conditional applicant 2 - only for Couple/Family) */}
        {(formData.cover_type === "couple" ||
          formData.cover_type === "family") && (
          <div>
            <h3>Applicant 2</h3>
            <div>
              <label>Age</label>
              <input
                type="number"
                name="applicant2_age"
                value={formData.applicant2_age}
                onChange={handleChange}
                min="18"
                max="100"
                required
              />
            </div>
            <div>
              <label>Hospital Cover History</label>
              <select
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
        )}

        <div>
          <label>Hospital Cover</label>
          <select
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
        </div>

        <div>
          <label>Extras Cover</label>
          <select
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

        <div>
          <label>Payment Frequency</label>
          <select
            name="payment_frequency"
            value={formData.payment_frequency}
            onChange={handleChange}
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label>Annual Discount (%)</label>
          <input
            type="number"
            name="annual_discount"
            value={formData.annual_discount}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.1"
          />
        </div>

        <div>
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditMode
                ? "Update Quote"
                : "Create Quote"}
          </button>
          <Link to="/quotes">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default QuoteForm;
