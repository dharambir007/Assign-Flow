import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../services/api'
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Building2
} from 'lucide-react'

const DepartmentList = () => {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/admin/departments')
      setDepartments(response.data.departments || [])
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this department?')) return
    try {
      await api.delete(`/admin/departments/${id}`)
      fetchDepartments()
    } catch (error) {
      console.error('Error deleting department:', error)
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
      backgroundColor: '#f3e8ff',
      borderRadius: 'var(--radius-xl)',
      color: '#7c3aed',
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
    addButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-3) var(--space-4)',
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
    tableCard: {
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '192px',
      color: 'var(--text-tertiary)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      borderBottom: '1px solid var(--border-light)',
      backgroundColor: 'var(--bg-secondary)',
    },
    tableHeaderCell: {
      padding: 'var(--space-4) var(--space-5)',
      textAlign: 'left',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: 'var(--text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    tableHeaderCellRight: {
      padding: 'var(--space-4) var(--space-5)',
      textAlign: 'right',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: 'var(--text-tertiary)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    tableRow: {
      borderBottom: '1px solid var(--border-light)',
      transition: 'background-color var(--transition-fast)',
    },
    tableCell: {
      padding: 'var(--space-4) var(--space-5)',
    },
    tableCellRight: {
      padding: 'var(--space-4) var(--space-5)',
      textAlign: 'right',
    },
    deptInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
    },
    deptIcon: {
      width: '32px',
      height: '32px',
      borderRadius: 'var(--radius-lg)',
      backgroundColor: '#f3e8ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#7c3aed',
    },
    deptName: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--text-primary)',
    },
    deptCode: {
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      fontFamily: 'monospace',
    },
    dateText: {
      fontSize: '0.875rem',
      color: 'var(--text-tertiary)',
    },
    actionsRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 'var(--space-1)',
    },
    actionButton: {
      padding: 'var(--space-2)',
      color: 'var(--text-muted)',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
    },
    emptyState: {
      padding: 'var(--space-12) var(--space-5)',
      textAlign: 'center',
    },
    emptyIcon: {
      color: 'var(--text-muted)',
      marginBottom: 'var(--space-2)',
    },
    emptyText: {
      fontSize: '0.875rem',
      color: 'var(--text-tertiary)',
      marginBottom: 'var(--space-3)',
    },
    emptyLink: {
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      textDecoration: 'none',
    },
  }

  return (
    <Layout title="Departments">
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
        .table-card {
          animation: scaleIn 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        .table-row:hover {
          background-color: var(--bg-secondary);
        }
        .add-button:hover {
          background-color: var(--accent-700);
          transform: translateY(-1px);
        }
        .action-button:hover {
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
        }
        .action-button-delete:hover {
          background-color: #fee2e2;
          color: #dc2626;
        }
        .header-icon {
          transition: transform 0.3s ease;
        }
        .header-icon:hover {
          transform: scale(1.1) rotate(5deg);
        }
        .dept-icon {
          transition: transform 0.2s ease;
        }
        .table-row:hover .dept-icon {
          transform: scale(1.1);
        }
      `}</style>

      <div style={styles.pageContainer}>
        {/* Header */}
        <div style={styles.headerSection} className="header-section">
          <div style={styles.headerContent}>
            <div style={styles.headerIcon} className="header-icon">
              <Building2 size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={styles.headerTitle}>Departments</h1>
              <p style={styles.headerSubtitle}>{departments.length} departments</p>
            </div>
          </div>
          <Link
            to="/admin/departments/create"
            style={styles.addButton}
            className="add-button"
          >
            <Plus size={16} />
            Add Department
          </Link>
        </div>

        {/* Table */}
        <div style={styles.tableCard} className="table-card">
          {loading ? (
            <div style={styles.loadingContainer}>
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : departments.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.tableHeaderCell}>Department</th>
                    <th style={styles.tableHeaderCell}>Code</th>
                    <th style={styles.tableHeaderCell}>Created</th>
                    <th style={styles.tableHeaderCellRight}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept, index) => (
                    <tr
                      key={dept._id}
                      style={{
                        ...styles.tableRow,
                        animation: `fadeIn 0.3s ease-out ${0.1 * index}s forwards`,
                        opacity: 0,
                      }}
                      className="table-row"
                    >
                      <td style={styles.tableCell}>
                        <div style={styles.deptInfo}>
                          <div style={styles.deptIcon} className="dept-icon">
                            <Building2 size={14} />
                          </div>
                          <span style={styles.deptName}>{dept.departmentName}</span>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.deptCode}>{dept.departmentCode}</span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.dateText}>
                          {new Date(dept.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td style={styles.tableCellRight}>
                        <div style={styles.actionsRow}>
                          <Link
                            to={`/admin/departments/edit/${dept._id}`}
                            style={styles.actionButton}
                            className="action-button"
                          >
                            <Edit2 size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(dept._id)}
                            style={styles.actionButton}
                            className="action-button action-button-delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <Building2 size={24} style={styles.emptyIcon} />
              <p style={styles.emptyText}>No departments yet</p>
              <Link
                to="/admin/departments/create"
                style={styles.emptyLink}
              >
                Add a department →
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default DepartmentList
