# HealthCoverSim

> A full-stack web application that simulates a private health insurance quote system. Built for La Trobe University's CSE3CWA Cloud-Based Web Application course.

## Overview

HealthCoverSim allows users to create, view, edit, and delete health insurance quote records. The application calculates estimated monthly and yearly premiums based on:

- Cover type (Single / Couple / Family)
- Hospital and Extras cover tiers
- Applicant ages and hospital cover history
- Lifetime Health Cover (LHC) loading
- Family upgrade fee ($30/month)
- Annual-payment discount (0–10%)

**Disclaimer**: This is a simulator only. It is not financial advice and does not match any real insurer's pricing.

---

## Tech stack

| Layer    | Technology        |
| -------- | ----------------- |
| Frontend | React + Vite      |
| Backend  | Node.js + Express |
| Database | SQLite            |
| Styling  | CSS               |

---

## Project structure

```
CSE3CWA-HealthCoverSim/
├── backend/
│ ├── db/
│ │ ├── init.sql # Database schema
│ │ └── healthcover.db # SQLite database (auto-generated)
│ ├── src/
│ │ ├── middleware/
│ │ │ └── validator.js # Request validation
│ │ ├── models/
│ │ │ └── quoteModel.js # Database operations
│ │ ├── routes/
│ │ │ └── quotes.js # API endpoints
│ │ ├── utils/
│ │ │ └── calculator.js # Premium calculation logic
│ │ └── server.js # Express server entry point
│ ├── package.json
│ └── .gitignore
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── HomePage.jsx # Landing page
│ │ │ ├── QuoteList.jsx # List all quotes
│ │ │ ├── QuoteForm.jsx # Create/Edit form
│ │ │ ├── QuoteDetail.jsx # Single quote view
│ │ │ └── QuoteSummary.jsx # Premium breakdown display
│ │ ├── services/
│ │ │ └── api.js # Axios API client
│ │ ├── styles/
│ │ │ └── main.css # Global styles
│ │ ├── App.jsx # Main app with routing
│ │ └── main.jsx # Entry point
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
├── .gitignore
└── README.md

```

---

## How to install and run the project

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm (comes with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/SL-OUTLAW/CSE3CWA-HealthCoverSim.git
cd CSE3CWA-HealthCoverSim
```

### 2. Set up and run the backend

```bash
cd backend
npm install
cd src
node server.js
```

> The API runs on `http://localhost:5678`.

### 3. Set up and run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will open at `http://localhost:5173/`.

---

## How the database is created and initialised

The SQLite database is set up via `init.sql` `(./backend/db/init.sql)`.

- On first run, the backend creates (or connects to) a local SQLite file and creates the `quotes` table if it doesn't already exist.
- The `quotes` table stores:`id, customer_name, cover_type, applicant1_age, applicant1_cover_history, applicant2_age, applicant2_cover_history, hospital_cover, extras_cover, payment_frequency, annual_discount, notes, created_at`.
- `applicant2_age` and `applicant2_cover_history` are `NULL` for Single cover - the backend checks for these nulls before using them in a calculation.
- No manual setup is required beyond `npm install` - the schema is created automatically the first time the backend starts.

> Sample SQLite Database `(healthcover.db)` is provided.  
> **In order to reset the SQLite Database, delete the existing healthcover.db**.

---

## How the quote calculation works

Each quote is calculated from the raw inputs at display time (not pre-computed and stored), so all pricing logic lives in one place on the backend.

**1. Base prices** (per adult, per month):

| Hospital tier | Price | Extras tier | Price |
| ------------- | ----- | ----------- | ----- |
| None          | $0    | None        | $0    |
| Basic         | $90   | Basic       | $25   |
| Bronze        | $120  | Standard    | $45   |
| Silver        | $160  | Premium     | $70   |
| Gold          | $220  |             |       |

**2. Lifetime Health Cover (LHC) loading** - applied to hospital cover only, per applicant:

- Prior cover : **Yes** -> 0% loading
- Prior cover : **No** -> `(age − 30) x 2%`, only if **age > 30 and hospital cover ≠ None** (otherwise 0%)
- Prior cover : **Not sure** -> 0% loading applied, but a warning is shown that the quote may be inaccurate

> _" LHC loading has not been applied. This quote may be inaccurate."_

**3. Totals:**

```
hospital (per adult) = tier price x (1 + that adult's LHC loading)

hospital total = sum across adults (1 for Single, 2 for Couple/Family)

extras total = extras tier price x adult count

monthly premium = hospital total + extras total + family fee

yearly premium = monthly premium x 12

yearly after discount = yearly before x (1 − annual discount)   (Yearly payment only)
```

Monthly payers see the Monthly premium `(monthly_premium)` and the Yearly premium `(yearly_before_discount)` figures; the annual-payment discount is only applied for Yearly payment.

**Worked example** (used to verify the logic, already in provided Database): Family cover, Applicant 1 age 40/no prior cover, Applicant 2 age 35/prior cover, Silver hospital, Standard extras, Yearly with 5% discount -> **$472.00/month**, **$5,664.00/year before discount**, **$5,380.80/year after discount**.

---

## How Family cover is calculated

- Family cover counts **2 adults** for pricing purposes - children are not priced individually and their ages are not collected.
- A flat **$30/month family upgrade fee** is added automatically on top of the hospital and extras totals; the user does not enter this fee.
- Each of the two adults on a Family policy has their own age, cover history, and LHC loading calculated independently (the same way Couple cover is calculated), before the family fee is added once at the end.

---

## Validation

**Frontend validation** blocks quote calculation when:

- Customer name is missing or invalid (text only)
- Ages are missing or outside 18–100
- Annual discount is outside 0–10%

**Backend validation** re-checks all of the above independently (so invalid data sent directly to the API doesn't crash the server or silently produce a misleading quote).

---

## AI use statement

- **Tool used:** Claude (Anthropic)

- **What it helped with:** Scaffolding the Backend and Frontend folder structure, working through the pricing and LHC loading logic against the worked example in the assignment brief, drafting this README and Regex pattern for validation. <small><small><small>**Regex is hard T_T**</small></small></small>

- **What I personally checked/implemented:** I implemented and tested the Express API routes and SQLite queries myself, verified the calculation logic against the worked example by hand before wiring it into the UI and Frontend HTML and CSS Styling - including all the errors and bugs.

---

## Limitations

- The LHC loading model is simplified - the real Australian scheme caps the maximum loading and removes it after 10 years of continuous cover; this simulator applies an uncapped `(age − 30) x 2%` with no expiry.

---
###### **_OUTLAW_**