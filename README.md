# 🖥️ SmartBiz Frontend

SmartBiz Frontend is a modern **React** web application serving as the user interface for the SmartBiz AI-driven **ERP-lite** management platform designed for Small and Medium Enterprises (SMEs).

Built with **Vite** for blazing-fast development, it connects to the [SmartBiz Backend](https://github.com/[your-repo]/smartbiz-backend) to deliver an intuitive experience for managing sales, inventory, financials, and AI-powered business insights.

---

## 📌 Project Highlights
*   **Dual-Portal UI**: Dedicated interfaces for **System Admins** and **Business Owners**.
*   **AI-Powered Dashboard**: Natural language querying and intelligent reporting visualizations.
*   **ERP-Lite Interface**: Manage inventory, customers, suppliers, invoices, and financials.
*   **Fast & Modern**: Built with React 19 and Vite 7 for optimal performance and developer experience.
*   **Component-Based Architecture**: Modular and reusable UI components for scalability.

---

## 🏗 Tech Stack

| Component         | Technology              |
| :---               | :---                    |
| **Framework**      | React 19                |
| **Build Tool**     | Vite 7                  |
| **Language**       | JavaScript (ES Modules) |
| **Styling**        | CSS                     |
| **Linting**        | ESLint 9                |
| **Package Manager**| npm                     |

---

## 🔐 Getting Started

### Prerequisites
*   **Node.js** 18 or higher
*   **npm** 9 or higher
*   **SmartBiz Backend** running locally (Spring Boot API on port `8080`)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/[your-repo]/smartbiz-frontend.git
    cd smartbiz-frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173` by default.

---

## 📜 Available Scripts

| Script           | Command              | Description                                     |
| :---             | :---                 | :---                                            |
| **Development**  | `npm run dev`        | Start the Vite dev server with HMR              |
| **Build**        | `npm run build`      | Create an optimized production build             |
| **Preview**      | `npm run preview`    | Preview the production build locally             |
| **Lint**         | `npm run lint`       | Run ESLint to check for code quality issues      |

---

## 🔗 Backend Integration

This frontend connects to the **SmartBiz Backend** REST API. Key API endpoints include:

| Endpoint              | Description                               |
| :---                  | :---                                      |
| `/api/v1/auth`        | Authentication — Registration & Login     |
| `/api/v1/admin`       | Admin Portal — Monitoring & Management    |
| `/api/v1/business`    | Business Portal — Core ERP Operations     |
| `/api/v1/ai`          | AI Engine — Intelligent Reporting         |

> Make sure the backend server is running before starting the frontend.

---

## 🔮 Planned Features
*   [ ] **Authentication UI**: Login & Registration pages with role-based routing.
*   [ ] **Admin Dashboard**: System monitoring, user management, and subscription controls.
*   [ ] **Business Dashboard**: At-a-glance metrics, charts, and AI-generated summaries.
*   [ ] **Inventory Management**: Product CRUD, stock levels, and low-stock alerts.
*   [ ] **Sales & Invoicing**: Invoice creation, history, and customer management.
*   [ ] **Financial Tracking**: Income/Expense logging with profit analysis views.
*   [ ] **AI Chat Interface**: Natural language querying for business insights.
*   [ ] **Responsive Design**: Mobile-friendly layouts for on-the-go management.

---

## 👨‍💻 Project Governance
Developed by **Dakshina Migara** as part of the SmartBiz AI ERP ecosystem.
