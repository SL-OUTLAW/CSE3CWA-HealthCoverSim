// valid values
const VALID_COVER_TYPES = ["single", "couple", "family"];
const VALID_HISTORIES = ["yes", "no", "not sure"];
const VALID_HOSPITALS = ["none", "basic", "bronze", "silver", "gold"];
const VALID_EXTRAS = ["none", "basic", "standard", "premium"];
const VALID_PAYMENTS = ["monthly", "yearly"];

function validateQuote(req, res, next) {
  // data from the request body
  const data = req.body;

  // no lower case validation for name
  if (!data.customer_name || data.customer_name.trim() === "") {
    return res.status(400).json({ error: "Customer name is required" });
  }

  if (!data.cover_type || !VALID_COVER_TYPES.includes(data.cover_type)) {
    return res
      .status(400)
      .json({ error: "Cover type must be single, couple, or family" });
  }

  // applicant 1
  if (!data.applicant1_age) {
    return res.status(400).json({ error: "Applicant 1 age is required" });
  }
  // if age is not null
  const age1 = data.applicant1_age;
  if (age1 < 18 || age1 > 100) {
    return res
      .status(400)
      .json({ error: "Applicant 1 age must be between 18 and 100" });
  }

  // applicant 1 history is required
  if (
    !data.applicant1_cover_history ||
    !VALID_HISTORIES.includes(data.applicant1_cover_history)
  ) {
    return res.status(400).json({
      error: "Applicant 1 cover history must be yes, no, or not sure",
    });
  }

  // conditional fields
  const coverType = data.cover_type;

  if (coverType === "couple" || coverType === "family") {
    // applicant 2 age is required
    if (!data.applicant2_age) {
      return res.status(400).json({
        error: "Applicant 2 age is required for couple or family cover",
      });
    }
    // if age is not null
    const age2 = data.applicant2_age;
    if (age2 < 18 || age2 > 100) {
      return res
        .status(400)
        .json({ error: "Applicant 2 age must be between 18 and 100" });
    }

    // applicant 2 history is required
    if (
      !data.applicant2_cover_history ||
      !VALID_HISTORIES.includes(data.applicant2_cover_history)
    ) {
      return res.status(400).json({
        error: "Applicant 2 cover history must be yes, no, or not sure",
      });
    }
  }

  if (!data.hospital_cover || !VALID_HOSPITALS.includes(data.hospital_cover)) {
    return res.status(400).json({ error: "Invalid hospital cover level" });
  }

  if (!data.extras_cover || !VALID_EXTRAS.includes(data.extras_cover)) {
    return res.status(400).json({ error: "Invalid extras cover level" });
  }

  if (
    !data.payment_frequency ||
    !VALID_PAYMENTS.includes(data.payment_frequency)
  ) {
    return res
      .status(400)
      .json({ error: "Payment frequency must be Monthly or Yearly" });
  }

  // discount must be 0-10
  if (data.annual_discount !== undefined) {
    const discount = data.annual_discount;
    if (discount < 0 || discount > 10) {
      return res
        .status(400)
        .json({ error: "Annual discount must be between 0% and 10%" });
    }
  }

  // pass to async if all valid
  next();
}

module.exports = { validateQuote };
