import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>HealthCoverSim</h1>
      <p>
        Enter cover type, hospital and extras tiers, and applicant ages.
        HealthCoverSim works out the estimated monthly and yearly premium,
        including Lifetime Health Cover loading and the annual-payment discount,
        with a breakdown of every line.
      </p>

      <div>
        <Link to="/quotes/new">New Quote</Link>
        <Link to="/quotes">View Saved Quotes</Link>
      </div>
    </div>
  );
}

export default HomePage;
