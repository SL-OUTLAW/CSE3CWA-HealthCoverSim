import { useState, useEffect } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import api from "../services/api";

function QuoteList() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // fetch all quotes on mount
  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/quotes");
      setQuotes(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch quotes:", err);
      setError("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  // loading state
  if (loading) {
    return;
    <div className="view-state">
      <p>Loading quotes...</p>
    </div>;
  }

  // error state
  if (error) {
    return (
      <dir className="view-state">
        <p>Error: {error}</p>
      </dir>
    );
  }

  // empty state
  if (quotes.length === 0) {
    return (
      <div className="view-state">
        <p>No quotes yet.</p>
      </div>
    );
  }

  // table
  return (
    <div className="quotes-container">
      <h2>Quotes</h2>
      <table className="quotes-table">
        <thead>
          <tr>
            <th>CUSTOMER</th>
            <th>COVER</th>
            <th>HOSPITAL COVER</th>
            <th>EXTRAS COVER</th>
            <th>CREATED AT</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((q) => (
            <tr
              key={q.id}
              onClick={() => navigate(`/quotes/${q.id}`)}
              style={{ cursor: "pointer" }}
            >
              <td>{q.customer_name}</td>
              <td>{q.cover_type}</td>
              <td>{q.hospital_cover}</td>
              <td>{q.extras_cover}</td>
              <td>{new Date(q.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuoteList;
