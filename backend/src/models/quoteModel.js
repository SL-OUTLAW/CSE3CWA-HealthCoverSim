// CREATE - create a new quote row
function createQuote(db, quoteData, calculatedQuote) {
  return new Promise((resolve, reject) => {
    sql = `
            INSERT INTO quotes (
                customer_name, cover_type, applicant1_age, applicant1_cover_history,
                applicant2_age, applicant2_cover_history, hospital_cover, extras_cover,
                payment_frequency, annual_discount, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    params = [
      quoteData.customer_name,
      quoteData.cover_type,
      quoteData.applicant1_age,
      quoteData.applicant1_cover_history,
      quoteData.applicant2_age || null,
      quoteData.applicant2_cover_history || null,
      quoteData.hospital_cover,
      quoteData.extras_cover,
      quoteData.payment_frequency,
      quoteData.annual_discount || 0,
      quoteData.notes || null,
    ];

    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, ...calculatedQuote });
    });
  });
}

// READ ALL - read all quotes
function getAllQuotes(db) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM quotes ORDER BY created_at DESC", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// READ 1 - read single quote by ID
function getQuoteById(db, id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM quotes WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// UPDATE - edit quote
function updateQuote(db, id, quoteData, calculatedQuote) {
  return new Promise((resolve, reject) => {
    const sql = `
            UPDATE quotes SET
                customer_name = ?, cover_type = ?, applicant1_age = ?,
                applicant1_cover_history = ?, applicant2_age = ?,
                applicant2_cover_history = ?, hospital_cover = ?,
                extras_cover = ?, payment_frequency = ?,
                annual_discount = ?, notes = ?
            WHERE id = ?
        `;
    const params = [
      quoteData.customer_name,
      quoteData.cover_type,
      quoteData.applicant1_age,
      quoteData.applicant1_cover_history,
      quoteData.applicant2_age || null,
      quoteData.applicant2_cover_history || null,
      quoteData.hospital_cover,
      quoteData.extras_cover,
      quoteData.payment_frequency,
      quoteData.annual_discount || 0,
      quoteData.notes || null,
      id,
    ];

    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: id, ...calculatedQuote });
    });
  });
}

// DELETE - remove quote
function deleteQuote(db, id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM quotes WHERE id = ?", [id], function (err) {
      if (err) {
        reject(err);
      }
      // 0 rows changed = 0 deleted
      else if (this.changes === 0) {
        reject(new Error(`Quote ${id} not found`));
      } else resolve({ deleted: true });
    });
  });
}

module.exports = {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
};
