import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../services/api'
import {
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  ClipboardCheck,
  Calendar,
  Loader2,
  ArrowRight,
  BookOpen
} from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalReviewed: 0
  })
  const [recentAssignments, setRecentAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [animatedStats, setAnimatedStats] = useState({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalReviewed: 0
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
      const response = await api.get('/api/professor/dashboard')
      setStats({
        pendingCount: response.data.pendingCount,
        approvedCount: response.data.approvedCount,
        rejectedCount: response.data.rejectedCount,
        totalReviewed: response.data.totalReviewed
      })
      setRecentAssignments(response.data.recentAssignments || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
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
      backgroundColor: '#dbeafe',
      borderRadius: 'var(--radius-xl)',
      color: '#2563eb',
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
    assignmentActions: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
    },
    dateText: {
      fontSize: '0.8125rem',
      color: 'var(--text-muted)',
    },
    reviewLink: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--text-secondary)',
      textDecoration: 'none',
      transition: 'color var(--transition-fast)',
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
      color: '#10b981',
      marginBottom: 'var(--space-2)',
    },
    emptyText: {
      fontSize: '0.9375rem',
      color: 'var(--text-secondary)',
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
      title: 'Pending',
      value: animatedStats.pendingCount,
      icon: Clock,
      iconBg: '#fef3c7',
      iconColor: '#d97706',
    },
    {
      title: 'Approved',
      value: animatedStats.approvedCount,
      icon: CheckCircle,
      iconBg: '#d1fae5',
      iconColor: '#059669',
    },
    {
      title: 'Rejected',
      value: animatedStats.rejectedCount,
      icon: XCircle,
      iconBg: '#fee2e2',
      iconColor: '#dc2626',
    },
    {
      title: 'Total Reviewed',
      value: animatedStats.totalReviewed,
      icon: BarChart3,
      iconBg: '#f1f5f9',
      iconColor: '#64748b',
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
        .review-link:hover {
          color: var(--accent-600);
        }
        .view-all-link:hover {
          color: var(--text-primary);
        }
      `}</style>

      <div style={styles.pageContainer}>
        {/* Header Section */}
        <div style={styles.headerSection} className="header-section">
          <div style={styles.headerContent}>
            <div style={styles.headerIcon} className="header-icon">
              <BookOpen size={26} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={styles.headerTitle}>Review Center</h1>
              <p style={styles.headerSubtitle}>
                {stats.pendingCount > 0 ? `${stats.pendingCount} assignments pending review` : 'All caught up!'}
              </p>
            </div>
          </div>
          {stats.pendingCount > 0 && (
            <Link
              to="/professor/assignments?status=PendingProfessor"
              style={styles.actionButton}
              className="action-button"
            >
              Start Review
              <ArrowRight size={16} />
            </Link>
          )}
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

        {/* Pending Assignments */}
        <div style={styles.assignmentsCard} className="assignments-card">
          <div style={styles.assignmentsHeader}>
            <h2 style={styles.assignmentsTitle}>Pending Review</h2>
            <Link to="/professor/assignments" style={styles.viewAllLink} className="view-all-link">
              View all
            </Link>
          </div>

          {recentAssignments.length > 0 ? (
            <div>
              {recentAssignments.map((assignment, index) => (
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
                    <p style={styles.assignmentMeta}>{assignment.studentEmail}</p>
                  </div>
                  <div style={styles.assignmentActions}>
                    <span style={styles.dateText}>
                      {formatDate(assignment.submittedAt)}
                    </span>
                    <Link
                      to={`/professor/assignments/${assignment._id}/review`}
                      style={styles.reviewLink}
                      className="review-link"
                    >
                      Review →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <CheckCircle size={28} style={styles.emptyIcon} />
              <p style={styles.emptyText}>No pending assignments</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
