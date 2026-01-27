import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Building2,
    Users2,
    BookOpen,
    FileUp,
    CheckSquare,
    LogOut,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Layers
} from 'lucide-react'

const Sidebar = ({ user, logout, isCollapsed, setIsCollapsed }) => {
    const location = useLocation()

    const getNavLinks = () => {
        if (user?.role === 'admin') {
            return [
                { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { to: '/admin/departments', label: 'Departments', icon: Building2 },
                { to: '/admin/users', label: 'Users', icon: Users2 },
            ]
        }
        if (user?.role === 'professor') {
            return [
                { to: '/professor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { to: '/professor/assignments', label: 'Assignments', icon: CheckSquare },
                { to: '/professor/students', label: 'Students', icon: GraduationCap },
            ]
        }
        if (user?.role === 'hod') {
            return [
                { to: '/hod/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { to: '/hod/assignments', label: 'Approvals', icon: CheckSquare },
            ]
        }
        if (user?.role === 'student') {
            return [
                { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { to: '/student/upload', label: 'Upload', icon: FileUp },
                { to: '/student/bulk-upload', label: 'Bulk Upload', icon: Layers },
                { to: '/student/assignments', label: 'Submissions', icon: BookOpen },
            ]
        }
        return [{ to: '/home', label: 'Home', icon: LayoutDashboard }]
    }

    const links = getNavLinks()

    const styles = {
        sidebar: {
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            backgroundColor: 'var(--bg-primary)',
            borderRight: '1px solid var(--border-light)',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            width: isCollapsed ? '72px' : '260px',
            boxShadow: 'var(--shadow-lg)',
        },
        logoSection: {
            height: '64px', // Reduced height for cleaner look
            display: 'flex',
            alignItems: 'center',
            padding: isCollapsed ? '0' : '0 var(--space-6)',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            borderBottom: '1px solid var(--border-light)',
            flexShrink: 0,
        },
        logoIcon: {
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--accent-600)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-inverse)',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
        },
        logoText: {
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginLeft: 'var(--space-3)',
            whiteSpace: 'nowrap',
            opacity: isCollapsed ? 0 : 1,
            transition: 'opacity 0.2s',
            overflow: 'hidden',
        },
        nav: {
            flex: 1,
            padding: 'var(--space-4) var(--space-3)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)',
        },
        navLink: (isActive) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-xl)', // More rounded
            fontSize: '0.9375rem',
            fontWeight: isActive ? '600' : '500',
            color: isActive ? 'var(--accent-600)' : 'var(--text-secondary)',
            backgroundColor: isActive ? 'var(--accent-50)' : 'transparent',
            textDecoration: 'none',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            transition: 'all var(--transition-fast)',
            position: 'relative',
        }),
        iconWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        },
        labelText: {
            whiteSpace: 'nowrap',
            opacity: isCollapsed ? 0 : 1,
            transition: 'opacity 0.2s',
            overflow: 'hidden',
        },
        footer: {
            padding: 'var(--space-4)',
            borderTop: '1px solid var(--border-light)',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
        },
        signOutBtn: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-xl)',
            fontSize: '0.9375rem',
            fontWeight: '500',
            color: 'var(--text-secondary)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            transition: 'all var(--transition-fast)',
        },
        collapseBtn: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-2)',
            color: 'var(--text-tertiary)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'color var(--transition-fast)',
            marginTop: 'var(--space-2)',
        },
        tooltip: {
            position: 'absolute',
            left: 'calc(100% + 10px)',
            backgroundColor: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 100,
            opacity: 0,
            transform: 'translateX(-5px)',
            transition: 'all 0.2s',
        }
    }

    return (
        <aside style={styles.sidebar}>
            {/* Logo */}
            <div style={styles.logoSection}>
                <div style={styles.logoIcon}>
                    <BookOpen size={18} strokeWidth={2.5} />
                </div>
                {!isCollapsed && (
                    <span style={styles.logoText}>AssignFlow</span>
                )}
            </div>

            {/* Navigation */}
            <nav style={styles.nav}>
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + '/')

                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            title={isCollapsed ? link.label : undefined}
                            style={styles.navLink(isActive)}
                            className={`nav-link ${isActive ? 'active' : ''}`}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                                    e.currentTarget.style.color = 'var(--text-primary)'
                                    e.currentTarget.querySelector('.icon-wrapper').style.transform = 'scale(1.1)'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                    e.currentTarget.style.color = 'var(--text-secondary)'
                                    e.currentTarget.querySelector('.icon-wrapper').style.transform = 'scale(1)'
                                }
                            }}
                        >
                            <div className="icon-wrapper" style={{ ...styles.iconWrapper, transition: 'transform 0.2s' }}>
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            {!isCollapsed && <span style={styles.labelText}>{link.label}</span>}

                            {/* Active Indicator Strip */}
                            {isActive && !isCollapsed && (
                                <div style={{
                                    position: 'absolute',
                                    right: '0',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '3px',
                                    height: '20px',
                                    backgroundColor: 'var(--accent-600)',
                                    borderRadius: '4px 0 0 4px',
                                }} />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div style={styles.footer}>
                <button
                    onClick={logout}
                    title={isCollapsed ? 'Sign out' : undefined}
                    style={styles.signOutBtn}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-error-light)'
                        e.currentTarget.style.color = 'var(--color-error)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span>Sign out</span>}
                </button>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={styles.collapseBtn}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
