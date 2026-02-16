import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../services/api'
import {
  Search,
  Users,
  User,
  Mail,
  ChevronRight,
  Loader2,
  UserX,
  GraduationCap
} from 'lucide-react'

const Students = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await api.get('/professor/students')
      setStudents(response.data.students)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student =>
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
      backgroundColor: '#d1fae5',
      borderRadius: 'var(--radius-xl)',
      color: '#059669',
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
    searchCard: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-5)',
      marginBottom: 'var(--space-5)',
      boxShadow: 'var(--shadow-card)',
    },
    searchWrapper: {
      position: 'relative',
    },
    searchIcon: {
      position: 'absolute',
      left: 'var(--space-4)',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--gray-400)',
      pointerEvents: 'none',
    },
    searchInput: {
      width: '100%',
      padding: 'var(--space-3) var(--space-4)',
      paddingLeft: 'var(--space-10)',
      fontSize: '0.9375rem',
      color: 'var(--text-primary)',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      outline: 'none',
      transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
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
    studentCell: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'var(--accent-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--accent-600)',
      fontWeight: '600',
      fontSize: '0.9375rem',
      flexShrink: 0,
    },
    studentName: {
      fontWeight: '500',
      color: 'var(--text-primary)',
    },
    emailText: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontSize: '0.875rem',
    },
    actionLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      padding: 'var(--space-2) var(--space-3)',
      fontSize: '0.8125rem',
      fontWeight: '500',
      backgroundColor: 'var(--accent-50)',
      color: 'var(--accent-600)',
      border: '1px solid var(--accent-200)',
      borderRadius: 'var(--radius-md)',
      textDecoration: 'none',
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
    summaryText: {
      marginTop: 'var(--space-4)',
      fontSize: '0.8125rem',
      color: 'var(--text-tertiary)',
    },
  }

  if (loading) {
    return (
      <Layout title="Students">
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={styles.loadingContainer}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: 'var(--space-3)', color: 'var(--accent-500)' }} />
          <span style={{ fontSize: '0.875rem' }}>Loading students...</span>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Students">
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
        .header-section {
          animation: slideInUp 0.5s ease-out forwards;
        }
        .search-card {
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
        .search-input:focus {
          border-color: var(--accent-500);
          box-shadow: 0 0 0 3px var(--accent-100);
        }
        .action-link:hover {
          background-color: var(--accent-100);
        }
        .header-icon {
          transition: transform 0.3s ease;
        }
        .header-icon:hover {
          transform: scale(1.1) rotate(5deg);
        }
        @media (max-width: 640px) {
          .hide-mobile { display: none; }
        }
      `}</style>

      <div style={styles.pageContainer}>
        {/* Header */}
        <div style={styles.headerSection} className="header-section">
          <div style={styles.headerContent}>
            <div style={styles.headerIcon} className="header-icon">
              <GraduationCap size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={styles.headerTitle}>Students</h1>
              <p style={styles.headerSubtitle}>{students.length} students in your department</p>
            </div>
          </div>
        </div>

        {/* Search Card */}
        <div style={styles.searchCard} className="search-card">
          <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              className="search-input"
            />
          </div>
        </div>

        {/* Students Table */}
        <div style={styles.tableCard} className="table-card">
          {filteredStudents.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead style={styles.tableHead}>
                  <tr>
                    <th style={styles.th}>Student</th>
                    <th style={styles.th} className="hide-mobile">Email</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student._id}
                      style={{
                        ...styles.tr,
                        animation: `fadeIn 0.3s ease-out ${0.3 + index * 0.05}s forwards`,
                        opacity: 0,
                      }}
                      className="table-row"
                    >
                      <td style={styles.td}>
                        <div style={styles.studentCell}>
                          <div style={styles.avatar}>
                            {student.name ? student.name.charAt(0).toUpperCase() : student.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={styles.studentName}>{student.name || 'No Name'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td} className="hide-mobile">
                        <div style={styles.emailText}>
                          <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                          <span>{student.email}</span>
                        </div>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <Link
                          to={`/professor/students/${encodeURIComponent(student.email)}/assignments`}
                          style={styles.actionLink}
                          className="action-link"
                        >
                          View Assignments
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <UserX size={28} />
              </div>
              <h3 style={styles.emptyTitle}>No students found</h3>
              <p style={styles.emptyText}>
                {searchTerm ? 'Try adjusting your search terms.' : 'No students in your department yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <p style={styles.summaryText}>
          Showing {filteredStudents.length} of {students.length} students
        </p>
      </div>
    </Layout>
  )
}

export default Students
