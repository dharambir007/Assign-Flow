import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../services/api'
import {
  Building2,
  GraduationCap,
  ShieldCheck,
  Loader2,
  UserCheck,
  Users,
  Plus,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDepartments: 0,
    totalStudents: 0,
    totalProfessors: 0,
    totalHODs: 0
  })
  const [loading, setLoading] = useState(true)
  const [animatedStats, setAnimatedStats] = useState({
    totalDepartments: 0,
    totalStudents: 0,
    totalProfessors: 0,
    totalHODs: 0
  })

  useEffect(() => {
    fetchStats()
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
          // Easing function for smooth animation
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

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
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
      backgroundColor: 'var(--accent-50)',
      borderRadius: 'var(--radius-xl)',
      color: 'var(--accent-600)',
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
    addButton: {
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 'var(--space-5)',
      marginBottom: 'var(--space-8)',
    },
    statCard: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-6)',
      textDecoration: 'none',
      transition: 'all var(--transition-fast)',
      cursor: 'pointer',
    },
    statCardHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-5)',
    },
    statIconWrapper: {
      width: '48px',
      height: '48px',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: '700',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-1)',
      fontVariantNumeric: 'tabular-nums',
    },
    statLabel: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--text-tertiary)',
    },
    quickActionsCard: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
    },
    quickActionsHeader: {
      padding: 'var(--space-5) var(--space-6)',
      borderBottom: '1px solid var(--border-light)',
    },
    quickActionsTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
    },
    quickActionsBody: {
      padding: 'var(--space-6)',
    },
    quickActionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 'var(--space-4)',
    },
    actionLink: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-4) var(--space-5)',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      textDecoration: 'none',
      transition: 'all var(--transition-fast)',
    },
    actionIconWrapper: {
      width: '40px',
      height: '40px',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionText: {
      flex: 1,
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--text-primary)',
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '256px',
      color: 'var(--text-tertiary)',
    },
  }

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

  const statCards = [
    {
      title: 'Departments',
      value: animatedStats.totalDepartments,
      icon: Building2,
      iconBg: '#f3e8ff',
      iconColor: '#7c3aed',
      link: '/admin/departments'
    },
    {
      title: 'Students',
      value: animatedStats.totalStudents,
      icon: GraduationCap,
      iconBg: '#d1fae5',
      iconColor: '#059669',
      link: '/admin/users?type=student'
    },
    {
      title: 'Professors',
      value: animatedStats.totalProfessors,
      icon: UserCheck,
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      link: '/admin/users?type=professor'
    },
    {
      title: 'HODs',
      value: animatedStats.totalHODs,
      icon: ShieldCheck,
      iconBg: '#fef3c7',
      iconColor: '#d97706',
      link: '/admin/users?type=hod'
    }
  ]

  const quickActions = [
    { label: 'Add User', icon: Users, link: '/admin/users/create', iconBg: '#e0e7ff', iconColor: '#4f46e5' },
    { label: 'Add Department', icon: Building2, link: '/admin/departments/create', iconBg: '#d1fae5', iconColor: '#059669' },
    { label: 'View Users', icon: GraduationCap, link: '/admin/users', iconBg: '#dbeafe', iconColor: '#2563eb' },
  ]

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
        .quick-actions-card {
          animation: slideInUp 0.6s ease-out 0.5s forwards;
          opacity: 0;
        }
        .action-link:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--accent-300);
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--accent-200);
        }
        .add-button:hover {
          background-color: var(--accent-700);
          transform: translateY(-1px);
        }
        .header-icon {
          transition: transform 0.3s ease;
        }
        .header-icon:hover {
          transform: scale(1.1) rotate(5deg);
        }
      `}</style>

      <div style={styles.pageContainer}>
        {/* Header Section */}
        <div style={styles.headerSection} className="header-section">
          <div style={styles.headerContent}>
            <div style={styles.headerIcon} className="header-icon">
              <LayoutDashboard size={26} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={styles.headerTitle}>Dashboard</h1>
              <p style={styles.headerSubtitle}>Overview of your institution</p>
            </div>
          </div>
          <Link
            to="/admin/users/create"
            style={styles.addButton}
            className="add-button"
          >
            <Plus size={18} />
            Add User
          </Link>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Link
                key={card.title}
                to={card.link}
                style={styles.statCard}
                className="stat-card"
              >
                <div style={styles.statCardHeader}>
                  <div style={{ ...styles.statIconWrapper, backgroundColor: card.iconBg }}>
                    <Icon size={22} style={{ color: card.iconColor }} />
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div>
                  <p style={styles.statValue}>{card.value}</p>
                  <p style={styles.statLabel}>{card.title}</p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions Section */}
        <div style={styles.quickActionsCard} className="quick-actions-card">
          <div style={styles.quickActionsHeader}>
            <h2 style={styles.quickActionsTitle}>Quick Actions</h2>
          </div>
          <div style={styles.quickActionsBody}>
            <div style={styles.quickActionsGrid}>
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.label}
                    to={action.link}
                    style={styles.actionLink}
                    className="action-link"
                  >
                    <div style={{ ...styles.actionIconWrapper, backgroundColor: action.iconBg }}>
                      <Icon size={18} style={{ color: action.iconColor }} />
                    </div>
                    <span style={styles.actionText}>{action.label}</span>
                    <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
