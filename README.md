# AgentKyro

**AgentKyro** is an AI-powered crypto transaction and automation dApp built for the Somnia Testnet.
It provides a natural-language and voice-enabled interface for token swaps, payments, scheduling, analytics, and smart contact management — all powered by AI and blockchain automation.

## 🚀 Features

### Core Features
- **Chat-based UI** for token swaps
- **Natural language and voice command support**
- **Wallet connection and authentication** via Privy
- **Transaction confirmation and feedback**
- **Responsive design** for desktop and mobile
- **Error handling** for offline/unsupported browsers
- **Local chat history** and sidebar navigation

### Analytics & Insights
- **Analytics Dashboard**: "Show transaction analytics"
- **Spending Patterns**: "You spent 200 STT this month"
- **Portfolio Tracking**: "Your STT holdings increased 15%"
- **Transaction History Search**: "Show all payments to Alice"
- **Transaction Predictions**: "You usually send 50 STT to Alice on Fridays"

### Contact Management
- **Contact Management**: Save frequent recipients as "Alice", "Bob", etc.
- **Smart Contact Suggestions**: "Add this address as 'Alice' for future use"
- **Contact Groups**: "Send 10 STT to all 'Family' contacts"
- **Contact Verification**: "Verify Alice's address before saving"

### Team & Workspace
- **Team Creation**: Create teams with multiple members
- **Group Transactions**: "Send 10 STT to each person in my team"
- **Approval Workflows**: "Require 2 approvals for >100 STT"

### Advanced Transactions
- **Conditional Payments**: "Pay Bob 50 STT if STT price > $0.01"
- **Schedule or Time-Locked Transactions**: "Send 100 STT to Alice in 24 hours"
- **Quick Actions**: "Send 50 STT to Alice" (one-click)

### Security & Risk
- **Risk Assessment**: "This address has suspicious activity"
- **Address Reputation**: "This address has 100+ successful transactions"
- **Scam Detection**: "Warning: This looks like a phishing attempt"
- **Transaction Validation**: "Double-check this amount before sending"

### Sharing & Integration
- **Transaction Sharing**: Share transaction details via QR codes
- **Social Sharing**: "Share transaction on social media"
- **Transaction Proofs**: "Generate payment receipt"
- **Email Integration**: "Send receipt to email"

### User Experience
- **Multi-Language UI**: Support for 10+ languages in settings
- **Offline Mode**: Queue transactions when offline
- **PWA Features**: Install as native app
- **Smart Suggestions**
- **Contextual Help**: "Try saying 'Send 50 STT to Alice'"
- **Auto-complete**: "Complete your sentence..."
- **Recent Transactions**: "Repeat last transaction?"

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **Privy** - Wallet authentication
- **Somnia testnet** - Blockchain network
- **Radix UI, Sonner, Framer Motion** - UI components
- **Google Gemini AI** - Natural language processing
- **Ethers.js** - Blockchain interactions

### Backend
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web application framework
- **Mongoose** - MongoDB object data modeling
- **MongoDB** - NoSQL database
- **Cloudinary** - Cloud-based image and video management
- **Nodemailer** - Email sending
- **PDFKit** - PDF generation
- **QRCode** - QR code generation

## 📦 Installation

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Environment Variables
Create `.env.local` in the frontend directory:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

Create `.env` in the backend directory:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agentkyro
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=your_email_host
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_pass
CORS_ORIGIN=http://localhost:3000
```

## 🎯 How to Use

1. **Connect your wallet** using the button in the top right
2. **Type or speak a command** (e.g., "Send 50 STT to Alice")
3. **Confirm the transaction details** and submit
4. **View transaction status** and history in the sidebar

### Example Commands
- "Send 50 STT to Alice"
- "Transfer 100 tokens to 0x123..."
- "Pay Bob 25 STT"
- "Show my balance"
- "Send 10 STT to all 'Family' contacts"

## 🏗 Project Structure

```
AgentKyro/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/       # React components
│   │   ├── lib/            # Utilities and configurations
│   │   └── hooks/          # Custom React hooks
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── middleware/     # Express middleware
│   │   └── config/         # Database and service configs
│   └── package.json
└── README.md
```

## 🎥 Demo Video

Watch a full demo here: [Loom Demo Video](https://www.loom.com/share/aabf4d44adc94fcfb8c1ebf3d33d5044?sid=2294e122-09e7-437d-8c05-d95cc3b590a9)

## 🏆 For Judges

- The app is **fully functional** on desktop and mobile
- **Voice input works** in all modern browsers
- All **edge cases** (offline, unsupported browser) are handled gracefully
- **Complete backend API** with 50+ endpoints for all features
- **Database schemas** for users, contacts, teams, transactions, and more
- **Real-time notifications** and subscription management
- **Advanced security** features and risk assessment
- Please refer to the [Demo Video](https://www.loom.com/share/aabf4d44adc94fcfb8c1ebf3d33d5044?sid=2294e122-09e7-437d-8c05-d95cc3b590a9) for a walkthrough

## 🔗 API Endpoints

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/preferences` - Get user preferences

### Contact Management
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Add new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `POST /api/contacts/verify` - Verify contact address
- `POST /api/contacts/groups` - Create contact group
- `GET /api/contacts/groups` - Get contact groups

### Team & Workspace
- `POST /api/teams` - Create team
- `GET /api/teams` - Get user teams
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/members` - Add team member
- `DELETE /api/teams/:id/members/:memberId` - Remove team member
- `POST /api/teams/:id/approvals` - Create approval workflow
- `POST /api/teams/:id/approvals/:id/approve` - Approve transaction

### Analytics & Insights
- `GET /api/analytics/dashboard` - Get analytics dashboard
- `GET /api/analytics/spending-patterns` - Get spending patterns
- `GET /api/analytics/portfolio` - Get portfolio tracking
- `GET /api/analytics/transactions` - Get transaction history
- `GET /api/analytics/predictions` - Get transaction predictions

### Advanced Transactions
- `POST /api/transactions/conditional` - Create conditional payment
- `POST /api/transactions/scheduled` - Create scheduled transaction
- `GET /api/transactions/scheduled` - Get scheduled transactions
- `PUT /api/transactions/scheduled/:id` - Update scheduled transaction
- `DELETE /api/transactions/scheduled/:id` - Cancel scheduled transaction
- `POST /api/transactions/team` - Create team transaction
- `POST /api/transactions/queue` - Queue offline transaction

### Security & Risk
- `POST /api/security/risk-assessment` - Assess transaction risk
- `GET /api/security/address-reputation/:address` - Get address reputation
- `POST /api/security/scam-detection` - Detect potential scams
- `POST /api/security/validate-transaction` - Validate transaction

### Sharing & Integration
- `POST /api/sharing/generate-qr` - Generate QR code for transaction
- `POST /api/sharing/generate-receipt` - Generate transaction receipt
- `POST /api/sharing/social-share` - Create social media share
- `POST /api/sharing/send-email` - Send email notification

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/mark-read` - Mark notification as read
- `POST /api/notifications/subscribe` - Subscribe to notification type
- `DELETE /api/notifications/unsubscribe` - Unsubscribe from notification
- `GET /api/notifications/subscriptions` - Get notification subscriptions

### Health & Monitoring
- `GET /api/health` - Health check endpoint
- `GET /api/health/metrics` - Performance metrics

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions, reach out via GitHub Issues or the hackathon Discord.

---

**AgentKyro** - Powering the future of AI-driven crypto transactions 🚀

Built for the **Somnia AI Hackathon 2025**
