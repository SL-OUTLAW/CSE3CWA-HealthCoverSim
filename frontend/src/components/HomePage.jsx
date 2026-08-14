import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="homepg-container">
      <p className="homepg-t1">PRIVATE HEALTH INSURANCE QUOTE SIMULATOR</p>
      <h3 className="homepg-t2">
        Turn a few inputs <br /> into a clear premium.
      </h3>
      <h3 className="homepg-t3">
        With cover type, hospital and extras tiers, and applicant ages,
        <br />
        HealthCoverSim works out the estimated monthly and yearly premium,
        <br />
        including Lifetime Health Cover loading and the annual-payment discount,
        <br />
        with a breakdown of each.
      </h3>
      <div className="homepg-nav-container">
        <Link className="homepg-nav-item-primary" to="/quotes/new">
          Create Quote
        </Link>
        <Link className="homepg-nav-item-secondary" to="/quotes">
          View Saved Quotes
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
