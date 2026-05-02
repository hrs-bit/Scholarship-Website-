# ScholarPath

A scholarship discovery portal for Indian students. Browse 25 categorized scholarships, filter by type and difficulty, and register for alerts — secured with Google OAuth and Supabase.

## Live Features

- **25 scholarships** scraped from Buddy4Study and NSP, covering government, merit-based, need-based, gender-based, state-based, and skill-based categories
- **Dual filter system** — filter by scholarship type (category) and difficulty level (Easy / Moderate / Competitive)
- **Full-text search** across scholarship name, provider, and eligibility
- **Deadline urgency indicators** — cards highlight scholarships expiring within 7 days
- **Register for Alerts page** (`/register`) — Google OAuth sign-in via Supabase Auth, form pre-fills name and email from Google profile
- **Supabase database** — registration data saved to `student_details` table with server-side constraints
- **Secure credentials** — API keys stored in `.env`, never committed to git

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React | 18.3.1 |
| Build tool | Vite | 6.0.5 |
| Styling | Tailwind CSS | 3.4.17 |
| Routing | React Router DOM | 6.28.0 |
| Backend / Auth / DB | Supabase JS | 2.47.10 |

## Project Structure

```
scholarship/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx        # Scholarship listing, search, filters
│   │   └── RegisterPage.jsx    # Google OAuth + registration form
│   ├── components/
│   │   ├── ScholarshipCard.jsx # Card with category badge, difficulty, deadline
│   │   └── RegistrationForm.jsx# Form with validation, Supabase insert
│   ├── lib/
│   │   └── supabase.js         # Supabase client (reads from .env)
│   ├── App.jsx                 # React Router setup
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind + custom utilities
├── scholarships.json           # 25 scholarships with category + difficulty fields
├── .env.example                # Environment variable template
├── .gitignore                  # Blocks .env, node_modules, dist
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Setup

**1. Clone and install**
```bash
git clone https://github.com/hrs-bit/Scholarship-Website-.git
cd Scholarship-Website-
npm install
```

**2. Configure environment**
```bash
cp .env.example .env
```
Edit `.env` and fill in your Supabase project URL and anon key:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**3. Create the Supabase table**

Run the following in your Supabase project → SQL Editor:
```sql
CREATE TABLE student_details (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  email text,
  gpa numeric,
  interests text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT chk_name_length CHECK (char_length(trim(name)) >= 2),
  CONSTRAINT chk_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  CONSTRAINT chk_gpa_range CHECK (gpa >= 0 AND gpa <= 10),
  CONSTRAINT chk_interests_length CHECK (char_length(trim(interests)) >= 10)
);

ALTER TABLE student_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts"
  ON student_details FOR INSERT TO anon WITH CHECK (true);
```

**4. Enable Google OAuth in Supabase**

Supabase Dashboard → Authentication → Providers → Google → enable and add your OAuth credentials.

**5. Run the dev server**
```bash
npm run dev
```
App runs at `http://localhost:5173`

## Routes

| Path | Page |
|---|---|
| `/` | Home — scholarship listing with search and filters |
| `/register` | Register for alerts — Google OAuth + form |

## Scholarship Data

`scholarships.json` contains 25 scholarships with these fields:

| Field | Description |
|---|---|
| `name` | Scholarship title |
| `provider` | Issuing organization |
| `amount` | Award value |
| `eligibility` | Target student criteria |
| `last_date` | Application deadline |
| `category` | Type: `government`, `merit-based`, `need-based`, `gender-based`, `state-based`, `skill-based` |
| `difficulty` | `easy`, `moderate`, or `competitive` |
| `link` | Direct application URL |

## Security

- Supabase JS SDK sends all queries as parameterized statements — no raw SQL string interpolation
- Server-side `CHECK` constraints on `student_details` enforce validation at the database level, independent of the frontend
- `.env` is gitignored; `.env.example` is committed as a safe template
- Auto-delete rule: data older than 30 days is removed nightly via `pg_cron`
