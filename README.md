# Mailing List Application

A Node.js + MongoDB mailing list application with a web interface for managing contacts and sending bulk emails.

## Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Docker)
- **Frontend**: Vanilla JavaScript + Bootstrap 5
- **Email**: Nodemailer
- **Build**: Make

## Installation

1. **Clone and install dependencies**:
   ```bash
   cd spamer
   make install
   ```

2. **Configure environment variables**:
   - Copy `.env.example` to `.env` and update SMTP settings
   - Edit `.env` with your email provider credentials (Gmail, SendGrid, etc.)

3. **Start MongoDB**:
   ```bash
   make db-up
   ```

4. **Run the application**:
   ```bash
   make dev
   ```
