# Klarisana Contact Form

A contact form for Klarisana that submits data to a Supabase database.

## Setup

1. Clone this repository
2. Copy `config.example.json` to `config.json`
3. Update `config.json` with your Supabase credentials:
   - Replace `YOUR_SUPABASE_PROJECT_URL` with your Supabase project URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your Supabase anonymous key
4. Open `index.html` in your browser
5. Fill out the form to submit data to the Supabase database

## Files

- `index.html` - The main form page
- `styles.css` - Styling for the form
- `app.js` - JavaScript for form handling and Supabase integration
- `config.json` - Configuration file with Supabase credentials (not tracked in git)
- `config.example.json` - Example configuration file template

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Supabase for database

## Security Note

The `config.json` file containing Supabase credentials is not tracked in git for security reasons. Make sure to keep your credentials secure and never commit them to version control. 