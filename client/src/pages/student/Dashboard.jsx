import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../services/api'
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Loader2,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    draftCount: 0,
    pendingCount: 0,
    submittedCount: 0,
    rejected: 0
  })
  const [recentAssignments, setRecentAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [animatedStats, setAnimatedStats] = useState({
    draftCount: 0,
    pendingCount: 0,
    submittedCount: 0,
    rejected: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Animate numbers counting up
  useEffect(() => {
    if (!loading) {
      const duration = 1500
      const steps = 60
      const stepDuration = duration / steps

      Object.keys(stats).forEach((key) => {
        const targetValue = stats[key]
        let currentStep = 0

        const timer = setInterval(() => {
          currentStep++
          const progress = currentStep / steps
          const easeOutQuart = 1 - Math.pow(1 - progress, 4)
          const currentValue = Math.floor(targetValue * easeOutQuart)

          setAnimatedStats((prev) => ({
            ...prev,
            [key]: currentValue
          }))

          if (currentStep >= steps) {
            clearInterval(timer)
            setAnimatedStats((prev) => ({
              ...prev,
              [key]: targetValue
            }))
          }
        }, stepDuration)
      })
    }
  }, [loading, stats])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/student/dashboard')
      setStats({
        draftCount: response.data.draftCount,
        pendingCount: response.data.pendingCount,
        submittedCount: response.data.submittedCount,
        rejected: response.data.rejected
      })
      setRecentAssignments(response.data.recentAssignments || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const config = {
      'Draft': { label: 'Draft', bgColor: '#f1f5f9', textColor: '#64748b' },
      'PendingProfessor': { label: 'In Review', bgColor: '#fef3c7', textColor: '#d97706' },
      'ProfessorApproved': { label: 'Pending HOD', bgColor: '#dbeafe', textColor: '#2563eb' },
      'Submitted': { label: 'Approved', bgColor: '#d1fae5', textColor: '#059669' },
      'Rejected': { label: 'Rejected', bgColor: '#fee2e2', textColor: '#dc2626' }
    }
    return config[status] || { label: status, bgColor: '#f1f5f9', textColor: '#64748b' }
  }

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: 'var(--bg-page)',
      padding: 'var(--space-6)',
    },
    headerSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-8)',
      paddingBottom: 'var(--space-6)',
      borderBottom: '1px solid var(--border-light)',
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
    },
    headerIcon: {
      width: '52px',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ede9fe',
      borderRadius: 'var(--radius-xl)',
      color: '#7c3aed',
    },
    headerTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-1)',
    },
    headerSubtitle: {
      fontSize: '0.875rem',
      color: 'var(--text-tertiary)',
    },
    actionButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-3) var(--space-5)',
      backgroundColor: 'var(--accent-600)',
      color: 'var(--text-inverse)',
      fontWeight: '600',
      fontSize: '0.875rem',
      borderRadius: 'var(--radius-lg)',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all var(--transition-fast)',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 'var(--space-5)',
      marginBottom: 'var(--space-8)',
    },
    statCard: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-5)',
      transition: 'all var(--transition-fast)',
    },
    statCardContent: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
    },
    statIconWrapper: {
      width: '44px',
      height: '44px',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    statValue: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: 'var(--text-primary)',
      fontVariantNumeric: 'tabular-nums',
    },
    statLabel: {
      fontSize: '0.8125rem',
      fontWeight: '500',
      color: 'var(--text-tertiary)',
    },
    assignmentsCard: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
    },
    assignmentsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-5) var(--space-6)',
      borderBottom: '1px solid var(--border-light)',
    },
    assignmentsTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
    },
    viewAllLink: {
      fontSize: '0.875rem',
      color: 'var(--text-tertiary)',
      textDecoration: 'none',
      transition: 'color var(--transition-fast)',
    },
    assignmentRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-4) var(--space-6)',
      borderBottom: '1px solid var(--border-light)',
      transition: 'background-color var(--transition-fast)',
    },
    assignmentInfo: {
      flex: 1,
      minWidth: 0,
    },
    assignmentTitle: {
      fontSize: '0.9375rem',
      fontWeight: '500',
      color: 'var(--text-primary)',
      marginBottom: '2px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    assignmentMeta: {
      fontSize: '0.8125rem',
      color: 'var(--text-tertiary)',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      fontSize: '0.75rem',
      fontWeight: '500',
      borderRadius: 'var(--radius-md)',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-12) var(--space-5)',
      textAlign: 'center',
    },
    emptyIcon: {
      color: 'var(--text-muted)',
      marginBottom: 'var(--space-2)',
    },
    emptyText: {
      fontSize: '0.9375rem',
      color: 'var(--text-secondary)',
      marginBottom: 'var(--space-3)',
    },
    emptyLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      textDecoration: 'none',
      transition: 'color var(--transition-fast)',
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '256px',
      color: 'var(--text-tertiary)',
    },
  }

  const statCards = [
    {
      title: 'Drafts',
      value: animatedStats.draftCount,
      icon: FileText,
      iconBg: '#f1f5f9',
      iconColor: '#64748b',
    },
    {
      title: 'Pending',
      value: animatedStats.pendingCount,
      icon: Clock,
      iconBg: '#fef3c7',
      iconColor: '#d97706',
    },
    {
      title: 'Approved',
      value: animatedStats.submittedCount,
      icon: CheckCircle,
      iconBg: '#d1fae5',
      iconColor: '#059669',
    },
    {
      title: 'Rejected',
      value: animatedStats.rejected,
      icon: XCircle,
      iconBg: '#fee2e2',
      iconColor: '#dc2626',
    },
  ]

  if (loading) {
    return (
      <Layout title="Dashboard">
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={styles.loadingContainer}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Dashboard">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .header-section {
          animation: slideInUp 0.6s ease-out forwards;
        }
        .stat-card {
          animation: scaleIn 0.5s ease-out forwards;
          opacity: 0;
        }
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }
        .assignments-card {
          animation: slideInUp 0.6s ease-out 0.5s forwards;
          opacity: 0;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .assignment-row:hover {
          background-color: var(--bg-secondary);
        }
        .action-button:hover {
          background-color: var(--accent-700);
          transform: translateY(-1px);
        }
        .header-icon {
          transition: transform 0.3s ease;
        }
        .header-icon:hover {
          transform: scale(1.1) rotate(5deg);
        }
        .view-all-link:hover {
          color: var(--text-primary);
        }
        .empty-link:hover {
          color: var(--accent-600);
        }
        .secondary-button:hover {
          background-color: var(--gray-200) !important;
          transform: translateY(-1px);
        }
      `}</style>

      <div style={styles.pageContainer}>
        {/* Header Section */}
        <div style={styles.headerSection} className="header-section">
          <div style={styles.headerContent}>
            <div style={styles.headerIcon} className="header-icon">
              <Sparkles size={26} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={styles.headerTitle}>My Submissions</h1>
              <p style={styles.headerSubtitle}>Track your assignment progress</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Link
              to="/student/bulk-upload"
              style={{ ...styles.actionButton, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}
              className="secondary-button"
            >
              <Layers size={16} />
              Bulk Upload
            </Link>
            <Link
              to="/student/upload"
              style={styles.actionButton}
              className="action-button"
            >
              <Upload size={16} />
              Upload
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                style={styles.statCard}
                className="stat-card"
              >
                <div style={styles.statCardContent}>
                  <div style={{ ...styles.statIconWrapper, backgroundColor: card.iconBg }}>
                    <Icon size={20} style={{ color: card.iconColor }} />
                  </div>
                  <div>
                    <p style={styles.statValue}>{card.value}</p>
                    <p style={styles.statLabel}>{card.title}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div style={styles.assignmentsCard} className="assignments-card">
          <div style={styles.assignmentsHeader}>
            <h2 style={styles.assignmentsTitle}>Recent Activity</h2>
            <Link to="/student/assignments" style={styles.viewAllLink} className="view-all-link">
              View all
            </Link>
          </div>

          {recentAssignments.length > 0 ? (
            <div>
              {recentAssignments.map((assignment, index) => {
                const badge = getStatusBadge(assignment.status)
                return (
                  <div
                    key={assignment._id}
                    style={{
                      ...styles.assignmentRow,
                      animation: `fadeIn 0.3s ease-out ${0.6 + index * 0.1}s forwards`,
                      opacity: 0,
                      borderBottom: index === recentAssignments.length - 1 ? 'none' : '1px solid var(--border-light)',
                    }}
                    className="assignment-row"
                  >
                    <div style={styles.assignmentInfo}>
                      <p style={styles.assignmentTitle}>{assignment.title}</p>
                      <p style={styles.assignmentMeta}>{assignment.category}</p>
                    </div>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: badge.bgColor,
                      color: badge.textColor,
                    }}>
                      {badge.label}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <FileText size={28} style={styles.emptyIcon} />
              <p style={styles.emptyText}>No assignments yet</p>
              <Link
                to="/student/upload"
                style={styles.emptyLink}
                className="empty-link"
              >
                Upload your first assignment
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
