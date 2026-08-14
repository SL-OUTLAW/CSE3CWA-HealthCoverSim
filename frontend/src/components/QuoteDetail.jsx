import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import QuoteSummary from "./QuoteSummary";

function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quoteData, setQuoteData] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/quotes/${id}`);
        setQuoteData(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch quote:", err);
        setError("Failed to load quote details.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this quote?")) {
      return;
    }

    try {
      await api.delete(`/quotes/${id}`);
      navigate("/quotes");
    } catch (err) {
      console.error("Failed to delete quote:", err);
      alert("Failed to delete quote");
    }
  };

  // loading state
  if (loading) {
    return <p className="view-state">Loading quote details...</p>;
  }

  // error state
  if (error) {
    return <p className="view-state">Error: {error}</p>;
  }

  // not found state
  if (!quoteData) {
    return <p className="view-state">Quote not found.</p>;
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <Link className="detail-btn-a" to="/quotes">
          {"<"} Back to List
        </Link>
        <Link className="detail-btn-b" to={`/quotes/${id}/edit`}>
          Edit
        </Link>
        <button className="detail-btn-delete" onClick={handleDelete}>
          Delete
        </button>
      </div>

      <QuoteSummary data={quoteData} />
    </div>
  );
}

export default QuoteDetail;
