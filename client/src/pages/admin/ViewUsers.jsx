import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import api from '../../services/api'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react'

const ViewUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [filterType, setFilterType] = useState(searchParams.get('type') || '')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1)
  const [totalUsers, setTotalUsers] = useState(0)

  const limit = 10
  const totalPages = Math.ceil(totalUsers / limit)

  useEffect(() => {
    fetchUsers()
  }, [currentPage, search, filterType])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/users', {
        params: { page: currentPage, search, type: filterType }
      })
      setUsers(response.data.users || [])
      setTotalUsers(response.data.totalUsers || 0)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    setSearchParams({ search, type: filterType, page: '1' })
  }

  const getRoleBadgeStyle = (role) => {
    const config = {
      student: { bg: '#d1fae5', color: '#059669' },
      professor: { bg: '#dbeafe', color: '#2563eb' },
      hod: { bg: '#fef3c7', color: '#d97706' },
      admin: { bg: '#fee2e2', color: '#dc2626' }
    }
    return config[role] || { bg: '#f1f5f9', color: '#64748b' }
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
    filtersRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-3)',
      marginBottom: 'var(--space-6)',
    },
    searchWrapper: {
      position: 'relative',
      flex: 1,
      minWidth: '200px',
      maxWidth: '400px',
    },
    searchIcon: {
      position: 'absolute',
      left: 'var(--space-3)',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--text-muted)',
      pointerEvents: 'none',
    },
    searchInput: {
      width: '100%',
      padding: 'var(--space-3) var(--space-4)',
      paddingLeft: 'var(--space-10)',
      fontSize: '0.875rem',
      color: 'var(--text-primary)',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      outline: 'none',
      transition: 'all var(--transition-fast)',
    },
    selectFilter: {
      padding: 'var(--space-3) var(--space-4)',
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      outline: 'none',
      cursor: 'pointer',
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
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
    },
    userAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: 'var(--bg-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--text-secondary)',
    },
    userName: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'var(--text-primary)',
    },
    userEmail: {
      fontSize: '0.75rem',
      color: 'var(--text-tertiary)',
    },
    roleBadge: {
      display: 'inline-block',
      padding: '4px 10px',
      fontSize: '0.75rem',
      fontWeight: '500',
      borderRadius: 'var(--radius-md)',
      textTransform: 'capitalize',
    },
    departmentText: {
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
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
    },
    paginationRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-4) var(--space-5)',
      borderTop: '1px solid var(--border-light)',
    },
    paginationText: {
      fontSize: '0.875rem',
      color: 'var(--text-tertiary)',
    },
    paginationButtons: {
      display: 'flex',
      gap: 'var(--space-1)',
    },
    paginationButton: {
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
    },
    emptyState: {
      padding: 'var(--space-12) var(--space-5)',
      textAlign: 'center',
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
    <Layout title="Users">
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
        .filters-row {
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
        .search-input:focus {
          border-color: var(--accent-500);
          box-shadow: 0 0 0 3px var(--accent-100);
        }
        .select-filter:focus {
          border-color: var(--accent-500);
          box-shadow: 0 0 0 3px var(--accent-100);
        }
        .header-icon {
          transition: transform 0.3s ease;
        }
        .header-icon:hover {
          transform: scale(1.1) rotate(5deg);
        }
        .pagination-button:hover:not(:disabled) {
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
        }
        .pagination-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      <div style={styles.pageContainer}>
        {/* Header */}
        <div style={styles.headerSection} className="header-section">
          <div style={styles.headerContent}>
            <div style={styles.headerIcon} className="header-icon">
              <Users size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={styles.headerTitle}>Users</h1>
              <p style={styles.headerSubtitle}>{totalUsers} total users</p>
            </div>
          </div>
          <Link
            to="/admin/users/create"
            style={styles.addButton}
            className="add-button"
          >
            <Plus size={16} />
            Add User
          </Link>
        </div>

        {/* Filters */}
        <div style={styles.filtersRow} className="filters-row">
          <form onSubmit={handleSearch} style={styles.searchWrapper}>
            <Search size={16} style={styles.searchIcon} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              style={styles.searchInput}
              className="search-input"
            />
          </form>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value)
              setCurrentPage(1)
              setSearchParams({ search, type: e.target.value, page: '1' })
            }}
            style={styles.selectFilter}
            className="select-filter"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="professor">Professors</option>
            <option value="hod">HODs</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* Table */}
        <div style={styles.tableCard} className="table-card">
          {loading ? (
            <div style={styles.loadingContainer}>
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : users.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.tableHeaderCell}>User</th>
                      <th style={styles.tableHeaderCell}>Role</th>
                      <th style={styles.tableHeaderCell}>Department</th>
                      <th style={styles.tableHeaderCellRight}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => {
                      const badgeStyle = getRoleBadgeStyle(user.role)
                      return (
                        <tr
                          key={user._id}
                          style={{
                            ...styles.tableRow,
                            animation: `fadeIn 0.3s ease-out ${0.1 * index}s forwards`,
                            opacity: 0,
                          }}
                          className="table-row"
                        >
                          <td style={styles.tableCell}>
                            <div style={styles.userInfo}>
                              <div style={styles.userAvatar}>
                                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p style={styles.userName}>{user.name}</p>
                                <p style={styles.userEmail}>{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td style={styles.tableCell}>
                            <span
                              style={{
                                ...styles.roleBadge,
                                backgroundColor: badgeStyle.bg,
                                color: badgeStyle.color,
                              }}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td style={styles.tableCell}>
                            <span style={styles.departmentText}>
                              {user.department?.departmentName || '—'}
                            </span>
                          </td>
                          <td style={styles.tableCellRight}>
                            <div style={styles.actionsRow}>
                              <Link
                                to={`/admin/users/edit/${user._id}`}
                                style={styles.actionButton}
                                className="action-button"
                              >
                                <Edit2 size={14} />
                              </Link>
                              <button
                                onClick={() => handleDelete(user._id)}
                                style={styles.actionButton}
                                className="action-button action-button-delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={styles.paginationRow}>
                  <span style={styles.paginationText}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <div style={styles.paginationButtons}>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={styles.paginationButton}
                      className="pagination-button"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={styles.paginationButton}
                      className="pagination-button"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No users found</p>
              <Link
                to="/admin/users/create"
                style={styles.emptyLink}
              >
                Add a user →
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default ViewUsers
