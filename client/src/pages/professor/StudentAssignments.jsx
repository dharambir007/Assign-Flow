import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../services/api'
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Eye,
  ClipboardCheck,
  ArrowLeft,
  Calendar,
  BookOpen,
  Loader2,
  Inbox,
  User
} from 'lucide-react'

const StudentAssignments = () => {
  const { email } = useParams()
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignments()
  }, [email])

  const fetchAssignments = async () => {
    try {
      const response = await api.get(`/professor/students/${encodeURIComponent(email)}/assignments`)
      setAssignments(response.data.assignments)
    } catch (error) {
      console.error('Error fetching assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusConfig = (status) => {
    const config = {
      'PendingProfessor': {
        label: 'Pending Review',
        bgColor: 'var(--color-warning-light)',
        textColor: 'var(--color-warning)',
        icon: Clock
      },
      'ProfessorApproved': {
        label: 'Forwarded to HOD',
        bgColor: 'var(--color-info-light)',
        textColor: 'var(--color-info)',
        icon: Send
      },
      'Submitted': {
        label: 'Final Approved',
        bgColor: 'var(--color-success-light)',
        textColor: 'var(--color-success)',
        icon: CheckCircle
      },
      'Rejected': {
        label: 'Rejected',
        bgColor: 'var(--color-error-light)',
        textColor: 'var(--color-error)',
        icon: XCircle
      }
    }
    return config[status] || {
      label: status,
      bgColor: 'var(--gray-100)',
      textColor: 'var(--gray-600)',
      icon: FileText
    }
  }

  // Styles
  const styles = {
    headerCard: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-5)',
      marginBottom: 'var(--space-5)',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 'var(--space-4)',
    },
    studentInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: 'var(--accent-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--accent-600)',
      fontWeight: '700',
      fontSize: '1.125rem',
      flexShrink: 0,
    },
    studentName: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
    },
    studentEmail: {
      fontSize: '0.8125rem',
      color: 'var(--text-tertiary)',
    },
    backBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-2) var(--space-4)',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--text-secondary)',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all var(--transition-fast)',
    },
    tableCard: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-16) var(--space-6)',
      color: 'var(--text-tertiary)',
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHead: {
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-light)',
    },
    th: {
      padding: 'var(--space-4) var(--space-5)',
      textAlign: 'left',
      fontSize: '0.75rem',
      fontWeight: '600',
      color: 'var(--text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    tr: {
      borderBottom: '1px solid var(--border-light)',
      transition: 'background-color var(--transition-fast)',
    },
    td: {
      padding: 'var(--space-4) var(--space-5)',
      fontSize: '0.9375rem',
      color: 'var(--text-secondary)',
      verticalAlign: 'middle',
    },
    assignmentTitle: {
      fontWeight: '500',
      color: 'var(--text-primary)',
    },
    metaText: {
      fontSize: '0.8125rem',
      color: 'var(--text-tertiary)',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      fontSize: '0.75rem',
      fontWeight: '500',
      borderRadius: 'var(--radius-md)',
    },
    actionButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-2) var(--space-3)',
      fontSize: '0.8125rem',
      fontWeight: '500',
      borderRadius: 'var(--radius-md)',
      textDecoration: 'none',
      transition: 'all var(--transition-fast)',
    },
    reviewButton: {
      backgroundColor: 'var(--accent-50)',
      color: 'var(--accent-600)',
      border: '1px solid var(--accent-200)',
    },
    viewButton: {
      backgroundColor: 'var(--gray-100)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-light)',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-16) var(--space-6)',
      textAlign: 'center',
    },
    emptyIcon: {
      width: '64px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--gray-100)',
      borderRadius: 'var(--radius-xl)',
      color: 'var(--gray-400)',
      marginBottom: 'var(--space-4)',
    },
    emptyTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-1)',
    },
    emptyText: {
      fontSize: '0.875rem',
      color: 'var(--text-tertiary)',
    },
    summaryText: {
      marginTop: 'var(--space-4)',
      fontSize: '0.8125rem',
      color: 'var(--text-tertiary)',
    },
  }

  // Animation styles
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
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
    
    .content-wrapper {
      position: relative;
      z-index: 1;
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.97);
      backdrop-filter: blur(10px);
    }
    
    @media (max-width: 768px) {
      .student-table th:nth-child(2),
      .student-table td:nth-child(2),
      .student-table th:nth-child(3),
      .student-table td:nth-child(3) {
        display: none;
      }
    }
  `

  const decodedEmail = decodeURIComponent(email)

  if (loading) {
    return (
      <Layout title={`Assignments by ${decodedEmail}`}>
        <div style={styles.loadingContainer}>
          <Loader2 size={32} className="animate-spin" style={{ marginBottom: 'var(--space-3)', color: 'var(--accent-500)' }} />
          <span style={{ fontSize: '0.875rem' }}>Loading assignments...</span>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Student Assignments">
      <style>{animationStyles}</style>

      <div className="page-bg">
        <div className="content-wrapper animate-fade-in">

          {/* Header Card */}
          <div style={styles.headerCard} className="glass-card">
            <div style={styles.studentInfo}>
              <div style={styles.avatar}>
                {decodedEmail.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={styles.studentName}>Student</h2>
                <p style={styles.studentEmail}>{decodedEmail}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/professor/students')}
              style={styles.backBtn}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-200)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
            >
              <ArrowLeft size={16} />
              Back to Students
            </button>
          </div>

          {/* Assignments Table */}
          <div style={styles.tableCard} className="glass-card">
            {assignments.length > 0 ? (
              <div style={styles.tableWrapper}>
                <table style={styles.table} className="student-table">
                  <thead style={styles.tableHead}>
                    <tr>
                      <th style={styles.th}>Assignment</th>
                      <th style={styles.th}>Subject</th>
                      <th style={styles.th}>Submitted</th>
                      <th style={styles.th}>Status</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment) => {
                      const statusConfig = getStatusConfig(assignment.status)
                      const StatusIcon = statusConfig.icon
                      return (
                        <tr
                          key={assignment._id}
                          style={styles.tr}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={styles.td}>
                            <div style={styles.assignmentTitle}>{assignment.title}</div>
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                              <BookOpen size={14} style={{ color: 'var(--gray-400)' }} />
                              <span style={styles.metaText}>{assignment.subject || 'N/A'}</span>
                            </div>
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                              <Calendar size={14} style={{ color: 'var(--gray-400)' }} />
                              <span style={styles.metaText}>
                                {formatDate(assignment.submittedAt)}
                              </span>
                            </div>
                          </td>
                          <td style={styles.td}>
                            <span style={{
                              ...styles.badge,
                              backgroundColor: statusConfig.bgColor,
                              color: statusConfig.textColor,
                            }}>
                              <StatusIcon size={12} />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td style={{ ...styles.td, textAlign: 'right' }}>
                            {assignment.status === 'PendingProfessor' ? (
                              <Link
                                to={`/professor/assignments/${assignment._id}/review`}
                                style={{ ...styles.actionButton, ...styles.reviewButton }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-100)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-50)'}
                              >
                                <ClipboardCheck size={14} />
                                Review
                              </Link>
                            ) : (
                              <Link
                                to={`/professor/assignments/${assignment._id}`}
                                style={{ ...styles.actionButton, ...styles.viewButton }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-200)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-100)'}
                              >
                                <Eye size={14} />
                                View
                              </Link>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <Inbox size={28} />
                </div>
                <h3 style={styles.emptyTitle}>No assignments found</h3>
                <p style={styles.emptyText}>This student hasn't submitted any assignments yet.</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <p style={styles.summaryText}>
            Total: {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default StudentAssignments
