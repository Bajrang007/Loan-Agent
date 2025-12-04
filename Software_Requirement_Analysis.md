# CHAPTER 2: SOFTWARE REQUIREMENT AND ANALYSIS

This chapter provides a comprehensive definition and exploration of the requirements for the proposed **CreditNow AI-Powered Customer Support System**. It serves as a foundational document detailing the precise capabilities the system must possess, the quality standards it must meet, and the context within which it will operate. We will delve into the core functionalities expected by users (functional requirements), the crucial quality attributes and operational constraints that define how the system performs (non-functional requirements), a rigorous evaluation of the project's practicality (feasibility analysis), a breakdown of the system's architecture into manageable components (modules description), and illustrative examples of user interactions to clarify system behavior (use case analysis). This detailed analysis ensures a clear understanding among stakeholders and guides the subsequent design and development phases.

## 2.1 REQUIREMENT ANALYSIS

Requirement analysis is the cornerstone of successful software development. It is the systematic process of discovering, analyzing, documenting, and validating the needs and conditions that the CreditNow AI-Powered Customer Support System must meet. This involves not only understanding what the system should do from a user's perspective but also defining the constraints under which it must operate, the quality attributes it must exhibit, and the external interfaces it must interact with. Effective requirement analysis bridges the gap between user expectations and the final technical implementation, minimizing ambiguity and ensuring the delivered system effectively solves the intended problem.

### 2.1.1 FUNCTIONAL REQUIREMENTS

Functional requirements define the specific behaviors, actions, tasks, and services the CreditNow AI-Powered Customer Support System must perform. They represent the core utility and value proposition offered to the end-user, dictating what the system must fundamentally be able to do.

#### User Authentication and Account Management

**Secure User Registration**
- The system must offer a robust and secure mechanism for new users to create an account
- This process involves collecting essential credentials such as name, valid email address, phone number, and a strong password
- Password must be securely hashed using bcrypt before storage
- The registration process must validate email uniqueness and provide clear feedback to the user
- User data must be stored in the MySQL database with proper constraints

**Secure User Login**
- Registered users must be able to securely authenticate themselves using email and password
- The system must verify credentials against stored hashed passwords in the database
- Upon successful authentication, the system generates a JWT (JSON Web Token) for session management
- The JWT must contain user identity information (user ID, role) and be signed with a secret key
- Failed login attempts must return appropriate error messages without revealing whether the email exists

**Session Management and Logout**
- The system must implement JWT-based session management to maintain user state across requests
- Tokens must have appropriate expiration times to balance security and user convenience
- The backend must validate JWT tokens on protected API endpoints using authentication middleware
- Users must be able to securely logout, invalidating their current session
- The system must support role-based access control (USER and ADMIN roles)

#### User Profile Management

**Profile Creation and Updates**
- Users must have the capability to update their profile information including name, phone number, date of birth, and address
- The system must validate phone number uniqueness across all users
- Profile updates must be reflected immediately in the database
- The interface must provide clear feedback on successful updates or validation errors

**Persistent Storage**
- All user profile information must be stored reliably in the MySQL database
- The system must maintain data integrity through proper foreign key relationships
- User data must be retained across sessions and accessible whenever the user logs in

#### Document Management

**Document Upload and Storage**
- Users must be able to upload required documents (Aadhaar, PAN, Income Proof, etc.) for loan applications
- The system must support common document formats (PDF, JPG, PNG)
- Uploaded documents must be stored securely with unique identifiers
- Each document must be associated with the uploading user and have a verification status (PENDING, VERIFIED, REJECTED)

**Document Verification Workflow**
- Admin users must be able to view and verify uploaded documents
- The system must track document status changes and maintain an audit trail
- Users must be notified of document verification status updates

#### Loan Product Management

**Loan Product Catalog**
- The system must maintain a catalog of available loan products with details including:
  - Product title and description
  - Interest rate (stored as Decimal for precision)
  - Minimum and maximum loan amounts
  - Tenure in months
- Loan products must be retrievable by users and the AI agent

**Product Information Retrieval**
- Users must be able to browse available loan products through the web interface
- The AI chatbot must be able to query and present loan product information
- Product details must include all relevant terms and conditions

#### Loan Application Processing

**Loan Application Submission**
- Authenticated users must be able to apply for loans by selecting:
  - Loan product type
  - Desired loan amount
  - Preferred tenure (in months)
- The system must validate that the requested amount falls within the product's min/max limits
- Upon submission, the system must create a LoanApplication record with status PENDING
- The application must capture the applicable interest rate at the time of application

**Application Status Tracking**
- Users must be able to view the status of their loan applications (PENDING, APPROVED, REJECTED, DISBURSED, CLOSED)
- The system must maintain timestamps for application submission and updates
- Status changes must be logged with admin action records

**Loan Approval Workflow**
- Admin users must be able to review pending loan applications
- Admins can approve or reject applications with optional notes
- Upon approval, the system must generate a repayment schedule
- The system must support loan disbursement tracking

#### Repayment Management

**EMI Schedule Generation**
- Upon loan approval and disbursement, the system must automatically generate a repayment schedule
- Each repayment record must include:
  - Due date
  - Amount due (EMI amount)
  - Payment status (PENDING, PAID, LATE)
- The schedule must be calculated based on loan amount, interest rate, and tenure

**EMI Payment Processing**
- Users must be able to view their upcoming and past EMI payments
- The system must support multiple payment methods (CARD, UPI, NETBANKING)
- Payment transactions must be recorded with transaction IDs and timestamps
- Upon successful payment, the repayment status must update to PAID

**Payment Link Generation**
- The AI agent must be able to generate secure payment links for users
- Payment links must include the customer ID and amount due
- Links must have an expiration time (typically 30 minutes)
- The system must validate payment link authenticity before processing payments

#### AI-Powered Customer Support

**Natural Language Query Processing**
- The system must provide an AI chatbot (TIA - The Intelligent Assistant) accessible through the web interface
- The chatbot must understand and respond to natural language queries in English and Hindi
- The AI must maintain conversation context across multiple interactions within a session
- The system must use Google's Gemini 2.0 Flash model for natural language understanding

**Loan Calculation Tool**
- The AI agent must be able to calculate monthly EMI payments based on:
  - Loan amount
  - Tenure in months
  - Interest rate
- Calculations must return monthly payment, total payment, and total interest
- Results must be presented in a user-friendly format

**Eligibility Checking**
- The AI agent must be able to check user eligibility for loans
- Eligibility checks must verify user authentication status
- The system must return eligibility status and maximum loan amount (if eligible)

**Customer Loan Retrieval**
- The AI agent must fetch and present active loans for authenticated users
- Loan details must include loan type, principal amount, outstanding amount, EMI amount, and status
- The agent must parse and present this information in natural, conversational language
- The system must handle cases where users have multiple active loans

**EMI Details Lookup**
- The AI agent must retrieve next EMI date and amount for specific loans
- When users have multiple loans, the agent must ask for clarification
- The system must highlight overdue payments if the due date has passed

**Account Statement Generation**
- Users must be able to request account statements through the AI agent
- The system must support date range filtering (with defaults to last 3 months)
- Statements must be generated as PDF documents
- The agent must provide download links for generated statements

**Support Ticket Creation**
- The AI agent must detect user frustration or explicit requests for human support
- The system must create support tickets with:
  - Issue summary
  - Category classification
  - Unique ticket ID
  - SLA (Service Level Agreement) timeline
- Users must receive ticket confirmation with expected response time

**Notification Scheduling**
- The AI agent must be able to schedule reminders for users
- Reminders can be sent via multiple channels (WhatsApp, SMS, Email)
- The system must support scheduling at specific times or relative durations
- Confirmation must be provided to users upon successful scheduling

#### Multi-Agent Architecture (Python Backend)

**LangGraph-Based Agent System**
- The system implements a secondary Python-based agent using LangGraph for advanced conversational flows
- The agent must maintain state across conversation turns using memory checkpointing
- The architecture must support conditional routing between chatbot and tool nodes

**Tool Integration**
- The Python agent must have access to specialized tools for:
  - Policy lookup (company policies, return policies, shipping information)
  - Order status lookup
- Tools must be implemented as LangChain-compatible functions
- The system must gracefully handle tool execution errors

**Conversation Memory**
- The agent must maintain conversation history within a session
- Memory must be persisted using LangGraph's MemorySaver
- Each conversation thread must have a unique identifier

### 2.1.2 NON-FUNCTIONAL REQUIREMENTS

Non-functional requirements define the qualities, constraints, and standards that the CreditNow AI-Powered Customer Support System must adhere to, beyond its specific features. They describe how the system should perform its functions, focusing on aspects like performance, usability, reliability, security, and maintainability.

#### Performance and Responsiveness

**UI Responsiveness**
- The Next.js application must feel fluid and highly responsive
- User actions (clicks, form submissions) must result in immediate visual feedback
- Page transitions must be smooth with loading indicators where appropriate
- The system must leverage Next.js 15's Turbopack for fast development builds

**API Response Times**
- Standard API endpoints (user profile, loan applications) must respond within 500ms under normal load
- AI agent responses must be generated within 3-5 seconds for typical queries
- Database queries must be optimized with proper indexing on frequently accessed columns
- The backend Express server must handle concurrent requests efficiently

**AI Model Performance**
- Gemini 2.0 Flash model must provide responses within acceptable latency
- The system must implement timeout mechanisms for AI API calls (max 10 seconds)
- Fallback responses must be provided if AI service is unavailable
- Token usage must be monitored to stay within API rate limits

**Database Performance**
- MySQL queries must be optimized using Prisma ORM's query optimization features
- Complex joins (loans with repayments and products) must execute within 200ms
- Database connection pooling must be implemented for efficient resource usage
- Indexes must be created on foreign keys and frequently queried fields

#### Usability and User Experience (UX)

**Intuitiveness and Learnability**
- The user interface must be designed with clarity using ShadCN UI components
- Navigation must be intuitive with clear labeling and consistent patterns
- The chatbot interface must be easily accessible via a floating action button
- First-time users should be able to apply for a loan without extensive guidance

**Conversational AI Quality**
- The AI agent must provide helpful, accurate, and contextually relevant responses
- Responses must be polite, professional, and empathetic
- The agent must handle ambiguous queries by asking clarifying questions
- Multilingual support (English and Hindi) must be natural and contextually appropriate

**Responsive Design**
- The application must be fully responsive across desktop, tablet, and mobile devices
- Tailwind CSS must be used for consistent, mobile-first styling
- Forms and interactive elements must be touch-friendly on mobile devices
- The chatbot interface must adapt gracefully to different screen sizes

**Feedback Mechanisms**
- The system must provide clear success messages for completed actions
- Error messages must be informative and guide users toward resolution
- Loading states must be indicated with spinners or progress indicators
- Form validation must provide real-time feedback on input errors

#### Reliability and Availability

**High Availability**
- The system should target 99% uptime for production deployment
- Scheduled maintenance windows must be communicated in advance
- The backend must implement graceful degradation if external services fail

**Data Integrity**
- All financial calculations (EMI, interest) must be precise using Decimal types
- Database transactions must maintain ACID properties
- Foreign key constraints must prevent orphaned records
- Concurrent loan applications must be handled without race conditions

**Error Handling**
- The backend must implement comprehensive try-catch blocks for all critical operations
- AI agent errors must be caught and presented as user-friendly messages
- Database connection failures must be logged and retry mechanisms implemented
- The system must never expose sensitive error details to end users

**Backup and Recovery**
- Database backups must be performed regularly (daily recommended)
- User documents must be backed up to prevent data loss
- The system must support point-in-time recovery for critical data

#### Scalability

**Backend Architecture**
- The Express.js backend must be designed to handle growing user loads
- API endpoints must be stateless to support horizontal scaling
- Database queries must be optimized to prevent performance degradation with data growth
- The system should support load balancing across multiple server instances

**Database Scalability**
- The MySQL schema must be optimized with proper indexing strategies
- Large tables (LoanRepayment, Payment) must be designed with partitioning in mind
- Connection pooling must be configured to handle peak loads
- The system should support read replicas for query-heavy operations

**AI Service Scalability**
- The system must handle API rate limits from Google Gemini
- Request queuing must be implemented if rate limits are approached
- Caching of common AI responses should be considered for frequently asked questions
- The architecture should support switching between AI providers if needed

#### Security

**Authentication and Authorization**
- Passwords must be hashed using bcrypt with appropriate salt rounds (minimum 10)
- JWT tokens must be signed with a strong secret key stored securely in environment variables
- Token expiration must be enforced (recommended: 24 hours for access tokens)
- Role-based access control must restrict admin functions to ADMIN users only

**Data Transmission Security**
- All API communication must occur over HTTPS in production
- JWT tokens must be transmitted securely in Authorization headers
- Sensitive data (passwords, tokens) must never be logged or exposed in responses
- CORS must be properly configured to allow only trusted origins

**Protection Against Web Vulnerabilities**
- Input validation must be implemented on both client and server sides
- SQL injection must be prevented through Prisma's parameterized queries
- XSS attacks must be mitigated through proper output encoding in React
- CSRF protection must be implemented for state-changing operations
- The system must use Helmet.js for security headers

**Data Privacy**
- User personal information must be protected according to data privacy regulations
- Document uploads must be stored securely with access controls
- Loan and financial data must be encrypted at rest
- User data must only be accessible to the authenticated user and authorized admins

**API Security**
- Google API keys must be stored securely in environment variables
- API keys must never be exposed in client-side code
- Rate limiting must be implemented to prevent abuse
- Authentication middleware must validate JWT tokens on all protected routes

#### Maintainability

**Code Quality and Structure**
- TypeScript must be used throughout the Next.js frontend and Node.js backend
- Code must follow consistent formatting and naming conventions
- The project must be organized into logical modules (ai, backend, components, lib)
- ESLint must be configured for code quality enforcement

**Documentation**
- Code must include comments explaining complex business logic
- API endpoints must be documented with expected inputs and outputs
- Database schema must be well-documented through Prisma schema comments
- README files must provide setup and deployment instructions

**Modularity and Design Patterns**
- The AI agent must be separated into distinct modules (agent, tools, context)
- Backend routes must follow RESTful conventions
- Controllers must handle request/response logic separately from business logic
- Reusable UI components must be created using ShadCN UI patterns

**Testing and Quality Assurance**
- Critical business logic (loan calculations, EMI generation) must have unit tests
- API endpoints should have integration tests
- Database operations should be tested with mock data
- The system must include a database testing script for validation

**Version Control and Deployment**
- Git must be used for version control with meaningful commit messages
- Environment-specific configurations must be managed through .env files
- The system must support separate development and production environments
- Database migrations must be managed through Prisma migrate

## 2.2 FEASIBILITY ANALYSIS

A feasibility analysis is a crucial preliminary assessment conducted to determine whether the proposed CreditNow AI-Powered Customer Support System is a practical and worthwhile undertaking. It evaluates the project's viability across several key dimensions: technical, economic, and operational.

### 2.2.1 Technical Feasibility

**Technology Stack Maturity and Availability**
- The selected technology stack comprises mature, well-supported technologies:
  - **Frontend**: Next.js 15 with React 18, TypeScript, Tailwind CSS, ShadCN UI
  - **Backend**: Node.js with Express 5, TypeScript
  - **Database**: MySQL with Prisma ORM
  - **AI/ML**: Google Gemini 2.0 Flash, Genkit, LangGraph, LangChain
  - **Authentication**: JWT-based authentication with bcrypt
- All technologies have extensive documentation, active communities, and proven track records
- The stack represents current industry best practices for full-stack web development

**Team Expertise**
- The project assumes the development team has or can acquire skills in:
  - Modern JavaScript/TypeScript development
  - React and Next.js framework
  - RESTful API design and implementation
  - Relational database design and SQL
  - AI/LLM integration and prompt engineering
- These are standard skills for web development teams and can be learned through available resources

**AI Integration Complexity**
- **Google Gemini Integration**: The Genkit framework provides high-level abstractions for AI integration
- **Tool Calling**: The system implements function calling, which is well-documented in Gemini API
- **LangGraph Architecture**: Provides structured approach to building stateful, multi-step AI agents
- **Prompt Engineering**: Requires iterative refinement but is manageable with clear system instructions
- The AI components leverage existing APIs and frameworks, reducing implementation complexity

**Database and ORM**
- Prisma ORM provides type-safe database access and automatic migration generation
- The schema design follows normalized database principles
- MySQL is a proven, reliable RDBMS suitable for transactional applications
- The database structure supports all required business operations

**External Dependencies**
- **Google Gemini API**: Reliable service with generous free tier and clear pricing
- **Firebase**: Optional integration for additional features
- Dependency on external AI services introduces some risk but is mitigated by:
  - Fallback error handling
  - Ability to switch AI providers if needed
  - Free tier availability for development and testing

**Development Tools**
- Modern development tools are freely available:
  - VS Code or other IDEs
  - Node.js runtime and npm package manager
  - Git for version control
  - Prisma CLI for database management
  - Genkit CLI for AI development and testing

**Conclusion**
Based on the maturity of the technology stack, availability of comprehensive documentation and tools, manageable complexity of AI integration, and proven patterns for similar applications, the CreditNow AI-Powered Customer Support System is deemed **technically feasible**.

### 2.2.2 Economic Feasibility

**Development Costs**
- Primary cost is developer time and effort
- All core development tools are free and open-source:
  - Node.js, TypeScript, React, Next.js
  - Prisma ORM, Express framework
  - VS Code, Git
  - npm package manager
- No licensing fees for development software

**Operational Costs**

*AI API Costs*
- **Google Gemini API**: 
  - Free tier: 15 requests per minute, 1,500 requests per day
  - Paid tier: $0.075 per 1,000 characters for input, $0.30 per 1,000 characters for output
  - For academic/demonstration purposes, free tier is typically sufficient
  - Production deployment would require monitoring and budgeting for API usage

*Database Hosting*
- **Development**: Local MySQL instance (free)
- **Production Options**:
  - PlanetScale: Free tier available, paid plans from $29/month
  - AWS RDS: Free tier for 12 months, then ~$15-50/month
  - Railway: Free tier with limitations, paid from $5/month
  - Supabase: Free tier available

*Application Hosting*
- **Frontend (Next.js)**:
  - Vercel: Free tier for personal projects, generous limits
  - Netlify: Free tier available
  - Railway: Free tier with limitations
- **Backend (Express API)**:
  - Render: Free tier available (with limitations)
  - Railway: Free tier with limitations
  - Heroku: Paid plans from $7/month
  - AWS EC2: Free tier for 12 months

*Document Storage*
- **Development**: Local file system (free)
- **Production**: 
  - AWS S3: Free tier 5GB for 12 months, then ~$0.023 per GB
  - Cloudinary: Free tier 25GB storage
  - Firebase Storage: Free tier 5GB

**Total Estimated Monthly Costs**
- **Development Phase**: $0 (using free tiers and local development)
- **Small-Scale Production** (100-500 users): $0-20/month
- **Medium-Scale Production** (1,000-5,000 users): $50-150/month

**Return on Investment (ROI)**
- **Academic Context**: 
  - Primary ROI is educational value and skill development
  - Portfolio project demonstrating full-stack and AI integration skills
  - Practical experience with modern web technologies
- **Commercial Potential**:
  - Loan processing automation reduces customer support costs
  - 24/7 AI availability improves customer satisfaction
  - Reduced manual workload for common queries
  - Scalable solution that grows with business needs

**Cost-Benefit Analysis**
- Minimal upfront investment required
- Free tiers support development and small-scale deployment
- Costs scale gradually with usage
- High educational and professional development value
- Potential for commercial application with clear business value

**Conclusion**
Given the availability of free development tools, generous free tiers for hosting and AI services, and low operational costs for academic/demonstration purposes, the project is deemed **economically feasible** within typical student/academic budget constraints.

### 2.2.3 Operational Feasibility

**User Need and Acceptance**
- **Problem Addressed**: Manual customer support for loan inquiries is time-consuming and limited to business hours
- **Solution Value**: 
  - 24/7 availability for customer queries
  - Instant responses to common questions
  - Automated loan calculations and eligibility checks
  - Self-service access to loan information and payment details
- **Target Users**: 
  - Loan applicants seeking information and assistance
  - Existing customers managing their loans
  - Customer support staff handling complex cases
- **Acceptance Likelihood**: High, as users increasingly expect instant, AI-powered support

**System Integration Requirements**
- **Frontend-Backend Integration**: Standard REST API communication
- **Database Integration**: Prisma ORM provides seamless TypeScript-to-SQL mapping
- **AI Service Integration**: Well-documented APIs with SDK support
- **Multi-Agent Coordination**: Both TypeScript (Genkit) and Python (LangGraph) agents can coexist
- **Authentication Flow**: JWT-based auth integrates cleanly with both frontend and backend

**Operational Complexity**
- **Deployment**: 
  - Frontend and backend can be deployed independently
  - Database requires initial setup and migration
  - Environment variables must be configured securely
  - Moderate complexity, manageable with proper documentation
- **Monitoring**:
  - API endpoint health monitoring
  - AI service usage and cost tracking
  - Database performance metrics
  - Error logging and alerting
- **Maintenance**:
  - Regular dependency updates
  - Database backup verification
  - AI prompt refinement based on user interactions
  - Security patch application

**Data Management**
- **User Data**: Standard CRUD operations with proper access controls
- **Document Storage**: Requires file upload handling and secure storage
- **Financial Data**: High precision required, handled by Decimal types
- **Conversation Logs**: Optional logging for AI improvement and debugging
- **Backup Procedures**: Regular automated backups of database and documents

**Training and Support**
- **User Training**: Minimal required due to intuitive chatbot interface
- **Admin Training**: Required for loan approval workflow and document verification
- **Developer Handoff**: Comprehensive documentation needed for maintenance
- **AI Prompt Maintenance**: Ongoing refinement based on user feedback

**Scalability Considerations**
- **User Growth**: Architecture supports gradual scaling
- **Data Volume**: Database design accommodates growing transaction history
- **AI Request Volume**: Can be managed through caching and rate limiting
- **Geographic Expansion**: System can be adapted for multiple regions/languages

**Risk Factors and Mitigation**
- **AI Service Dependency**: 
  - Risk: Service outage or pricing changes
  - Mitigation: Fallback responses, error handling, provider flexibility
- **Data Security**:
  - Risk: Breach of sensitive financial data
  - Mitigation: Encryption, access controls, security best practices
- **Regulatory Compliance**:
  - Risk: Non-compliance with financial regulations
  - Mitigation: Proper data handling, audit trails, privacy controls
- **User Adoption**:
  - Risk: Users prefer human support
  - Mitigation: Seamless escalation to human agents, ticket system

**Operational Workflow**
1. **User Registration**: Self-service with email verification
2. **Document Upload**: User-initiated with admin verification
3. **Loan Application**: Guided by AI, submitted for admin approval
4. **Loan Approval**: Admin review with AI-assisted information gathering
5. **Repayment**: Automated schedule generation and payment tracking
6. **Support**: AI-first with human escalation when needed

**Conclusion**
The CreditNow AI-Powered Customer Support System addresses a genuine operational need with a practical solution. The integration requirements are manageable, operational complexity is moderate, and the system provides clear value to both customers and the organization. With proper deployment procedures, monitoring, and maintenance plans, the system is deemed **operationally feasible**.

## 2.3 MODULES DESCRIPTION

The CreditNow AI-Powered Customer Support System is architecturally designed using a modular approach, decomposing the overall system into several distinct logical modules. Each module encapsulates specific functionalities and concerns, promoting better organization, separation of concerns, enhanced maintainability, testability, and potential for independent scaling.

### 2.3.1 Frontend (Client-Side Application)

**Description**
This module represents the user-facing part of the application built with Next.js 15 and React 18. It runs entirely within the user's web browser and is responsible for all user interactions and visual presentation.

**Responsibilities**
- Rendering the graphical user interface using React components
- Managing client-side routing with Next.js App Router
- Capturing and validating user input through forms
- Maintaining UI state and user interaction state
- Communicating with backend APIs via HTTP requests
- Displaying AI chatbot interface with real-time responses
- Handling authentication state and protected routes
- Providing responsive design across all device sizes

**Key Components**
- **Pages/Routes**: 
  - Home/Landing page
  - Login/Registration pages
  - Dashboard (user loan overview)
  - Loan application form
  - Document upload interface
  - Payment/Repayment pages
  - Admin panel (for admin users)
- **UI Components** (ShadCN UI):
  - Form controls (Input, Select, Checkbox, Radio)
  - Layout components (Card, Accordion, Tabs)
  - Feedback components (Toast, Alert, Dialog)
  - Navigation (Menubar, Dropdown)
  - Data display (Table, Avatar, Progress)
- **Chatbot Interface**:
  - Floating action button (FAB) for chat access
  - Chat window with message history
  - Input field for user queries
  - Loading indicators for AI responses
- **State Management**:
  - React Hook Form for form state
  - Context API or Zustand for global state
  - Local state for component-specific data

**Technologies**
- Next.js 15 (React framework with App Router)
- React 18 (UI library)
- TypeScript (type-safe development)
- Tailwind CSS (utility-first styling)
- ShadCN UI (component library)
- Lucide React (icon library)
- React Hook Form (form management)
- Zod (schema validation)
- Embla Carousel (carousel component)

**File Structure**
```
src/
├── app/                    # Next.js App Router pages
│   ├── actions.ts         # Server actions
│   └── ...
├── components/            # Reusable React components
│   └── ui/               # ShadCN UI components
├── hooks/                # Custom React hooks
│   └── use-toast.ts
└── lib/                  # Utility functions
    ├── utils.ts
    └── placeholder-images.ts
```

### 2.3.2 Backend (Server-Side Application / API)

**Description**
This module serves as the central processing hub of the application, built with Node.js and Express. It handles business logic, data processing, authentication, and orchestrates communication between the frontend, database, and external services.

**Responsibilities**
- Providing RESTful API endpoints for frontend consumption
- Authenticating and authorizing user requests via JWT validation
- Implementing business logic for loan processing
- Managing CRUD operations on the database via Prisma
- Generating loan repayment schedules
- Processing payment transactions
- Handling file uploads for documents
- Coordinating with AI services for chatbot functionality
- Logging and error handling
- Enforcing data validation and business rules

**Key Components**

*Controllers*
- **authController**: Handles user registration, login, and authentication
- **loanController**: Manages loan applications, approvals, and retrievals
- **documentController**: Handles document uploads and verification
- **repaymentController**: Manages EMI schedules and payment processing

*Routes*
- **authRoutes**: `/api/auth/register`, `/api/auth/login`
- **loanRoutes**: `/api/loans/apply`, `/api/loans/my-loans`, `/api/loans/:id`
- **documentRoutes**: `/api/documents/upload`, `/api/documents/verify`
- **repaymentRoutes**: `/api/repayments/:loanId`, `/api/repayments/pay`

*Middleware*
- **authMiddleware**: Validates JWT tokens and extracts user information
- **errorHandler**: Centralized error handling and logging
- **validation**: Request payload validation using Zod schemas

*Services*
- **loanService**: Business logic for loan calculations and processing
- **repaymentService**: EMI calculation and schedule generation
- **documentService**: File handling and storage management

**Technologies**
- Node.js (JavaScript runtime)
- Express 5 (web framework)
- TypeScript (type-safe development)
- Prisma (ORM for database access)
- JWT (jsonwebtoken for authentication)
- bcryptjs (password hashing)
- Multer (file upload handling)
- Helmet (security headers)
- CORS (cross-origin resource sharing)
- dotenv (environment variable management)

**File Structure**
```
src/backend/
├── config/
│   └── db.ts              # Database configuration
├── controllers/
│   ├── authController.ts
│   ├── loanController.ts
│   ├── documentController.ts
│   └── repaymentController.ts
├── middlewares/
│   └── authMiddleware.ts
├── routes/
│   ├── authRoutes.ts
│   ├── loanRoutes.ts
│   ├── documentRoutes.ts
│   └── repaymentRoutes.ts
├── server.ts              # Express server setup
├── app.ts                 # App configuration
└── test-databases.ts      # Database testing script
```

### 2.3.3 Database Module

**Description**
This module manages all persistent data storage using MySQL as the relational database management system and Prisma as the ORM layer. It ensures data integrity, consistency, and efficient retrieval.

**Responsibilities**
- Storing user account information and profiles
- Managing loan products catalog
- Tracking loan applications and their status
- Storing document metadata and verification status
- Maintaining repayment schedules and payment history
- Recording admin actions for audit trails
- Enforcing data integrity through constraints and relationships
- Supporting efficient queries through proper indexing
- Managing database migrations and schema evolution

**Key Components**

*Database Tables*
- **User**: Stores user authentication and profile data
- **UserDocument**: Tracks uploaded documents and verification status
- **LoanProduct**: Catalog of available loan products
- **LoanApplication**: Records of loan applications and their status
- **LoanRepayment**: EMI schedule and payment tracking
- **Payment**: Individual payment transaction records
- **AdminAction**: Audit log of administrative actions

*Relationships*
- User → UserDocument (one-to-many)
- User → LoanApplication (one-to-many)
- LoanProduct → LoanApplication (one-to-many)
- LoanApplication → LoanRepayment (one-to-many)
- LoanRepayment → Payment (one-to-many)
- User → AdminAction (one-to-many, as admin)
- LoanApplication → AdminAction (one-to-many)

*Enumerations*
- **Role**: USER, ADMIN
- **DocStatus**: PENDING, VERIFIED, REJECTED
- **LoanStatus**: PENDING, APPROVED, REJECTED, DISBURSED, CLOSED
- **PaymentStatus**: PENDING, PAID, LATE
- **PaymentMethod**: CARD, UPI, NETBANKING
- **AdminActionType**: APPROVE, REJECT, VERIFY_DOCUMENT

**Technologies**
- MySQL (relational database)
- Prisma (ORM and migration tool)
- Prisma Client (type-safe database queries)

**Schema Highlights**
```prisma
model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  passwordHash String
  role         Role      @default(USER)
  documents    UserDocument[]
  loans        LoanApplication[]
}

model LoanApplication {
  id           Int            @id @default(autoincrement())
  userId       Int
  productId    Int
  amount       Decimal
  tenure       Int
  status       LoanStatus     @default(PENDING)
  repayments   LoanRepayment[]
}

model LoanRepayment {
  id            Int           @id @default(autoincrement())
  loanId        Int
  dueDate       DateTime
  amountDue     Decimal
  paymentStatus PaymentStatus @default(PENDING)
  payments      Payment[]
}
```

### 2.3.4 AI Agent Module (TypeScript/Genkit)

**Description**
This module implements the primary AI-powered chatbot using Google's Genkit framework and Gemini 2.0 Flash model. It provides natural language understanding and tool-calling capabilities for customer support.

**Responsibilities**
- Processing natural language queries from users
- Understanding user intent and extracting relevant information
- Calling appropriate tools to fulfill user requests
- Generating human-like, contextually appropriate responses
- Maintaining conversation context within a session
- Handling multilingual queries (English and Hindi)
- Providing loan information, calculations, and assistance
- Escalating to human support when necessary

**Key Components**

*Agent Definition* (`agent.ts`)
- Main agent flow definition using Genkit
- System prompt with detailed instructions
- Tool binding and orchestration
- Context management (customer ID from JWT)

*Tools* (`tools.ts`)
- **calculateLoan**: EMI calculation tool
- **checkEligibility**: Loan eligibility verification
- **getLoanTypes**: Retrieves available loan products
- **applyForLoan**: Submits loan application
- **get_customer_loans**: Fetches user's active loans
- **get_emi_details**: Retrieves next EMI information
- **generate_payment_link**: Creates secure payment URLs
- **schedule_notification**: Sets up reminders
- **get_account_statement**: Generates account statements
- **create_support_ticket**: Creates support tickets for escalation

*Context Management* (`context.ts`)
- Extracts authentication token from request context
- Provides user identity to agent and tools

*Configuration* (`genkit.ts`)
- Genkit initialization
- Google Gemini model configuration
- API key management

**Technologies**
- Genkit (AI framework)
- Google Gemini 2.0 Flash (LLM)
- Zod (schema validation for tools)
- TypeScript (type-safe development)

**Agent Capabilities**
1. **Conversational**: Natural dialogue in English and Hindi
2. **Informational**: Provides loan product details and policies
3. **Computational**: Calculates EMI and eligibility
4. **Transactional**: Initiates loan applications and payments
5. **Retrieval**: Fetches user-specific loan and payment data
6. **Scheduling**: Sets up reminders and notifications
7. **Escalation**: Creates support tickets for complex issues

**File Structure**
```
src/ai/
├── agent.ts      # Main agent definition
├── tools.ts      # Tool implementations
├── context.ts    # Context management
├── genkit.ts     # Genkit configuration
└── dev.ts        # Development entry point
```

### 2.3.5 Secondary AI Agent Module (Python/LangGraph)

**Description**
This module implements an alternative AI agent architecture using Python, LangGraph, and LangChain. It demonstrates a graph-based approach to building stateful conversational agents with tool integration.

**Responsibilities**
- Processing user messages through a stateful graph
- Maintaining conversation history with memory
- Executing tools based on agent decisions
- Providing policy and order lookup capabilities
- Demonstrating alternative AI architecture patterns

**Key Components**

*Graph Definition* (`graph.py`)
- StateGraph configuration with chatbot and tool nodes
- Conditional edges for tool calling
- Memory checkpointing for conversation persistence

*Agent Node* (`nodes.py`)
- Chatbot function using Google Gemini
- Tool binding with LangChain
- Error handling and fallback responses

*State Management* (`state.py`)
- Conversation state definition
- Message history tracking

*Tools* (`tools/search.py`)
- **lookup_policy**: Company policy information retrieval
- **lookup_order**: Order status lookup

*Main Entry* (`main.py`)
- CLI interface for agent interaction
- Conversation loop with thread management

**Technologies**
- Python 3.x
- LangGraph (agent framework)
- LangChain (LLM framework)
- langchain-google-genai (Gemini integration)
- Google Gemini 2.0 Flash Exp (LLM)

**Architecture Pattern**
```
START → chatbot → [tools_condition] → tools → chatbot → ...
                       ↓
                      END
```

**File Structure**
```
customer_support_agent/
├── agent/
│   ├── graph.py      # Graph definition
│   ├── nodes.py      # Agent and tool nodes
│   └── state.py      # State definition
├── tools/
│   └── search.py     # Tool implementations
├── main.py           # CLI entry point
└── requirements.txt  # Python dependencies
```

### 2.3.6 Authentication Module

**Description**
This module handles all aspects of user authentication and authorization, ensuring secure access to the system and protecting user data.

**Responsibilities**
- User registration with password hashing
- User login with credential verification
- JWT token generation and signing
- Token validation and user identification
- Role-based access control
- Session management
- Password security enforcement

**Key Components**

*Authentication Controller*
- Registration endpoint with validation
- Login endpoint with credential verification
- Token generation upon successful authentication

*Authentication Middleware*
- JWT token extraction from headers
- Token verification and validation
- User identity extraction
- Role-based authorization checks

*Security Utilities*
- Password hashing with bcrypt
- JWT signing and verification
- Token expiration management

**Technologies**
- jsonwebtoken (JWT implementation)
- bcryptjs (password hashing)
- Express middleware pattern

**Security Features**
- Passwords hashed with bcrypt (10+ salt rounds)
- JWT tokens with expiration
- Secure token transmission in headers
- Role-based access control (USER, ADMIN)
- Protected routes requiring authentication

### 2.3.7 Document Management Module

**Description**
This module handles the upload, storage, and verification of user documents required for loan applications.

**Responsibilities**
- Accepting document uploads from users
- Storing documents securely
- Tracking document verification status
- Providing admin interface for document review
- Managing document metadata in database

**Key Components**
- Document upload endpoint with Multer
- Document storage (file system or cloud)
- Document verification workflow
- Document retrieval for authorized users

**Technologies**
- Multer (file upload middleware)
- File system or cloud storage (AWS S3, Cloudinary)
- Prisma for metadata storage

**Document Types**
- Aadhaar Card
- PAN Card
- Income Proof
- Address Proof
- Bank Statements

## 2.4 USE CASE ANALYSIS

Use cases provide detailed, step-by-step descriptions of interactions between actors and the CreditNow AI-Powered Customer Support System to achieve specific goals. They are crucial for understanding how the system's functional requirements translate into practical workflows.

**Primary Actors**
- **User**: Loan applicant or existing customer
- **Admin**: System administrator or loan officer
- **AI Agent (TIA)**: The Intelligent Assistant chatbot

### 2.4.1 Register New Account

**Goal**: Allow a prospective user to create a personal account in the CreditNow system.

**Preconditions**: User has access to the application's landing page.

**Typical Flow**:
1. User navigates to the registration page
2. System displays registration form requesting:
   - Full name
   - Email address
   - Phone number (optional)
   - Password
   - Password confirmation
3. User fills in the required information
4. User submits the registration form
5. System validates input:
   - Email format is correct
   - Email is not already registered
   - Phone number is unique (if provided)
   - Password meets security requirements
   - Passwords match
6. System hashes the password using bcrypt
7. System creates new User record in database with role USER
8. System displays success message
9. System redirects user to login page

**Alternative Flow - Email Already Exists**:
- At step 6, system detects email is already registered
- System displays error: "An account with this email already exists"
- User remains on registration form to try different email

**Alternative Flow - Validation Errors**:
- At step 5, system detects validation errors
- System displays specific error messages for each field
- User corrects errors and resubmits

**Postconditions**: 
- New user account created in database
- User can now log in with credentials

### 2.4.2 Login to Existing Account

**Goal**: Allow a registered user to authenticate and access their personalized dashboard.

**Preconditions**: User has a registered account.

**Typical Flow**:
1. User navigates to the login page
2. System displays login form requesting email and password
3. User enters registered email and password
4. User submits the login form
5. System retrieves user record by email
6. System compares submitted password with stored hash using bcrypt
7. Passwords match - authentication successful
8. System generates JWT token containing:
   - User ID
   - User role
   - Expiration time (24 hours)
9. System signs token with secret key
10. System returns token to frontend
11. Frontend stores token (localStorage or cookie)
12. System redirects user to dashboard
13. User sees personalized dashboard with loan information

**Alternative Flow - Invalid Credentials**:
- At step 6 or 7, credentials don't match
- System returns error: "Invalid email or password"
- User remains on login page to retry

**Alternative Flow - Account Not Found**:
- At step 5, no user found with provided email
- System returns generic error: "Invalid email or password"
- User remains on login page

**Postconditions**:
- User is authenticated with valid JWT token
- User has access to protected routes and features

### 2.4.3 Apply for Loan

**Goal**: Allow an authenticated user to submit a loan application.

**Preconditions**: 
- User is logged in
- User has uploaded required documents (optional, depending on policy)

**Typical Flow**:
1. User navigates to loan application page
2. System displays available loan products with details
3. User selects desired loan product (e.g., "Personal Loan")
4. System displays application form with:
   - Selected product details
   - Loan amount input (with min/max constraints)
   - Tenure selection (in months)
   - Calculated interest rate
5. User enters desired loan amount (e.g., ₹50,000)
6. User selects tenure (e.g., 12 months)
7. System calculates and displays estimated EMI
8. User reviews terms and conditions
9. User submits application
10. System validates:
    - Amount is within product limits
    - User is authenticated
    - All required fields are filled
11. System creates LoanApplication record:
    - userId: from JWT token
    - productId: selected product
    - amount: requested amount
    - tenure: selected months
    - interestRate: from product
    - status: PENDING
12. System generates application ID
13. System displays success message with application ID
14. System sends confirmation notification (optional)

**Alternative Flow - Amount Out of Range**:
- At step 10, amount exceeds product limits
- System displays error: "Amount must be between ₹X and ₹Y"
- User adjusts amount and resubmits

**Alternative Flow - Missing Documents**:
- At step 10, system checks for required documents
- Documents not uploaded
- System prompts: "Please upload required documents first"
- User redirected to document upload page

**Postconditions**:
- Loan application created with PENDING status
- Application visible in user's dashboard
- Admin can review application

### 2.4.4 Interact with AI Chatbot for Loan Information

**Goal**: User queries the AI chatbot to get information about loan products and eligibility.

**Preconditions**: User is on the website (may or may not be logged in).

**Typical Flow**:
1. User clicks on chatbot FAB (floating action button)
2. System opens chat interface
3. System displays welcome message: "Hi! I'm TIA. How can I help you today?"
4. User types query: "What loan types do you offer?"
5. Frontend sends query to backend AI endpoint
6. Backend invokes Genkit agent with user query
7. Agent analyzes query and determines intent
8. Agent calls `getLoanTypes` tool
9. Tool returns list of loan products with rates
10. Agent formats response in natural language:
    "We offer the following loans:
    - Personal Loan at 12.5% interest
    - Home Loan at 8.5% interest
    Would you like to know more about any of these?"
11. System displays agent response in chat
12. User asks follow-up: "How much would I pay monthly for ₹50,000 personal loan for 12 months?"
13. Agent identifies need for calculation
14. Agent calls `calculateLoan` tool with:
    - amount: 50000
    - months: 12
    - rate: 12.5
15. Tool calculates and returns:
    - monthlyPayment: ₹4,454.35
    - totalPayment: ₹53,452.20
    - totalInterest: ₹3,452.20
16. Agent formats response:
    "For a ₹50,000 personal loan over 12 months at 12.5% interest:
    - Monthly EMI: ₹4,454.35
    - Total payment: ₹53,452.20
    - Total interest: ₹3,452.20
    Would you like to apply for this loan?"
17. System displays response

**Alternative Flow - User Wants to Apply**:
- User responds: "Yes, I want to apply"
- Agent checks if user is logged in
- If not logged in, agent responds: "Please log in or register to apply"
- If logged in, agent calls `applyForLoan` tool
- Application is submitted

**Postconditions**:
- User receives requested information
- Conversation history maintained in session

### 2.4.5 Check Active Loans via AI Chatbot

**Goal**: Authenticated user queries their active loan details through the chatbot.

**Preconditions**: 
- User is logged in
- User has at least one loan application

**Typical Flow**:
1. User opens chatbot
2. User types: "What are my active loans?" or "Meri loan details batao"
3. Frontend sends query with authentication token
4. Backend invokes agent with user context (customer ID from JWT)
5. Agent identifies intent to retrieve loan information
6. Agent extracts customer_id from context
7. Agent calls `get_customer_loans` tool with customer_id
8. Tool makes API call to `/api/loans/my-loans` with auth token
9. Backend retrieves user's loans from database with:
   - Loan product details
   - Repayment information
   - Current status
10. Tool processes response and returns structured data:
    ```json
    [
      {
        "loan_type": "Personal Loan",
        "principal": 50000,
        "outstanding_amount": 45000,
        "emi_amount": 4454.35,
        "status": "DISBURSED"
      }
    ]
    ```
11. Agent formats natural language response:
    "You have 1 active loan:
    - Personal Loan of ₹50,000
    - Outstanding amount: ₹45,000
    - Monthly EMI: ₹4,454.35
    - Status: Disbursed
    
    Would you like to know your next EMI date or make a payment?"
12. System displays response in chat

**Alternative Flow - No Active Loans**:
- At step 10, tool returns empty array
- Agent responds: "You don't have any active loans. Would you like to apply for one?"

**Alternative Flow - Multiple Loans**:
- At step 10, tool returns multiple loans
- Agent lists all loans with details
- Agent offers to provide specific information about any loan

**Postconditions**:
- User receives current loan information
- User can ask follow-up questions

### 2.4.6 Get Next EMI Details

**Goal**: User queries when their next EMI payment is due and the amount.

**Preconditions**:
- User is logged in
- User has active loan with pending repayments

**Typical Flow**:
1. User asks chatbot: "When is my next EMI?" or "Kab paise bharne hai?"
2. Agent identifies intent to get EMI details
3. Agent first retrieves user's loans using `get_customer_loans`
4. System returns user has 1 active loan
5. Agent extracts loan_id from the loan data
6. Agent calls `get_emi_details` tool with loan_id
7. Tool retrieves next pending repayment from database
8. Tool returns:
    ```json
    {
      "next_emi_date": "2025-01-05",
      "amount": 4454.35,
      "status": "PENDING"
    }
    ```
9. Agent formats response:
    "Your next EMI of ₹4,454.35 is due on January 5, 2025.
    
    Would you like me to send you a payment link or set a reminder?"
10. System displays response

**Alternative Flow - Multiple Loans**:
- At step 4, user has multiple active loans
- Agent asks: "Which loan are you referring to: Personal Loan or Home Loan?"
- User specifies loan type
- Agent proceeds with correct loan_id

**Alternative Flow - Overdue Payment**:
- At step 8, due date is in the past
- Agent highlights: "⚠️ Your EMI of ₹4,454.35 was due on December 5, 2024 and is now overdue. Please make payment as soon as possible to avoid penalties."

**Postconditions**:
- User knows next payment date and amount
- User can request payment link or reminder

### 2.4.7 Generate Payment Link

**Goal**: User requests a secure payment link to pay their EMI.

**Preconditions**:
- User is logged in
- User has pending EMI payment

**Typical Flow**:
1. User asks: "Send me payment link" or "Pay karna hai"
2. Agent confirms intent to generate payment link
3. Agent retrieves customer_id from context
4. Agent retrieves EMI amount from previous conversation or queries it
5. Agent summarizes: "I'll generate a payment link for ₹4,454.35. Please confirm."
6. User confirms: "Yes" or "OK"
7. Agent calls `generate_payment_link` tool with:
   - customer_id
   - amount: 4454.35
8. Tool generates secure payment URL and expiry time
9. Tool returns:
    ```json
    {
      "payment_url": "https://creditnow.com/pay/123?amt=4454.35",
      "expiry": "2025-12-04T03:30:00Z"
    }
    ```
10. Agent formats response:
    "Here's your secure payment link:
    
    [Click here to pay ₹4,454.35](https://creditnow.com/pay/123?amt=4454.35)
    
    ⚠️ This link expires at 3:30 AM. Please complete payment before then."
11. System displays clickable link in chat

**Alternative Flow - Link Expired**:
- User clicks expired link
- Payment page shows error
- User requests new link from chatbot
- Process repeats

**Postconditions**:
- User has secure payment link
- Payment can be completed via link

### 2.4.8 Schedule Payment Reminder

**Goal**: User requests to be reminded about upcoming EMI payment.

**Preconditions**: User is logged in.

**Typical Flow**:
1. User asks: "Remind me in 2 days" or "Set reminder for next week"
2. Agent identifies intent to schedule notification
3. Agent extracts time duration: "2 days"
4. Agent calculates timestamp: current time + 2 days
5. Agent asks: "Which channel would you prefer: WhatsApp, SMS, or Email?"
6. User responds: "WhatsApp"
7. Agent calls `schedule_notification` tool with:
   - channel: "WhatsApp"
   - time: "2025-12-06T03:00:00Z"
   - type: "reminder"
8. Tool schedules notification (mocked in current implementation)
9. Tool returns:
    ```json
    {
      "success": true,
      "message": "Reminder scheduled for 2025-12-06T03:00:00Z via WhatsApp"
    }
    ```
10. Agent confirms:
    "✓ Done! I've scheduled a reminder for December 6, 2025 at 3:00 AM via WhatsApp.
    
    You'll receive a notification about your upcoming EMI payment."
11. System displays confirmation

**Postconditions**:
- Reminder scheduled in system
- User will receive notification at specified time

### 2.4.9 Request Account Statement

**Goal**: User requests their loan account statement for a specific period.

**Preconditions**: User is logged in.

**Typical Flow**:
1. User asks: "I need my account statement" or "Statement chahiye"
2. Agent asks: "For which period would you like the statement?"
3. User responds: "Last 3 months"
4. Agent extracts date range:
   - start_date: 3 months ago
   - end_date: today
5. Agent calls `get_account_statement` tool with:
   - start_date: "2024-09-04"
   - end_date: "2024-12-04"
6. Tool generates statement PDF (mocked)
7. Tool returns:
    ```json
    {
      "pdf_url": "https://creditnow.com/docs/statement_2024.pdf",
      "period": "Last 3 months to Today"
    }
    ```
8. Agent formats response:
    "Here is your account statement from September 4, 2024 to December 4, 2024:
    
    [Download Statement PDF](https://creditnow.com/docs/statement_2024.pdf)
    
    The statement includes all your loan transactions and payments during this period."
9. System displays downloadable link

**Alternative Flow - Specific Date Range**:
- At step 3, user specifies: "From January to March 2024"
- Agent extracts specific dates
- Proceeds with custom date range

**Postconditions**:
- User receives account statement
- Statement can be downloaded and saved

### 2.4.10 Create Support Ticket

**Goal**: User escalates an issue to human support when AI cannot resolve it.

**Preconditions**: User is logged in.

**Typical Flow**:
1. User expresses frustration: "I want to talk to a human" or "This is not working, I need help"
2. Agent detects escalation keywords or sentiment
3. Agent responds empathetically:
    "I understand this is important to you. Let me create a support ticket so our team can assist you personally."
4. Agent asks: "Could you briefly describe the issue you're facing?"
5. User explains: "My loan was approved but I haven't received the money"
6. Agent asks: "Which category does this fall under: Payment Issue, Loan Disbursement, or Other?"
7. User responds: "Loan Disbursement"
8. Agent calls `create_support_ticket` tool with:
   - issue_summary: "Approved loan not disbursed"
   - category: "Loan Disbursement"
9. Tool creates ticket in system
10. Tool returns:
    ```json
    {
      "ticket_id": "TKT-7823",
      "sla": "24 hours"
    }
    ```
11. Agent confirms:
    "✓ I've created support ticket TKT-7823 for you.
    
    Our team will respond within 24 hours. You'll receive an update via email and SMS.
    
    Is there anything else I can help you with in the meantime?"
12. System displays ticket confirmation

**Alternative Flow - Angry User**:
- At step 1, user uses strong language
- Agent remains calm and professional
- Agent prioritizes ticket creation
- Agent may flag ticket as high priority

**Postconditions**:
- Support ticket created in system
- User has ticket ID for reference
- Support team notified to follow up

### 2.4.11 Admin Reviews and Approves Loan

**Goal**: Admin user reviews a pending loan application and approves it.

**Preconditions**:
- Admin is logged in
- Loan application exists with PENDING status

**Typical Flow**:
1. Admin navigates to admin dashboard
2. System displays list of pending loan applications
3. Admin selects an application to review
4. System displays full application details:
   - Applicant information
   - Requested amount and tenure
   - Uploaded documents
   - Credit history (if available)
5. Admin reviews documents and applicant profile
6. Admin verifies all required documents are uploaded and verified
7. Admin decides to approve the application
8. Admin clicks "Approve" button
9. System prompts for optional approval notes
10. Admin enters notes: "All documents verified, good credit score"
11. System updates LoanApplication:
    - status: APPROVED
    - updatedAt: current timestamp
12. System creates AdminAction record:
    - adminId: current admin's ID
    - loanId: application ID
    - action: APPROVE
    - note: admin's notes
13. System generates repayment schedule:
    - Calculates EMI amount
    - Creates LoanRepayment records for each month
    - Sets due dates (e.g., 5th of each month)
14. System sends approval notification to user
15. System displays success message to admin
16. Application moves to "Approved" list

**Alternative Flow - Rejection**:
- At step 7, admin decides to reject
- Admin clicks "Reject" button
- System prompts for rejection reason (required)
- Admin enters reason: "Insufficient income proof"
- System updates status to REJECTED
- System creates AdminAction with REJECT
- User notified of rejection with reason

**Alternative Flow - Request More Documents**:
- At step 6, documents are insufficient
- Admin requests additional documents
- System notifies user
- Application remains PENDING

**Postconditions**:
- Loan status updated
- Admin action logged
- Repayment schedule created (if approved)
- User notified of decision

---

This comprehensive Software Requirement and Analysis document provides a detailed foundation for the CreditNow AI-Powered Customer Support System, covering all aspects from functional and non-functional requirements to feasibility analysis, module descriptions, and use case scenarios.
