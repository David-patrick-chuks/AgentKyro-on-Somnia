# AgentKyro Backend API

A comprehensive Node.js + TypeScript + Express + Mongoose backend API for the AgentKyro AI-powered crypto swap dApp.

## 🚀 Features

- **User Management**: Wallet-based authentication with Privy integration
- **Contact Management**: Address book with verification and reputation tracking
- **Team & Workspace**: Collaborative transaction management with approval workflows
- **Analytics & Insights**: Comprehensive transaction analytics and AI predictions
- **Advanced Transactions**: Conditional and scheduled transactions
- **Security & Risk**: Risk assessment, scam detection, and transaction validation
- **Sharing & Integration**: QR codes, receipts, social sharing, and email notifications
- **Notifications**: Multi-channel notification system
- **Health & Monitoring**: System health checks and performance metrics

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **Cloudinary** - Image and file management
- **Nodemailer** - Email service
- **QRCode** - QR code generation
- **PDFKit** - PDF generation

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 5.0+
- Cloudinary account
- SMTP email service

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 🔧 Configuration

### Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/agentkyro

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📚 API Documentation

### Authentication
All user-specific endpoints require a `walletAddress` header containing the user's wallet address.

### API Endpoints

#### User Management
- `POST /api/user/create-or-update` - Create or update user profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

#### Contact Management
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Add new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `GET /api/contacts/groups` - Get contact groups
- `POST /api/contacts/verify` - Verify address reputation
- `GET /api/contacts/suggestions` - Get contact suggestions

#### Team & Workspace
- `GET /api/teams` - Get user's teams
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/members` - Add team member
- `DELETE /api/teams/:id/members/:memberId` - Remove team member
- `POST /api/teams/:id/transactions` - Create team transaction
- `GET /api/teams/:id/approvals` - Get pending approvals
- `POST /api/teams/:id/approvals/:approvalId` - Approve/reject transaction

#### Analytics & Insights
- `GET /api/analytics/dashboard` - Get analytics dashboard
- `GET /api/analytics/spending-patterns` - Analyze spending patterns
- `GET /api/analytics/portfolio-tracking` - Track portfolio performance
- `GET /api/analytics/transaction-history` - Search transaction history
- `GET /api/analytics/predictions` - Get AI predictions

#### Advanced Transactions
- `POST /api/transactions/conditional` - Create conditional transaction
- `GET /api/transactions/conditional` - Get conditional transactions
- `DELETE /api/transactions/conditional/:id` - Cancel conditional transaction
- `POST /api/transactions/scheduled` - Schedule transaction
- `GET /api/transactions/scheduled` - Get scheduled transactions
- `PUT /api/transactions/scheduled/:id` - Update scheduled transaction
- `DELETE /api/transactions/scheduled/:id` - Cancel scheduled transaction

#### Security & Risk
- `POST /api/security/risk-assessment` - Assess transaction risk
- `GET /api/security/address-reputation/:address` - Get address reputation
- `POST /api/security/scam-detection` - Detect scam attempts
- `POST /api/security/transaction-validation` - Validate transaction

#### Sharing & Integration
- `POST /api/sharing/generate-qr` - Generate QR code
- `POST /api/sharing/generate-receipt` - Generate receipt
- `POST /api/sharing/social-share` - Create social share
- `POST /api/integration/send-email` - Send email notification

#### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications/mark-read` - Mark notifications as read
- `POST /api/notifications/subscribe` - Subscribe to notifications
- `GET /api/notifications/subscriptions` - Get subscriptions
- `DELETE /api/notifications/subscriptions/:id` - Unsubscribe

#### Health & Monitoring
- `GET /api/health` - System health check
- `GET /api/metrics` - Performance metrics

## 🗄 Database Schema

### Core Models
- **User** - User profiles and preferences
- **Contact** - Address book entries
- **Team** - Team workspaces
- **Transaction** - Transaction records
- **ConditionalTransaction** - Conditional transactions
- **ScheduledTransaction** - Scheduled transactions
- **TeamTransaction** - Team transactions
- **Notification** - User notifications
- **NotificationSubscription** - Notification preferences

## 🔒 Security Features

- Rate limiting
- Input validation
- Wallet address verification
- Risk assessment
- Scam detection
- Transaction validation
- CORS protection
- Helmet security headers

## 📊 Monitoring

- Health check endpoints
- Performance metrics
- Error logging
- Request logging
- Database monitoring

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, email support@agentkyro.com or create an issue on GitHub.

---

**AgentKyro Backend** - Powering the future of AI-driven crypto transactions 🚀
