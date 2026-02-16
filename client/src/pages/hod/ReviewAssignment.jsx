import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../services/api'
import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  ArrowLeft,
  User,
  Calendar,
  Clock,
  MessageSquare,
  Loader2,
  AlertCircle,
  BookOpen,
  UserCheck,
  Send,
  Shield,
  FileCheck
} from 'lucide-react'

const ReviewAssignment = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [remarks, setRemarks] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAssignment()
  }, [id])

  const fetchAssignment = async () => {
    try {
      const response = await api.get(`/hod/assignments/${id}`)
      setAssignment(response.data.assignment)
    } catch (error) {
      console.error('Error fetching assignment:', error)
      setError('Failed to load assignment')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await api.get(`/hod/assignments/${id}/download`);

      if (response.data.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
      } else {
        throw new Error("Download URL not found");
      }
    } catch (error) {
      console.error('Error downloading file:', error)
      alert(error.response?.data?.message || error.message || 'Failed to download file')
    }
  }

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to give final approval? This will mark the assignment as Submitted (Final Approved).')) {
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await api.post(`/hod/assignments/${id}/approve`, { remarks })
      alert('Assignment approved and marked as Submitted (Final Approved)')
      navigate('/hod/assignments')
    } catch (error) {
      console.error('Error approving assignment:', error)
      setError(error.response?.data?.message || 'Failed to approve assignment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!remarks.trim()) {
      setError('Please provide remarks explaining the rejection reason')
      return
    }

    if (!window.confirm('Are you sure you want to reject this assignment?')) {
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await api.post(`/hod/assignments/${id}/reject`, { remarks })
      alert('Assignment rejected')
      navigate('/hod/assignments')
    } catch (error) {
      console.error('Error rejecting assignment:', error)
      setError(error.response?.data?.message || 'Failed to reject assignment')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const animationStyles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }
    
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-6px);
      }
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .animate-slide-in-right {
      animation: slideInRight 0.5s ease-out forwards;
      animation-delay: 0.2s;
      opacity: 0;
    }
    
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
    
    .review-page-bg {
      position: relative;
      overflow: hidden;
    }
    
    .review-page-bg::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.02) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }
    
    .content-wrapper {
      position: relative;
      z-index: 1;
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.8);
    }
    
    .decision-panel {
      background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.98) 100%);
    }
    
    .btn-approve {
      background: linear-gradient(135deg, var(--color-success) 0%, #047857 100%);
      box-shadow: 0 4px 14px 0 rgba(5, 150, 105, 0.3);
    }
    
    .btn-approve:hover:not(:disabled) {
      box-shadow: 0 6px 20px 0 rgba(5, 150, 105, 0.4);
      transform: translateY(-1px);
    }
    
    .btn-reject {
      background: linear-gradient(135deg, var(--color-error) 0%, #B91C1C 100%);
      box-shadow: 0 4px 14px 0 rgba(220, 38, 38, 0.3);
    }
    
    .btn-reject:hover:not(:disabled) {
      box-shadow: 0 6px 20px 0 rgba(220, 38, 38, 0.4);
      transform: translateY(-1px);
    }
    
    .info-card {
      transition: all 0.3s ease;
    }
    
    .info-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    @media (max-width: 1024px) {
      .review-grid {
        grid-template-columns: 1fr !important;
      }
      .decision-panel-wrapper {
        position: relative !important;
        top: 0 !important;
      }
    }
    
    @media (max-width: 640px) {
      .detail-grid {
        grid-template-columns: 1fr !important;
      }
      .professor-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `

  const styles = {
    pageWrapper: {
      minHeight: '100%',
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 380px',
      gap: 'var(--space-6)',
    },
    mainColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
    },
    card: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: 'var(--space-5) var(--space-6)',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
    },
    cardHeaderIcon: {
      width: '40px',
      height: '40px',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--accent-50)',
      color: 'var(--accent-600)',
    },
    cardTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
    },
    cardSubtitle: {
      fontSize: '0.8125rem',
      color: 'var(--text-tertiary)',
    },
    cardBody: {
      padding: 'var(--space-6)',
    },
    detailGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--space-5)',
    },
    detailItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)',
    },
    detailLabel: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: 'var(--text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
    },
    detailValue: {
      fontSize: '0.9375rem',
      fontWeight: '500',
      color: 'var(--text-primary)',
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      fontSize: '0.75rem',
      fontWeight: '600',
      borderRadius: 'var(--radius-md)',
      backgroundColor: 'var(--color-warning-light)',
      color: 'var(--color-warning)',
    },
    professorCard: {
      backgroundColor: 'var(--accent-50)',
      border: '1px solid var(--accent-100)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
    },
    professorHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginBottom: 'var(--space-4)',
    },
    professorIcon: {
      width: '36px',
      height: '36px',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--accent-600)',
      color: 'var(--text-inverse)',
    },
    professorTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: 'var(--accent-800)',
    },
    fileCard: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      padding: 'var(--space-4)',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      flexWrap: 'wrap',
    },
    fileInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
    },
    fileIcon: {
      width: '44px',
      height: '44px',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--accent-100)',
      color: 'var(--accent-600)',
    },
    downloadBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-3) var(--space-4)',
      fontSize: '0.875rem',
      fontWeight: '500',
      backgroundColor: 'var(--accent-600)',
      color: 'var(--text-inverse)',
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
    },
    decisionPanel: {
      position: 'sticky',
      top: 'var(--space-6)',
    },
    decisionHeader: {
      padding: 'var(--space-5) var(--space-6)',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
    },
    decisionIcon: {
      width: '40px',
      height: '40px',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-warning-light)',
      color: 'var(--color-warning)',
    },
    decisionTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
    },
    decisionBody: {
      padding: 'var(--space-5) var(--space-6)',
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      padding: 'var(--space-4)',
      fontSize: '0.9375rem',
      fontFamily: 'inherit',
      color: 'var(--text-primary)',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      resize: 'vertical',
      outline: 'none',
      transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    },
    actionBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      width: '100%',
      padding: 'var(--space-4)',
      fontSize: '0.9375rem',
      fontWeight: '600',
      color: 'var(--text-inverse)',
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
    },
    backBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      width: '100%',
      padding: 'var(--space-3)',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--text-secondary)',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
    },
    alert: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      padding: 'var(--space-4)',
      marginBottom: 'var(--space-4)',
      backgroundColor: 'var(--color-error-light)',
      border: '1px solid rgba(220, 38, 38, 0.2)',
      borderRadius: 'var(--radius-lg)',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-16) var(--space-6)',
      color: 'var(--text-tertiary)',
    },
    errorContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-16) var(--space-6)',
      textAlign: 'center',
    },
    errorIcon: {
      width: '64px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-error-light)',
      borderRadius: 'var(--radius-xl)',
      color: 'var(--color-error)',
      marginBottom: 'var(--space-4)',
    },
  }

  if (loading) {
    return (
      <Layout title="Review Assignment">
        <div style={styles.loadingContainer}>
          <Loader2 size={36} className="animate-spin animate-float" style={{ marginBottom: 'var(--space-4)', color: 'var(--accent-500)' }} />
          <span style={{ fontSize: '0.9375rem', fontWeight: '500' }}>Loading assignment details...</span>
        </div>
      </Layout>
    )
  }

  if (!assignment) {
    return (
      <Layout title="Review Assignment">
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>
            <AlertCircle size={28} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
            Assignment Not Found
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' }}>
            This assignment doesn't exist or you don't have permission to review it.
          </p>
          <button
            onClick={() => navigate(-1)}
            style={styles.backBtn}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Review Assignment">
      <style>{animationStyles}</style>

      <div className="review-page-bg" style={styles.pageWrapper}>
        <div className="content-wrapper">
          <div style={styles.contentGrid} className="review-grid">

            <div style={styles.mainColumn} className="animate-fade-in-up">

              <div style={styles.card} className="glass-card info-card">
                <div style={styles.cardHeader}>
                  <div style={styles.cardHeaderIcon} className="animate-float">
                    <FileText size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 style={styles.cardTitle}>{assignment.title}</h2>
                    <p style={styles.cardSubtitle}>Assignment Details</p>
                  </div>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.detailGrid} className="detail-grid">
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>
                        <BookOpen size={12} />
                        Subject
                      </span>
                      <span style={styles.detailValue}>
                        {assignment.subject || assignment.category || 'N/A'}
                      </span>
                    </div>

                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>
                        <Clock size={12} />
                        Status
                      </span>
                      <span style={styles.statusBadge}>
                        <Clock size={12} />
                        Pending HOD Approval
                      </span>
                    </div>

                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>
                        <User size={12} />
                        Student
                      </span>
                      <span style={styles.detailValue}>{assignment.studentEmail}</span>
                    </div>

                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>
                        <Calendar size={12} />
                        Submitted
                      </span>
                      <span style={styles.detailValue}>{formatDate(assignment.submittedAt)}</span>
                    </div>
                  </div>

                  {assignment.description && (
                    <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-light)' }}>
                      <span style={{ ...styles.detailLabel, marginBottom: 'var(--space-3)', display: 'flex' }}>
                        <MessageSquare size={12} />
                        Description
                      </span>
                      <p style={{
                        fontSize: '0.9375rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {assignment.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.card} className="glass-card info-card">
                <div style={styles.cardBody}>
                  <div style={styles.professorCard}>
                    <div style={styles.professorHeader}>
                      <div style={styles.professorIcon}>
                        <UserCheck size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 style={styles.professorTitle}>Professor Review</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--accent-600)' }}>Approved & forwarded to HOD</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }} className="professor-grid">
                      <div style={styles.detailItem}>
                        <span style={{ ...styles.detailLabel, color: 'var(--accent-700)' }}>Reviewed By</span>
                        <span style={{ ...styles.detailValue, color: 'var(--accent-900)' }}>
                          {assignment.professorReviewedBy?.name || assignment.professorReviewedBy?.email || 'N/A'}
                        </span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={{ ...styles.detailLabel, color: 'var(--accent-700)' }}>Reviewed At</span>
                        <span style={{ ...styles.detailValue, color: 'var(--accent-900)' }}>
                          {formatDate(assignment.professorReviewedAt)}
                        </span>
                      </div>
                      {assignment.professorRemarks && (
                        <div style={{ ...styles.detailItem, gridColumn: 'span 2' }}>
                          <span style={{ ...styles.detailLabel, color: 'var(--accent-700)' }}>Professor Remarks</span>
                          <span style={{ ...styles.detailValue, color: 'var(--accent-900)' }}>
                            {assignment.professorRemarks}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.card} className="glass-card info-card">
                <div style={styles.cardBody}>
                  <span style={{ ...styles.detailLabel, marginBottom: 'var(--space-4)', display: 'flex' }}>
                    <FileCheck size={12} />
                    Attached Document
                  </span>
                  <div style={styles.fileCard}>
                    <div style={styles.fileInfo}>
                      <div style={styles.fileIcon} className="animate-float">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.9375rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                          {assignment.originalName || 'assignment.pdf'}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          Click to download and review
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDownload}
                      style={styles.downloadBtn}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-700)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-600)'}
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="decision-panel-wrapper animate-slide-in-right">
              <div style={{ ...styles.card, ...styles.decisionPanel }} className="decision-panel">
                <div style={styles.decisionHeader}>
                  <div style={styles.decisionIcon}>
                    <Shield size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 style={styles.decisionTitle}>Final Decision</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>HOD Authority</p>
                  </div>
                </div>

                <div style={styles.decisionBody}>
                  {error && (
                    <div style={styles.alert}>
                      <AlertCircle size={16} style={{ color: 'var(--color-error)', flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-error)' }}>{error}</p>
                    </div>
                  )}

                  <div style={{ marginBottom: 'var(--space-5)' }}>
                    <label style={{ ...styles.detailLabel, marginBottom: 'var(--space-3)', display: 'flex' }}>
                      <MessageSquare size={12} />
                      Your Remarks / Feedback
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => {
                        setRemarks(e.target.value)
                        setError('')
                      }}
                      style={styles.textarea}
                      placeholder="Enter your remarks here...&#10;(Required for rejection)"
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent-500)'
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-100)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-light)'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <button
                      onClick={handleApprove}
                      disabled={submitting}
                      className="btn-approve"
                      style={{
                        ...styles.actionBtn,
                        opacity: submitting ? 0.7 : 1,
                        cursor: submitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} />
                          Approve & Submit
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleReject}
                      disabled={submitting}
                      className="btn-reject"
                      style={{
                        ...styles.actionBtn,
                        opacity: submitting ? 0.7 : 1,
                        cursor: submitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <XCircle size={18} />
                          Reject Assignment
                        </>
                      )}
                    </button>

                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                      <button
                        onClick={() => navigate(-1)}
                        disabled={submitting}
                        style={styles.backBtn}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-200)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                      >
                        <ArrowLeft size={16} />
                        Go Back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ReviewAssignment
