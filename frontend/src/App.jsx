import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./components/HomePage";
import QuoteList from "./components/QuoteList";
import QuoteForm from "./components/QuoteForm";
import QuoteDetail from "./components/QuoteDetail";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <h1>HealthCoverSim</h1>
        <Link to="/">Home</Link>
        <Link to="/quotes/new">New Quote</Link>
        <Link to="/quotes">View Quotes</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quotes" element={<QuoteList />} />
        <Route path="/quotes/new" element={<QuoteForm />} />
        <Route path="/quotes/:id" element={<QuoteDetail />} />
        <Route path="/quotes/:id/edit" element={<QuoteForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
