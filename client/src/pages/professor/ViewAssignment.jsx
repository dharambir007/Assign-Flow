import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../services/api'
import {
  FileText,
  Download,
  ArrowLeft,
  User,
  Calendar,
  Clock,
  MessageSquare,
  Loader2,
  AlertCircle,
  BookOpen,
  UserCheck,
  CheckCircle,
  XCircle,
  Shield,
  Layers,
  FileCheck,
  Send
} from 'lucide-react'

const ViewAssignment = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAssignment()
  }, [id])

  const fetchAssignment = async () => {
    try {
      const response = await api.get(`/professor/assignments/${id}`)
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
      console.log('Initiating download for ID:', id);
      const response = await api.get(`/professor/assignments/${id}/download`);

      if (response.data.downloadUrl) {
        console.log('Opening Cloudinary URL:', response.data.downloadUrl);
        window.open(response.data.downloadUrl, '_blank');
      } else {
        throw new Error("Download URL not found");
      }
    } catch (error) {
      console.error('Error downloading file:', error)
      alert(error.response?.data?.message || error.message || 'Failed to download file')
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

  // CSS Animations and responsive styles
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
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-6px);
      }
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
    
    .animate-slide-down {
      animation: slideDown 0.4s ease-out forwards;
    }
    
    .view-page-bg {
      position: relative;
      overflow: hidden;
    }
    
    .view-page-bg::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 15% 30%, rgba(99, 102, 241, 0.04) 0%, transparent 50%),
        radial-gradient(circle at 85% 70%, rgba(99, 102, 241, 0.03) 0%, transparent 50%);
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
    
    .info-card {
      transition: all 0.3s ease;
    }
    
    .info-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    .review-section {
      animation: slideDown 0.5s ease-out forwards;
    }
    
    .review-section:nth-child(2) {
      animation-delay: 0.1s;
    }
    
    .review-section:nth-child(3) {
      animation-delay: 0.2s;
    }
    
    @media (max-width: 768px) {
      .detail-grid {
        grid-template-columns: 1fr !important;
      }
      .review-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `

  // Styles
  const styles = {
    pageWrapper: {
      maxWidth: '900px',
      margin: '0 auto',
    },
    headerCard: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-card)',
      padding: 'var(--space-6)',
      marginBottom: 'var(--space-5)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 'var(--space-4)',
    },
    headerContent: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-4)',
      flex: 1,
      minWidth: '280px',
    },
    headerIcon: {
      width: '52px',
      height: '52px',
      borderRadius: 'var(--radius-xl)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--accent-50)',
      color: 'var(--accent-600)',
      flexShrink: 0,
    },
    headerTitle: {
      fontSize: '1.375rem',
      fontWeight: '700',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-1)',
      lineHeight: 1.3,
    },
    headerSubtitle: {
      fontSize: '0.875rem',
      color: 'var(--text-tertiary)',
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      fontSize: '0.8125rem',
      fontWeight: '600',
      borderRadius: 'var(--radius-lg)',
    },
    card: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
      marginBottom: 'var(--space-5)',
    },
    cardHeader: {
      padding: 'var(--space-4) var(--space-5)',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      backgroundColor: 'var(--bg-secondary)',
    },
    cardHeaderIcon: {
      width: '32px',
      height: '32px',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: 'var(--text-primary)',
    },
    cardBody: {
      padding: 'var(--space-5)',
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
    descriptionBox: {
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)',
      fontSize: '0.9375rem',
      color: 'var(--text-secondary)',
      lineHeight: 1.7,
      whiteSpace: 'pre-wrap',
    },
    reviewCard: {
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
      marginBottom: 'var(--space-4)',
    },
    reviewHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginBottom: 'var(--space-4)',
    },
    reviewIcon: {
      width: '36px',
      height: '36px',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    reviewTitle: {
      fontSize: '0.9375rem',
      fontWeight: '600',
    },
    reviewSubtitle: {
      fontSize: '0.75rem',
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
    backBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-3) var(--space-5)',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--text-secondary)',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
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
      <Layout title="View Assignment">
        <div style={styles.loadingContainer}>
          <Loader2 size={36} className="animate-spin animate-float" style={{ marginBottom: 'var(--space-4)', color: 'var(--accent-500)' }} />
          <span style={{ fontSize: '0.9375rem', fontWeight: '500' }}>Loading assignment details...</span>
        </div>
      </Layout>
    )
  }

  if (!assignment) {
    return (
      <Layout title="View Assignment">
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>
            <AlertCircle size={28} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
            Assignment Not Found
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' }}>
            {error || "This assignment doesn't exist or you don't have permission to view it."}
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

  const statusConfig = getStatusConfig(assignment.status)
  const StatusIcon = statusConfig.icon

  return (
    <Layout title="View Assignment">
      <style>{animationStyles}</style>

      <div className="view-page-bg">
        <div className="content-wrapper">
          <div style={styles.pageWrapper} className="animate-fade-in-up">

            {/* Header Card */}
            <div style={styles.headerCard} className="glass-card info-card">
              <div style={styles.headerContent}>
                <div style={styles.headerIcon} className="animate-float">
                  <FileText size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h1 style={styles.headerTitle}>{assignment.title}</h1>
                  <p style={styles.headerSubtitle}>
                    Submitted by {assignment.studentEmail}
                  </p>
                </div>
              </div>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: statusConfig.bgColor,
                color: statusConfig.textColor,
              }}>
                <StatusIcon size={14} />
                {statusConfig.label}
              </span>
            </div>

            {/* Details Card */}
            <div style={styles.card} className="glass-card info-card">
              <div style={styles.cardHeader}>
                <div style={{ ...styles.cardHeaderIcon, backgroundColor: 'var(--accent-100)', color: 'var(--accent-600)' }}>
                  <BookOpen size={16} />
                </div>
                <span style={styles.cardTitle}>Assignment Details</span>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.detailGrid} className="detail-grid">
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>
                      <BookOpen size={12} />
                      Subject
                    </span>
                    <span style={styles.detailValue}>
                      {assignment.subject || 'N/A'}
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
                      Submitted At
                    </span>
                    <span style={styles.detailValue}>{formatDate(assignment.submittedAt)}</span>
                  </div>

                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>
                      <Layers size={12} />
                      Current Level
                    </span>
                    <span style={{ ...styles.detailValue, textTransform: 'capitalize' }}>
                      {assignment.currentLevel || 'N/A'}
                    </span>
                  </div>
                </div>

                {assignment.description && (
                  <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-light)' }}>
                    <span style={{ ...styles.detailLabel, marginBottom: 'var(--space-3)', display: 'flex' }}>
                      <MessageSquare size={12} />
                      Description
                    </span>
                    <div style={styles.descriptionBox}>
                      {assignment.description}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Review History Card */}
            {(assignment.professorReviewedAt || assignment.hodReviewedAt) && (
              <div style={styles.card} className="glass-card info-card">
                <div style={styles.cardHeader}>
                  <div style={{ ...styles.cardHeaderIcon, backgroundColor: 'var(--color-info-light)', color: 'var(--color-info)' }}>
                    <Clock size={16} />
                  </div>
                  <span style={styles.cardTitle}>Review History</span>
                </div>
                <div style={styles.cardBody}>

                  {/* Professor Review */}
                  {assignment.professorReviewedAt && (
                    <div
                      className="review-section"
                      style={{
                        ...styles.reviewCard,
                        backgroundColor: 'var(--accent-50)',
                        border: '1px solid var(--accent-100)',
                      }}
                    >
                      <div style={styles.reviewHeader}>
                        <div style={{ ...styles.reviewIcon, backgroundColor: 'var(--accent-600)', color: 'var(--text-inverse)' }}>
                          <UserCheck size={18} />
                        </div>
                        <div>
                          <h3 style={{ ...styles.reviewTitle, color: 'var(--accent-800)' }}>Professor Review</h3>
                          <p style={{ ...styles.reviewSubtitle, color: 'var(--accent-600)' }}>Reviewed by you</p>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }} className="review-grid">
                        <div style={styles.detailItem}>
                          <span style={{ ...styles.detailLabel, color: 'var(--accent-700)' }}>Reviewed At</span>
                          <span style={{ ...styles.detailValue, color: 'var(--accent-900)' }}>
                            {formatDate(assignment.professorReviewedAt)}
                          </span>
                        </div>
                        {assignment.professorRemarks && (
                          <div style={{ ...styles.detailItem, gridColumn: 'span 2' }}>
                            <span style={{ ...styles.detailLabel, color: 'var(--accent-700)' }}>Remarks</span>
                            <span style={{ ...styles.detailValue, color: 'var(--accent-900)' }}>
                              {assignment.professorRemarks}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* HOD Review */}
                  {assignment.hodReviewedAt && (
                    <div
                      className="review-section"
                      style={{
                        ...styles.reviewCard,
                        backgroundColor: assignment.status === 'Rejected' ? 'var(--color-error-light)' : 'var(--color-success-light)',
                        border: `1px solid ${assignment.status === 'Rejected' ? 'rgba(220, 38, 38, 0.2)' : 'rgba(5, 150, 105, 0.2)'}`,
                        marginBottom: 0,
                      }}
                    >
                      <div style={styles.reviewHeader}>
                        <div style={{
                          ...styles.reviewIcon,
                          backgroundColor: assignment.status === 'Rejected' ? 'var(--color-error)' : 'var(--color-success)',
                          color: 'var(--text-inverse)'
                        }}>
                          <Shield size={18} />
                        </div>
                        <div>
                          <h3 style={{
                            ...styles.reviewTitle,
                            color: assignment.status === 'Rejected' ? '#991B1B' : '#065F46'
                          }}>
                            HOD Review
                          </h3>
                          <p style={{
                            ...styles.reviewSubtitle,
                            color: assignment.status === 'Rejected' ? 'var(--color-error)' : 'var(--color-success)'
                          }}>
                            {assignment.status === 'Rejected' ? 'Assignment Rejected' : 'Final Approval Granted'}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }} className="review-grid">
                        <div style={styles.detailItem}>
                          <span style={{
                            ...styles.detailLabel,
                            color: assignment.status === 'Rejected' ? '#991B1B' : '#065F46'
                          }}>Reviewed At</span>
                          <span style={{
                            ...styles.detailValue,
                            color: assignment.status === 'Rejected' ? '#7F1D1D' : '#064E3B'
                          }}>
                            {formatDate(assignment.hodReviewedAt)}
                          </span>
                        </div>
                        {assignment.hodRemarks && (
                          <div style={{ ...styles.detailItem, gridColumn: 'span 2' }}>
                            <span style={{
                              ...styles.detailLabel,
                              color: assignment.status === 'Rejected' ? '#991B1B' : '#065F46'
                            }}>Remarks</span>
                            <span style={{
                              ...styles.detailValue,
                              color: assignment.status === 'Rejected' ? '#7F1D1D' : '#064E3B'
                            }}>
                              {assignment.hodRemarks}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* File Download Card */}
            <div style={styles.card} className="glass-card info-card">
              <div style={styles.cardHeader}>
                <div style={{ ...styles.cardHeaderIcon, backgroundColor: 'var(--accent-100)', color: 'var(--accent-600)' }}>
                  <FileCheck size={16} />
                </div>
                <span style={styles.cardTitle}>Attached Document</span>
              </div>
              <div style={styles.cardBody}>
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
                        Click to download the document
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

            {/* Back Button */}
            <div style={{ paddingTop: 'var(--space-2)' }}>
              <button
                onClick={() => navigate(-1)}
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
    </Layout>
  )
}

export default ViewAssignment
