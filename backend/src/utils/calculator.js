const HOSPITAL_PRICES = {
  none: 0,
  basic: 90,
  bronze: 120,
  silver: 160,
  gold: 220,
};

const EXTRA_PRICES = {
  none: 0,
  basic: 25,
  standard: 45,
  premium: 70,
};

// cal LHC loading
function cal_lhc(age, history, hospital_cover) {
  if (history === "none" || hospital_cover === "none") {
    return 0;
  }

  if (history === "yes" || history === "Yes") {
    return 0;
  }

  if (history === "not sure") {
    return null;
  }

  if (age <= 30) {
    return 0;
  }

  // return (age - 30) * 2%
  return (age - 30) * 0.02;
}

// main cal logic
function cal_quote(data) {
  let adults = data.cover_type === "single" ? 1 : 2;

  // cal applicant 1 hospital cost with LHC
  let lhc1 = cal_lhc(
    data.applicant1_age,
    data.applicant1_cover_history,
    data.hospital_cover,
  );

  let a1_cost = HOSPITAL_PRICES[data.hospital_cover] * (1 + (lhc1 || 0));

  let lhc2 = 0;
  let a2_cost = 0;

  if (adults == 2) {
    // cal applicant 2 hospital cost with LHC
    lhc2 = cal_lhc(
      data.applicant2_age,
      data.applicant2_cover_history,
      data.hospital_cover,
    );

    a2_cost = HOSPITAL_PRICES[data.hospital_cover] * (1 + (lhc2 || 0));
  }

  let extra_total = EXTRA_PRICES[data.extras_cover] * adults;
  let family_fee = data.cover_type === "family" ? 30 : 0;

  let hospital_total = a1_cost + a2_cost;
  let monthly_premium = hospital_total + extra_total + family_fee;
  let yearly_before_discount = monthly_premium * 12;

  let yearly_after_discount = yearly_before_discount;
  if (data.payment_frequency === "yearly") {
    let discount = (data.annual_discount || 0) / 100;
    yearly_after_discount = yearly_before_discount * (1 - discount);
  }

  return {
    monthly_premium: parseFloat(monthly_premium.toFixed(2)),
    yearly_before_discount: parseFloat(yearly_before_discount.toFixed(2)),
    yearly_after_discount: parseFloat(yearly_after_discount.toFixed(2)),
    hospital_total: parseFloat(hospital_total.toFixed(2)),
    extras_total: parseFloat(extra_total.toFixed(2)),
    family_fee: family_fee,
    applicant1_lhc: lhc1,
    applicant2_lhc: lhc2,
  };
}

exports.cal_quote = cal_quote;

// test code
// const data = {
//   "customer_name": "test-user",
//   "cover_type": "family",
//   "applicant1_age": 40,
//   "applicant1_cover_history": "no",
//   "applicant2_age": 35,
//   "applicant2_cover_history": "yes",
//   "hospital_cover": "silver",
//   "extras_cover": "standard",
//   "payment_frequency": "yearly",
//   "annual_discount": 5
// };

// console.log(cal_quote(data));
