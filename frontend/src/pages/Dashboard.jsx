
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  Clock3,
  CheckCircle2,
  Search,
  LogOut,
  RefreshCw,
  Users,
  Menu,
  X,
} from "lucide-react";
import { api } from "../services/api";

const statusLabels = {
  new: "New",
  in_progress: "In Progress",
  resolved: "Resolved",
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [userType, setUserType] = useState("");
  const [status, setStatus] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isMobile = () => window.innerWidth <= 900;

  const handleMenuToggle = () => {
    if (isMobile()) {
      setMenuOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  const closeSidebar = () => {
    setMenuOpen(false);
  };

  // Close mobile sidebar with Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Close mobile drawer when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const loadInquiries = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.getInquiries({
        search,
        category,
        userType,
        status,
      });

      setInquiries(data.inquiries || []);
    } catch (err) {
      const message = (err.message || "").toLowerCase();

      if (
        message.includes("login") ||
        message.includes("authentication") ||
        message.includes("token")
      ) {
        navigate("/admin/login", { replace: true });
        return;
      }

      setError(err.message || "Unable to load inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [search, category, userType, status]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateInquiryStatus(id, newStatus);
      await loadInquiries();
    } catch (err) {
      setError(err.message || "Unable to update status.");
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err.message);
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  const total = inquiries.length;

  const newCount = inquiries.filter(
    (item) => item.status === "new"
  ).length;

  const progressCount = inquiries.filter(
    (item) => item.status === "in_progress"
  ).length;

  const resolvedCount = inquiries.filter(
    (item) => item.status === "resolved"
  ).length;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className={`dashboard-page ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {/* Mobile overlay */}
      <div
        className={`dashboard-overlay ${
          menuOpen ? "is-open" : ""
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${
          menuOpen ? "is-open" : ""
        }`}
        aria-label="Dashboard navigation"
      >
        <div className="dashboard-brand">
          <span className="dashboard-brand-icon">
            <LayoutDashboard size={21} />
          </span>

          <span>
            K12 <b>Hunar</b>
          </span>

          <button
            type="button"
            className="sidebar-close"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={21} />
          </button>
        </div>

        <div className="sidebar-section-label">
          WORKSPACE
        </div>

        <button
          type="button"
          className="sidebar-link active"
          onClick={closeSidebar}
        >
          <LayoutDashboard size={18} />
          <span>Overview</span>
        </button>

        <button
          type="button"
          className="sidebar-link"
          onClick={closeSidebar}
        >
          <Inbox size={18} />
          <span>Inquiries</span>
        </button>

        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-avatar">A</div>

            <div>
              <strong>Administrator</strong>
              <span>Admin account</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main dashboard */}
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-left">
            <button
              type="button"
              className="menu-button"
              onClick={handleMenuToggle}
              aria-label={
                menuOpen || !sidebarCollapsed
                  ? "Toggle sidebar"
                  : "Open sidebar"
              }
              aria-expanded={
                isMobile() ? menuOpen : !sidebarCollapsed
              }
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="dashboard-breadcrumb">
                Workspace / Overview
              </p>

              <h1>Inquiry Dashboard</h1>
            </div>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={loadInquiries}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {/* Welcome section */}
        <section className="dashboard-welcome">
          <div>
            <p className="dashboard-welcome-label">
              OVERVIEW
            </p>

            <h2>Welcome back, Administrator</h2>

            <p>
              Here's what's happening with your inquiries.
            </p>
          </div>

          <div className="welcome-icon">
            <Users size={34} />
          </div>
        </section>

        {/* Statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Inbox size={21} />
            </div>

            <p>Total Inquiries</p>
            <h2>{total}</h2>
            <span>Matching current filters</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Clock3 size={21} />
            </div>

            <p>New Inquiries</p>
            <h2>{newCount}</h2>
            <span>Awaiting review</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <RefreshCw size={21} />
            </div>

            <p>In Progress</p>
            <h2>{progressCount}</h2>
            <span>Currently being handled</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <CheckCircle2 size={21} />
            </div>

            <p>Resolved</p>
            <h2>{resolvedCount}</h2>
            <span>Successfully completed</span>
          </div>
        </section>

        {/* Inquiries table */}
        <section className="inquiries-section">
          <div className="table-heading">
            <div>
              <h2>All Inquiries</h2>
              <p>
                Review and manage submitted inquiries.
              </p>
            </div>

            <span className="record-count">
              {total} records
            </span>
          </div>

          {/* Filters */}
          <div className="filters-bar">
            <div className="search-box">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Concert">Concert</option>
              <option value="Admission">Admission</option>
              <option value="General Query">
                General Query
              </option>
            </select>

            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              aria-label="Filter by user type"
            >
              <option value="">All User Types</option>
              <option value="Parent">Parent</option>
              <option value="Student">Student</option>
              <option value="School">School</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {error && (
            <div className="dashboard-error" role="alert">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="table-wrapper">
            <table className="inquiries-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="table-message">
                      Loading inquiries...
                    </td>
                  </tr>
                ) : inquiries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="table-message">
                      No inquiries found.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((item) => (
                    <tr key={item.id}>
                      <td className="inquiry-name">
                        {item.name}
                      </td>

                      <td>{item.phone}</td>
                      <td>{item.email}</td>
                      <td>{item.user_type}</td>
                      <td>{item.category}</td>
                      <td>{formatDate(item.created_at)}</td>

                      <td>
                        <select
                          className={`status-select status-${item.status}`}
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(
                              item.id,
                              e.target.value
                            )
                          }
                          aria-label={`Update status for ${item.name}`}
                        >
                          {Object.entries(statusLabels).map(
                            ([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
