import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Bell, User, LogOut, ChevronDown } from 'lucide-react'

const Header = ({ user, title, logout }) => {
    const [showDropdown, setShowDropdown] = useState(false)
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
    const buttonRef = useRef(null)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Calculate dropdown position when it opens
    useEffect(() => {
        if (showDropdown && buttonRef.current) {
            const updatePosition = () => {
                const rect = buttonRef.current.getBoundingClientRect()
                setDropdownPosition({
                    top: rect.bottom + 8,
                    right: window.innerWidth - rect.right
                })
            }
            updatePosition()
            window.addEventListener('scroll', updatePosition, true)
            window.addEventListener('resize', updatePosition)
            return () => {
                window.removeEventListener('scroll', updatePosition, true)
                window.removeEventListener('resize', updatePosition)
            }
        }
    }, [showDropdown])

    const styles = {
        header: {
            height: '56px',
            backgroundColor: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-light)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '0 var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
        },
        title: {
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'var(--text-primary)',
        },
        rightSection: {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
        },
        notificationBtn: {
            padding: 'var(--space-2)',
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
        },
        userButton: {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '6px var(--space-3)',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
        },
        avatar: {
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--accent-100)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-600)',
            fontSize: '0.8125rem',
            fontWeight: '600',
        },
        userName: {
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            fontWeight: '500',
        },
        chevron: {
            color: 'var(--text-muted)',
            transition: 'transform var(--transition-fast)',
        },
        // Portal dropdown styles
        dropdown: {
            position: 'fixed',
            width: '240px',
            backgroundColor: 'var(--bg-primary, #ffffff)',
            border: '1px solid var(--border-light, #e2e8f0)',
            borderRadius: 'var(--radius-xl, 12px)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            zIndex: 99999, // Super high z-index
        },
        dropdownHeader: {
            padding: '16px', 
            borderBottom: '1px solid #e2e8f0', 
            backgroundColor: '#f8fafc', 
        },
        dropdownEmail: {
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#1e293b', // Fallback for var(--text-primary)
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        dropdownRole: {
            fontSize: '0.75rem',
            fontWeight: '500',
            color: '#4f46e5', // Fallback accent
            textTransform: 'capitalize',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            backgroundColor: '#eef2ff', // Fallback accent-50
            borderRadius: '6px',
        },
        signOutBtn: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#64748b', // Fallback text-secondary
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            textAlign: 'left',
        },
        signOutIcon: {
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
        },
    }

    // Since basic CSS variables might not work easily in a Portal if they are scoped (though usually they are on :root),
    // I added fallbacks. But if the app has everything on :root (which is best practice for vars), it should work fine.
    // Let's assume standard :root vars.

    const PortalDropdown = () => {
        return createPortal(
            <div
                ref={dropdownRef}
                style={{
                    ...styles.dropdown,
                    top: dropdownPosition.top,
                    right: dropdownPosition.right,
                    // Re-apply css vars if needed, but assuming they work from root
                    backgroundColor: 'var(--bg-primary, #ffffff)',
                    border: '1px solid var(--border-light, #e2e8f0)',
                }}
                className="dropdown-animate"
            >
                <div style={{
                    ...styles.dropdownHeader,
                    backgroundColor: 'var(--bg-secondary, #f8fafc)',
                    borderBottom: '1px solid var(--border-light, #e2e8f0)'
                }}>
                    <p style={{ ...styles.dropdownEmail, color: 'var(--text-primary, #1e293b)' }}>{user?.email}</p>
                    <span style={{
                        ...styles.dropdownRole,
                        color: 'var(--accent-600, #4f46e5)',
                        backgroundColor: 'var(--accent-50, #eef2ff)'
                    }}>{user?.role}</span>
                </div>
                <div style={{ padding: '8px' }}>
                    <button
                        onClick={() => {
                            setShowDropdown(false)
                            logout()
                        }}
                        style={styles.signOutBtn}
                        className="sign-out-btn"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-error-light, #fee2e2)'
                            e.currentTarget.style.color = 'var(--color-error, #dc2626)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = 'var(--text-secondary, #64748b)'
                        }}
                    >
                        <div style={styles.signOutIcon}>
                            <LogOut size={16} />
                        </div>
                        Sign out
                    </button>
                </div>
            </div>,
            document.body
        )
    }

    return (
        <>
            <style>{`
                @keyframes dropdownSlide {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .dropdown-animate {
                    animation: dropdownSlide 0.2s ease-out forwards;
                }
                .notification-btn:hover {
                    background-color: var(--bg-secondary);
                    color: var(--text-primary);
                }
                .user-button:hover {
                    background-color: var(--bg-secondary);
                }
            `}</style>
            <header style={styles.header}>
                {/* Left: Page Title */}
                <div>
                    {title && (
                        <h1 style={styles.title}>{title}</h1>
                    )}
                </div>

                {/* Right: User */}
                <div style={styles.rightSection}>
                    {/* Notifications */}
                    <button
                        style={styles.notificationBtn}
                        className="notification-btn"
                    >
                        <Bell size={18} />
                    </button>

                    {/* User Dropdown Button */}
                    <button
                        ref={buttonRef}
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={styles.userButton}
                        className="user-button"
                    >
                        <div style={styles.avatar}>
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span style={styles.userName}>
                            {user?.name || user?.email?.split('@')[0] || 'User'}
                        </span>
                        <ChevronDown
                            size={14}
                            style={{
                                ...styles.chevron,
                                transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                        />
                    </button>
                </div>
            </header>

            {/* Render dropdown via Portal */}
            {showDropdown && <PortalDropdown />}
        </>
    )
}

export default Header
