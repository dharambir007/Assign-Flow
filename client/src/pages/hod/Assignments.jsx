import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../services/api'
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Filter,
  User,
  Calendar,
  Loader2,
  FolderOpen
} from 'lucide-react'

const Assignments = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAssignments: 0
  })

  const status = searchParams.get('status') || ''
  const page = parseInt(searchParams.get('page')) || 1

  useEffect(() => {
    fetchAssignments()
  }, [status, page])

  const fetchAssignments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      params.append('page', page)
      params.append('limit', 10)

      const response = await api.get(`/api/hod/assignments?${params}`)
      setAssignments(response.data.assignments)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusFilter = (newStatus) => {
    const params = new URLSearchParams(searchParams)
    if (newStatus) {
      params.set('status', newStatus)
    } else {
      params.delete('status')
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    setSearchParams(params)
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
      'ProfessorApproved': {
        label: 'Pending HOD Review',
        bgColor: '#fef3c7',
        textColor: '#d97706',
        icon: Clock
      },
      'Submitted': {
        label: 'Final Approved',
        bgColor: '#d1fae5',
        textColor: '#059669',
        icon: CheckCircle
      },
      'Rejected': {
        label: 'Rejected',
        bgColor: '#fee2e2',
        textColor: '#dc2626',
        icon: XCircle
      }
    }
    return config[status] || {
      label: status,
      bgColor: '#f1f5f9',
      textColor: '#64748b',
      icon: FileText
    }
  }

  const filterTabs = [
    { key: '', label: 'All', icon: FileText },
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'reviewed', label: 'Reviewed', icon: ClipboardCheck },
    { key: 'Submitted', label: 'Approved', icon: CheckCircle },
    { key: 'Rejected', label: 'Rejected', icon: XCircle }
  ]

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
      marginBottom: 'var(--space-6)',
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
    },
    headerIcon: {
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--accent-50)',
      borderRadius: 'var(--radius-xl)',
      color: 'var(--accent-600)',
    },
    headerTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
      marginBottom: '2px',
    },
    headerSubtitle: {
      fontSize: '0.875rem',
      color: 'var(--text-tertiary)',
    },
    filterCard: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-4) var(--space-5)',
      marginBottom: 'var(--space-5)',
      boxShadow: 'var(--shadow-card)',
    },
    filterHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      marginBottom: 'var(--space-4)',
      fontSize: '0.8125rem',
      fontWeight: '500',
      color: 'var(--text-tertiary)',
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
      marginBottom: '2px',
    },
    metaText: {
      fontSize: '0.8125rem',
      color: 'var(--text-tertiary)',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
    },
    userAvatar: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      backgroundColor: 'var(--accent-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--accent-600)',
      flexShrink: 0,
    },
    dateInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
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
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-light)',
    },
    paginationBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-4) var(--space-5)',
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-light)',
    },
    paginationInfo: {
      fontSize: '0.8125rem',
      color: 'var(--text-tertiary)',
    },
    paginationButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
    },
    paginationButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      padding: 'var(--space-2) var(--space-3)',
      fontSize: '0.8125rem',
      fontWeight: '500',
      color: 'var(--text-secondary)',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
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
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-xl)',
      color: 'var(--text-muted)',
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
  }

  return (
    <Layout title="All Assignments">
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
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .header-section {
          animation: slideInUp 0.5s ease-out forwards;
        }
        .filter-card {
          animation: fadeIn 0.5s ease-out 0.1s forwards;
          opacity: 0;
        }
        .table-card {
          animation: scaleIn 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        .table-row:hover {
          background-color: var(--bg-secondary);
        }
        .filter-tab:hover:not(.active) {
          background-color: var(--gray-200);
          border-color: var(--gray-300);
        }
        .review-button:hover {
          background-color: var(--accent-100);
        }
        .view-button:hover {
          background-color: var(--gray-200);
        }
        .pagination-button:hover:not(:disabled) {
          background-color: var(--bg-secondary);
        }
        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .header-icon {
          transition: transform 0.3s ease;
        }
        .header-icon:hover {
          transform: scale(1.1) rotate(5deg);
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none; }
        }
      `}</style>

      <div style={styles.pageContainer}>
        {/* Header */}
        <div style={styles.headerSection} className="header-section">
          <div style={styles.headerContent}>
            <div style={styles.headerIcon} className="header-icon">
              <FolderOpen size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={styles.headerTitle}>All Assignments</h1>
              <p style={styles.headerSubtitle}>{pagination.totalAssignments} total assignments</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs Card */}
        <div style={styles.filterCard} className="filter-card">
          <div style={styles.filterHeader}>
            <Filter size={14} />
            <span>Filter by Status</span>
          </div>
          <div style={styles.filterTabs}>
            {filterTabs.map((tab) => {
              const isActive = status === tab.key
              const TabIcon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => handleStatusFilter(tab.key)}
                  style={{
                    ...styles.filterTab,
                    ...(isActive ? styles.filterTabActive : styles.filterTabInactive),
                  }}
                  className={`filter-tab ${isActive ? 'active' : ''}`}
                >
                  <TabIcon size={14} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Assignments Table Card */}
        <div style={styles.tableCard} className="table-card">
          {loading ? (
            <div style={styles.loadingContainer}>
              <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: 'var(--space-3)' }} />
              <span style={{ fontSize: '0.875rem' }}>Loading assignments...</span>
            </div>
          ) : assignments.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead style={styles.tableHead}>
                    <tr>
                      <th style={styles.th}>Assignment</th>
                      <th style={styles.th}>Student</th>
                      <th style={styles.th} className="hide-mobile">Professor</th>
                      <th style={styles.th} className="hide-mobile">Date</th>
                      <th style={styles.th}>Status</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment, index) => {
                      const statusConfig = getStatusConfig(assignment.status)
                      const StatusIcon = statusConfig.icon
                      return (
                        <tr
                          key={assignment._id}
                          style={{
                            ...styles.tr,
                            animation: `fadeIn 0.3s ease-out ${0.3 + index * 0.05}s forwards`,
                            opacity: 0,
                          }}
                          className="table-row"
                        >
                          <td style={styles.td}>
                            <div style={styles.assignmentTitle}>{assignment.title}</div>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.userInfo}>
                              <div style={styles.userAvatar}>
                                <User size={14} />
                              </div>
                              <span style={styles.metaText}>{assignment.studentEmail}</span>
                            </div>
                          </td>
                          <td style={styles.td} className="hide-mobile">
                            <span style={styles.metaText}>
                              {assignment.professorReviewedBy?.name || assignment.professorReviewedBy?.email || 'N/A'}
                            </span>
                          </td>
                          <td style={styles.td} className="hide-mobile">
                            <div style={styles.dateInfo}>
                              <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                              <span style={styles.metaText}>
                                {formatDate(assignment.professorReviewedAt || assignment.submittedAt)}
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
                            {assignment.status === 'ProfessorApproved' ? (
                              <Link
                                to={`/hod/assignments/${assignment._id}/review`}
                                style={{ ...styles.actionButton, ...styles.reviewButton }}
                                className="review-button"
                              >
                                <ClipboardCheck size={14} />
                                Review
                              </Link>
                            ) : (
                              <Link
                                to={`/hod/assignments/${assignment._id}`}
                                style={{ ...styles.actionButton, ...styles.viewButton }}
                                className="view-button"
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div style={styles.paginationBar}>
                  <div style={styles.paginationInfo}>
                    Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong>
                    <span style={{ marginLeft: 'var(--space-2)', color: 'var(--text-muted)' }}>
                      ({pagination.totalAssignments} total)
                    </span>
                  </div>
                  <div style={styles.paginationButtons}>
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      style={styles.paginationButton}
                      className="pagination-button"
                    >
                      <ChevronLeft size={14} />
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= pagination.totalPages}
                      style={styles.paginationButton}
                      className="pagination-button"
                    >
                      Next
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Inbox size={28} />
              </div>
              <h3 style={styles.emptyTitle}>No assignments found</h3>
              <p style={styles.emptyText}>
                {status ? 'Try changing the filter or check back later.' : 'Assignments will appear here once submitted.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Assignments
