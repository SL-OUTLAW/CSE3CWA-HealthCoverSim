import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import QuoteSummary from "./QuoteSummary";

function QuoteDetail() {
  const { id } = useParams();
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

  // loading state
  if (loading) {
    return <p>Loading quote details...</p>;
  }

  // error state
  if (error) {
    return <p>Error: {error}</p>;
  }

  // not found state
  if (!quoteData) {
    return <p>Quote not found.</p>;
  }

  return (
    <div>
      <h2>Quote Details</h2>

      <div>
        <Link to={`/quotes/${id}/edit`}>Edit Quote</Link>
        <Link to="/quotes">Back to List</Link>
      </div>

      <QuoteSummary data={quoteData} />
    </div>
  );
}

export default QuoteDetail;
