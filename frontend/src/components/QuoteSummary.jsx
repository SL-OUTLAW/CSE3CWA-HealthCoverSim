import { Link } from "react-router-dom";

function QuoteSummary({ data }) {
  // destructure calculation data
  const {
    monthly_premium,
    yearly_before_discount,
    yearly_after_discount,
    hospital_total,
    extras_total,
    family_fee,
    applicant1_lhc,
    applicant2_lhc,
    lhc_statement,
  } = data;

  // destructure db data
  const {
    customer_name,
    cover_type,
    applicant1_age,
    applicant1_cover_history,
    applicant2_age,
    applicant2_cover_history,
    hospital_cover,
    extras_cover,
    payment_frequency,
    annual_discount,
  } = data;

  const isYearly = payment_frequency === "yearly";
  const isCoupleOrFamily = cover_type === "couple" || cover_type === "family";

  const baseHospitalPrice =
    hospital_cover === "none"
      ? 0
      : hospital_cover === "basic"
        ? 90
        : hospital_cover === "bronze"
          ? 120
          : hospital_cover === "silver"
            ? 160
            : hospital_cover === "gold"
              ? 220
              : 0;

  const baseExtrasPrice =
    extras_cover === "none"
      ? 0
      : extras_cover === "basic"
        ? 25
        : extras_cover === "standard"
          ? 45
          : extras_cover === "premium"
            ? 70
            : 0;

  // cal loaded costs for each applicant
  const applicant1LoadedCost = baseHospitalPrice * (1 + (applicant1_lhc || 0));
  const applicant2LoadedCost = isCoupleOrFamily
    ? baseHospitalPrice * (1 + (applicant2_lhc || 0))
    : 0;

  // cal discount amount
  const discountAmount = isYearly
    ? yearly_before_discount - yearly_after_discount
    : 0;

  return (
    <div className="summary-container">
      <div className="summary-header">
        <p className="label">Summary</p>
        <h2 className="name">{customer_name}</h2>
        <div className="meta">
          <span>{cover_type}</span>
          <span>{hospital_cover} hospital</span>
          <span>{extras_cover} extras</span>
          <span>{payment_frequency}</span>
        </div>
      </div>

      <hr className="summary-divider" />

      <div className="monthly-premium">
        <p className="label">Monthly Premium</p>
        <p className="amount">${monthly_premium}</p>
      </div>

      <hr className="summary-divider" />

      <div>
        <h4 className="section-title">Hospital Cover</h4>

        <div className="detail-line">
          <span className="label">Applicant 1 - {hospital_cover} base</span>
          <span className="value">${baseHospitalPrice.toFixed(2)}</span>
        </div>

        <div className="lhc-line">
          <div className="detail-line">
            <span className="label">Applicant 1 - LHC loading</span>
            <span className="value">
              {applicant1_lhc !== null && applicant1_lhc !== undefined
                ? `${(applicant1_lhc * 100).toFixed(0)}%`
                : "Unknown"}
            </span>
          </div>
          <div className="detail-line">
            <span className="note">
              {applicant1_lhc === null || applicant1_lhc === undefined
                ? "Unknown - loading not applied"
                : applicant1_lhc === 0
                  ? "No loading applied"
                  : `${applicant1_age} years old, no prior cover - ${(applicant1_lhc * 100).toFixed(0)}% loading`}
            </span>
          </div>
        </div>

        <div className="loaded-cost-line">
          <div className="detail-line">
            <span className="label">Applicant 1 - loaded hospital cost</span>
            <span className="value">${applicant1LoadedCost.toFixed(2)}</span>
          </div>
        </div>

        {isCoupleOrFamily && (
          <>
            <div className="detail-line" style={{ marginTop: "12px" }}>
              <span className="label">Applicant 2 - {hospital_cover} base</span>
              <span className="value">${baseHospitalPrice.toFixed(2)}</span>
            </div>

            <div className="lhc-line">
              <div className="detail-line">
                <span className="label">Applicant 2 - LHC loading</span>
                <span className="value">
                  {applicant2_lhc !== null && applicant2_lhc !== undefined
                    ? `${(applicant2_lhc * 100).toFixed(0)}%`
                    : "Unknown"}
                </span>
              </div>
              <div className="detail-line">
                <span className="note">
                  {applicant2_lhc === null || applicant2_lhc === undefined
                    ? "Unknown - loading not applied"
                    : applicant2_lhc === 0
                      ? "No loading applied"
                      : `${applicant2_age} years old, no prior cover - ${(applicant2_lhc * 100).toFixed(0)}% loading`}
                </span>
              </div>
            </div>

            <div className="loaded-cost-line">
              <div className="detail-line">
                <span className="label">
                  Applicant 2 - loaded hospital cost
                </span>
                <span className="value">
                  ${applicant2LoadedCost.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}

        <div className="total-line">
          <span>Hospital total</span>
          <span className="value">${hospital_total.toFixed(2)}</span>
        </div>

        <div className="lhc-statement">
          <em>{lhc_statement}</em>
        </div>
      </div>

      <div>
        <h4 className="section-title">Extras Cover</h4>

        <div className="detail-line">
          <span className="label">
            {extras_cover} base ×{" "}
            {cover_type === "single" ? "1 adult" : "2 adults"}
          </span>
          <span className="value">
            ${(baseExtrasPrice * (cover_type === "single" ? 1 : 2)).toFixed(2)}
          </span>
        </div>
        <div className="detail-line">
          <span className="note">Not subject to LHC loading</span>
        </div>

        <div className="total-line">
          <span>Extras total</span>
          <span className="value">${extras_total.toFixed(2)}</span>
        </div>
      </div>

      <hr className="summary-divider" />

      <div className="totals-section">
        <h4 className="section-title">Totals</h4>

        <div className="total-line">
          <span>Monthly premium</span>
          <span className="value">${monthly_premium.toFixed(2)}</span>
        </div>

        <div className="total-line">
          <span>Yearly premium </span>
          <span className="sub">monthly × 12</span>
          <span className="value">${yearly_before_discount.toFixed(2)}</span>
        </div>

        {isYearly && (
          <div className="total-line discount-line">
            <span>Annual-payment discount ({annual_discount}%)</span>
            <span className="value"> -${discountAmount.toFixed(2)}</span>
          </div>
        )}

        {isYearly && (
          <div className="total-line">
            <span>Yearly premium after discount</span>
            <span className="value">${yearly_after_discount.toFixed(2)}</span>
          </div>
        )}

        <div className="total-line">
          <span>Yearly premium</span>
          <span className="value">${yearly_after_discount.toFixed(2)}</span>
        </div>
      </div>

      <hr className="summary-divider" />

      <div className="plain-summary">
        <p>
          This is a {cover_type} {hospital_cover} hospital and {extras_cover}{" "}
          extras quote for {customer_name}.
          {isYearly
            ? ` Paying yearly brings the total to $${yearly_after_discount.toFixed(
                2,
              )} after a ${annual_discount}% discount.`
            : ` Paying monthly brings the total to $${monthly_premium.toFixed(
                2,
              )} per month, or $${yearly_before_discount.toFixed(
                2,
              )} per year (no discount applied).`}
        </p>
      </div>

      {applicant1_cover_history === "not sure" && (
        <div className="warning">
          <p>
            <strong>Warning:</strong> Applicant 1's cover history is unknown.
            LHC loading has not been applied. This quote may be inaccurate.
          </p>
        </div>
      )}

      {applicant2_cover_history === "not sure" && isCoupleOrFamily && (
        <div className="warning">
          <p>
            <strong>Warning:</strong> Applicant 2's cover history is unknown.
            LHC loading has not been applied. This quote may be inaccurate.
          </p>
        </div>
      )}

      <div className="summary-nav">
        <Link to="/quotes">Back to List</Link>
        <Link to={`/quotes/${data.id}/edit`}>Edit Quote</Link>
      </div>
    </div>
  );
}

export default QuoteSummary;
