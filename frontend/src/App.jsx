import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./components/HomePage";
import QuoteList from "./components/QuoteList";
import QuoteForm from "./components/QuoteForm";
import QuoteDetail from "./components/QuoteDetail";

function App() {
  return (
    <BrowserRouter>
      <div className="nav-bar-container">
        <nav className="nav-bar">
          <h1 className="nav-title">HealthCoverSim</h1>
          <NavLink
            end
            className={({ isActive }) =>
              isActive ? "nav-item-active" : "nav-item"
            }
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            end
            className={({ isActive }) =>
              isActive ? "nav-item-active" : "nav-item"
            }
            to="/quotes/new"
          >
            New Quote
          </NavLink>
          <NavLink
            end
            className={({ isActive }) =>
              isActive ? "nav-item-active" : "nav-item"
            }
            to="/quotes"
          >
            View Quotes
          </NavLink>
        </nav>
        <hr className="divider" style={{margin:"0px"}}/>
      </div>

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
