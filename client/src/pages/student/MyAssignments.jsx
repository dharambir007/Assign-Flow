import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import api from '../../services/api'
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  Calendar,
  Grid,
  List,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Loader2,
  Sparkles,
  Award,
  Inbox
} from 'lucide-react'

const MyAssignments = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [alert, setAlert] = useState({ show: false, type: '', message: '' })

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/api/student/assignments')
      setAssignments(response.data.assignments || [])
    } catch (error) {
      console.error('Error fetching assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitForReview = async (id) => {
    try {
      await api.post(`/api/student/submit/${id}`)
      setAlert({ show: true, type: 'success', message: 'Assignment submitted for review successfully!' })
      fetchAssignments()
    } catch (error) {
      console.error('Error submitting assignment:', error)
      const errorMsg = error.response?.data?.message || 'Failed to submit assignment. Please try again.'
      setAlert({ show: true, type: 'error', message: errorMsg })
    }
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000)
  }

  const filteredAssignments = filter
    ? assignments.filter(a => a.status === filter)
    : assignments

  const getStatusConfig = (status) => {
    const config = {
      'Draft': { label: 'Draft', bgColor: 'var(--color-warning-light)', textColor: 'var(--color-warning)', icon: FileText },
      'PendingProfessor': { label: 'Pending Professor', bgColor: 'var(--color-info-light)', textColor: 'var(--color-info)', icon: Clock },
      'ProfessorApproved': { label: 'Pending HOD', bgColor: 'var(--accent-50)', textColor: 'var(--accent-600)', icon: CheckCircle },
      'Submitted': { label: 'Approved', bgColor: 'var(--color-success-light)', textColor: 'var(--color-success)', icon: Award },
      'Rejected': { label: 'Rejected', bgColor: 'var(--color-error-light)', textColor: 'var(--color-error)', icon: XCircle }
    }
    return config[status] || { label: status, bgColor: 'var(--gray-100)', textColor: 'var(--gray-600)', icon: FileText }
  }

  const styles = {
    filterCard: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-4) var(--space-5)',
      marginBottom: 'var(--space-5)',
      boxShadow: 'var(--shadow-card)',
    },
    filterTabs: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2)',
    },
    filterTab: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-2) var(--space-4)',
      fontSize: '0.875rem',
      fontWeight: '500',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid transparent',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
    },
    filterTabInactive: {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-light)',
    },
    filterTabActive: {
      backgroundColor: 'var(--accent-600)',
      color: 'var(--text-inverse)',
      border: '1px solid var(--accent-600)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 'var(--space-6)',
    },
    card: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    cardHeader: {
      padding: 'var(--space-5)',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardBody: {
      padding: 'var(--space-5)',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    cardTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-2)',
    },
    cardDesc: {
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      marginBottom: 'var(--space-4)',
      lineHeight: 1.5,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      flex: 1,
    },
    cardFooter: {
      padding: 'var(--space-4) var(--space-5)',
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      fontSize: '0.75rem',
      fontWeight: '600',
      borderRadius: 'var(--radius-md)',
    },
    categoryTag: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: 'var(--text-secondary)',
      backgroundColor: 'var(--gray-100)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)',
    },
    submitBtn: {
      padding: '6px 16px',
      fontSize: '0.875rem',
      fontWeight: '500',
      borderRadius: 'var(--radius-lg)',
      border: 'none',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
      color: 'var(--text-inverse)',
    },
    rejectedBox: {
      marginTop: 'var(--space-3)',
      padding: 'var(--space-3)',
      backgroundColor: 'var(--color-error-light)',
      border: '1px solid rgba(220, 38, 38, 0.2)',
      borderRadius: 'var(--radius-lg)',
    },
    rejectedTitle: {
      fontSize: '0.75rem',
      fontWeight: '700',
      color: 'var(--color-error)',
      marginBottom: '2px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    rejectedText: {
      fontSize: '0.8125rem',
      color: 'var(--color-error)',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-16) var(--space-6)',
      color: 'var(--text-tertiary)',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-16) var(--space-6)',
      textAlign: 'center',
      backgroundColor: 'var(--bg-primary)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-light)',
    },
  }

  const animationStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .page-bg {
      position: relative;
    }
    
    .page-bg::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.04) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.97);
      backdrop-filter: blur(10px);
    }
    
    .assignment-card {
      transition: all 0.3s ease;
    }
    
    .assignment-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
  `

  if (loading) {
    return (
      <Layout title="My Assignments">
        <div style={styles.loadingContainer}>
          <Loader2 size={32} className="animate-spin" style={{ marginBottom: 'var(--space-3)', color: 'var(--accent-500)' }} />
          <span style={{ fontSize: '0.875rem' }}>Loading assignments...</span>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="My Assignments">
      <style>{animationStyles}</style>

      <div className="page-bg">
        <div className="content-wrapper animate-fade-in-up">
          {alert.show && (
            <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 animate-fade-in-up ${alert.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
              {alert.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span className="flex-1 font-medium text-sm">{alert.message}</span>
              <button
                onClick={() => setAlert({ show: false, type: '', message: '' })}
                className="opacity-60 hover:opacity-100 transition"
              >
                &times;
              </button>
            </div>
          )}

          <div style={styles.filterCard} className="glass-card">
            <div style={{ marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.8125rem', color: 'var(--text-tertiary)', fontWeight: '500' }}>
              <Filter size={14} />
              FILTER BY STATUS
            </div>
            <div style={styles.filterTabs}>
              <button
                onClick={() => setFilter('')}
                style={{
                  ...styles.filterTab,
                  ...(filter === '' ? styles.filterTabActive : styles.filterTabInactive),
                }}
              >
                <Grid size={14} />
                All ({assignments.length})
              </button>
              {[
                { value: 'Draft', label: 'Draft', icon: FileText },
                { value: 'PendingProfessor', label: 'Pending Professor', icon: Clock },
                { value: 'ProfessorApproved', label: 'Pending HOD', icon: CheckCircle },
                { value: 'Submitted', label: 'Approved', icon: Award },
                { value: 'Rejected', label: 'Rejected', icon: XCircle }
              ].map(status => {
                const StatusIcon = status.icon
                return (
                  <button
                    key={status.value}
                    onClick={() => setFilter(status.value)}
                    style={{
                      ...styles.filterTab,
                      ...(filter === status.value ? styles.filterTabActive : styles.filterTabInactive),
                    }}
                  >
                    <StatusIcon size={14} />
                    {status.label} ({assignments.filter(a => a.status === status.value).length})
                  </button>
                )
              })}
            </div>
          </div>

          {filteredAssignments.length > 0 ? (
            <div style={styles.grid}>
              {filteredAssignments.map(assignment => {
                const statusConfig = getStatusConfig(assignment.status)
                const StatusIcon = statusConfig.icon
                return (
                  <div key={assignment._id} style={styles.card} className="glass-card assignment-card">
                    <div style={styles.cardHeader}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: statusConfig.bgColor,
                        color: statusConfig.textColor,
                      }}>
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        <Calendar size={12} />
                        {new Date(assignment.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={styles.cardBody}>
                      <h3 style={styles.cardTitle}>{assignment.title}</h3>
                      <p style={styles.cardDesc}>{assignment.description}</p>

                      <div style={{ marginTop: 'auto' }}>
                        <span style={styles.categoryTag}>{assignment.category}</span>

                        {assignment.status === 'Rejected' && assignment.reviewComments && (
                          <div style={styles.rejectedBox}>
                            <p style={styles.rejectedTitle}>
                              <AlertCircle size={12} />
                              Rejected by {assignment.rejectedBy || 'Reviewer'}
                            </p>
                            <p style={styles.rejectedText}>"{assignment.reviewComments}"</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={styles.cardFooter}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <FileText size={14} className="text-gray-400" />
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>PDF Document</span>
                      </div>

                      {(assignment.status === 'Draft' || assignment.status === 'Rejected') && (
                        <button
                          onClick={() => handleSubmitForReview(assignment._id)}
                          style={{
                            ...styles.submitBtn,
                            backgroundColor: assignment.status === 'Rejected' ? 'var(--color-error)' : 'var(--accent-600)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = assignment.status === 'Rejected' ? '#B91C1C' : 'var(--accent-700)'
                            e.currentTarget.style.transform = 'translateY(-1px)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = assignment.status === 'Rejected' ? 'var(--color-error)' : 'var(--accent-600)'
                            e.currentTarget.style.transform = 'translateY(0)'
                          }}
                        >
                          {assignment.status === 'Rejected' ? 'Resubmit' : 'Submit'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Inbox size={28} />
              </div>
              <h3 style={styles.emptyTitle}>No assignments found</h3>
              <p style={styles.emptyText}>
                {filter ? `You don't have any ${filter.toLowerCase()} assignments.` : 'Start by uploading your first assignment!'}
              </p>
              {!filter && (
                <button
                  onClick={() => window.location.href = '/student/upload'} // Using simple redirect for empty state action
                  style={{
                    ...styles.submitBtn,
                    backgroundColor: 'var(--accent-600)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-3) var(--space-5)',
                  }}
                >
                  <Upload size={16} />
                  Upload New Assignment
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default MyAssignments
