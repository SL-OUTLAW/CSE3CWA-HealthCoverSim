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
    <div>
      <div>
        <h2>{customer_name}</h2>
        <div>
          <span>{cover_type}</span>
          <span>{hospital_cover} hospital</span>
          <span>{extras_cover} extras</span>
          <span>{payment_frequency}</span>
        </div>
      </div>

      <hr />
      <div>
        <h4>MONTHLY PREMIUM</h4>
        <p>${monthly_premium}</p>
      </div>

      <hr />
      <div>
        <h4>HOSPITAL COVER</h4>

        <div>
          <p>
            <strong>Applicant 1</strong> - {hospital_cover} base
          </p>
          <p>${baseHospitalPrice.toFixed(2)}</p>
        </div>
        <div>
          <p>
            <strong>Applicant 1 - LHC loading</strong>
          </p>
          <p>
            {applicant1_lhc !== null && applicant1_lhc !== undefined
              ? `${(applicant1_lhc * 100).toFixed(0)}%`
              : "Unknown"}
          </p>
          {applicant1_lhc === null || applicant1_lhc === undefined ? (
            <p>Unknown - loading not applied</p>
          ) : applicant1_lhc === 0 ? (
            <p>No loading applied</p>
          ) : (
            <p>
              {applicant1_age} years old, no prior cover -{" "}
              {(applicant1_lhc * 100).toFixed(0)}% loading
            </p>
          )}
        </div>

        <div>
          <p>
            <strong>Applicant 1 - loaded hospital cost</strong>
          </p>
          <p>${applicant1LoadedCost.toFixed(2)}</p>
        </div>

        {/* applicant 2 if Couple or Family */}
        {isCoupleOrFamily && (
          <>
            <div>
              <p>
                <strong>Applicant 2</strong> - {hospital_cover} base
              </p>
              <p>${baseHospitalPrice.toFixed(2)}</p>
            </div>

            <div>
              <p>
                <strong>Applicant 2 - LHC loading</strong>
              </p>
              <p>
                {applicant2_lhc !== null && applicant2_lhc !== undefined
                  ? `${(applicant2_lhc * 100).toFixed(0)}%`
                  : "Unknown"}
              </p>
              {applicant2_lhc === null || applicant2_lhc === undefined ? (
                <p>Unknown - loading not applied</p>
              ) : applicant2_lhc === 0 ? (
                <p>No loading applied</p>
              ) : (
                <p>
                  {applicant2_age} years old, no prior cover -{" "}
                  {(applicant2_lhc * 100).toFixed(0)}% loading
                </p>
              )}
            </div>

            <div>
              <p>
                <strong>Applicant 2 - loaded hospital cost</strong>
              </p>
              <p>${applicant2LoadedCost.toFixed(2)}</p>
            </div>
          </>
        )}

        <div>
          <p>
            <strong>Hospital total</strong>
          </p>
          <p>${hospital_total.toFixed(2)}</p>
        </div>

        <p>
          <em>{lhc_statement}</em>
        </p>
      </div>

      <hr />
      <div>
        <h4>EXTRAS COVER</h4>

        <div>
          <p>
            {extras_cover} base ×{" "}
            {cover_type === "single" ? "1 adult" : "2 adults"}
          </p>
          <p>
            ${(baseExtrasPrice * (cover_type === "single" ? 1 : 2)).toFixed(2)}
          </p>
          <p>Not subject to LHC loading</p>
        </div>

        <div>
          <p>
            <strong>Extras total</strong>
          </p>
          <p>${extras_total.toFixed(2)}</p>
        </div>
      </div>

      <hr />
      <div>
        <h4>TOTALS</h4>

        <div>
          <p>
            <strong>Monthly premium</strong>
          </p>
          <p>${monthly_premium.toFixed(2)}</p>
        </div>

        <div>
          <p>
            <strong>Yearly premium before discount</strong>
          </p>
          <p>${yearly_before_discount.toFixed(2)}</p>
          <p>Monthly × 12</p>
        </div>

        {/* only if Yearly */}
        {isYearly && (
          <div>
            <p>
              <strong>Annual-payment discount ({annual_discount}%)</strong>
            </p>
            <p>${discountAmount.toFixed(2)}</p>
          </div>
        )}

        <div>
          <p>
            <strong>Yearly premium after discount</strong>
          </p>
          <p>${yearly_after_discount.toFixed(2)}</p>
        </div>
      </div>

      <hr />
      <div>
        <h4>SUMMARY</h4>
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
        <div>
          <p>
            <strong>Warning:</strong> Applicant 1's cover history is unknown.
            LHC loading has not been applied. This quote may be inaccurate.
          </p>
        </div>
      )}

      {applicant2_cover_history === "not sure" && isCoupleOrFamily && (
        <div>
          <p>
            <strong>Warning:</strong> Applicant 2's cover history is unknown.
            LHC loading has not been applied. This quote may be inaccurate.
          </p>
        </div>
      )}

      <hr />
      <div>
        <Link to={`/quotes/${data.id}/edit`}>Edit Quote</Link>
        <Link to="/quotes">Back to List</Link>
      </div>
    </div>
  );
}

export default QuoteSummary;
