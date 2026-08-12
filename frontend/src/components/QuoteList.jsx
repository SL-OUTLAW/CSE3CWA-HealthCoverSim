import { useState, useEffect } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import api from "../services/api";

function QuoteList() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

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

  // handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quote?")) {
      return;
    }

    try {
      await api.delete(`/quotes/${id}`);
      setQuotes(quotes.filter((quote) => quote.id !== id));
    } catch (err) {
      console.error("Failed to delete quote:", err);
      alert("Failed to delete quote");
    }
  };

  // loading state
  if (loading) {
    return <p>Loading quotes...</p>;
  }

  // error state
  if (error) {
    return <p>Error: {error}</p>;
  }

  // empty state
  if (quotes.length === 0) {
    return (
      <div>
        <p>No quotes yet.</p>
        <Link to="/quotes/new">Create your first quote</Link>
      </div>
    );
  }

  // render the tables
  return (
    <div>
      <h2>Saved Quotes</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cover Type</th>
            <th>Hospital Cover</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((q) => (
            <tr key={q.id} onClick={() => navigate(`/quotes/${q.id}`)} style={{cursor: "pointer"}}>
              <td>{q.customer_name}</td>
              <td>{q.cover_type}</td>
              <td>{q.hospital_cover}</td>
              <td>{new Date(q.created_at).toLocaleString()}</td>
              <td>
                <Link to={`/quotes/${q.id}`}>View</Link>
                <Link to={`/quotes/${q.id}/edit`}>Edit</Link>
                <button onClick={() => handleDelete(q.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuoteList;
