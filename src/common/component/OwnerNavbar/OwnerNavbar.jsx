import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useAuth } from '../../../context/AuthContext'
import Modal from '../Modal/Modal'
import Button from '../Button/Button'

const navItems = [
    { label: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/owner/dashboard' },
    { label: 'Products', icon: <Inventory2OutlinedIcon />, path: '/owner/products' },
    { label: 'Inventory', icon: <WarehouseOutlinedIcon />, path: '/owner/inventory' },
    { label: 'Customers', icon: <PeopleOutlinedIcon />, path: '/owner/customers' },
    { label: 'Suppliers', icon: <LocalShippingOutlinedIcon />, path: '/owner/suppliers' },
    { label: 'Sales', icon: <PointOfSaleOutlinedIcon />, path: '/owner/sales' },
    { label: 'Transactions', icon: <ReceiptLongOutlinedIcon />, path: '/owner/transactions' },
    { label: 'Reports', icon: <AssessmentOutlinedIcon />, path: '/owner/reports' },
    { label: 'AI-Insight', icon: <AutoAwesomeOutlinedIcon />, path: '/owner/ai-insight' },
    { label: 'Subscription', icon: <CardMembershipOutlinedIcon />, path: '/owner/subscription' },
]

const navItemSx = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    p: { xs: '6px 8px', sm: '8px 12px', md: '12px 20px' },
    border: 'none',
    background: 'transparent',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap',
    minWidth: { xs: 60, sm: 70, md: 90 },
    flexShrink: 0,
    '&:hover': {
        backgroundColor: '#ffffff',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
    },
}

const navItemActiveSx = {
    backgroundColor: '#ffffff !important',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
}

export default function OwnerNavbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout } = useAuth()
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
    const navbarRef = useRef(null)

    useEffect(() => {
        if (navbarRef.current) {
            const activeItem = navbarRef.current.querySelector('[data-active="true"]')
            if (activeItem) {
                activeItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                })
            }
        }
    }, [location.pathname])

    return (
        <>
            <Box
                ref={navbarRef}
                component="nav"
                sx={{
                    display: 'flex',
                    justifyContent: { xs: 'flex-start', lg: 'center' },
                    alignItems: 'center',
                    gap: { xs: '2px', sm: '4px', md: '8px' },
                    backgroundColor: { xs: '#ffffff', sm: '#f7f7f7' },
                    borderRadius: { xs: '12px', sm: '40px', md: '60px' },
                    p: { xs: '4px', sm: '6px', md: '8px' },
                    px: { xs: '4px', md: '12px' },
                    boxShadow: { xs: 'none', sm: '0 4px 15px rgba(0, 0, 0, 0.05)' },
                    borderBottom: { xs: '1px solid #eeeeee', sm: 'none' },
                    width: 'fit-content',
                    maxWidth: '100%',
                    mx: 'auto',
                    my: { xs: '10px', sm: '15px', md: '20px' },
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
            >
                {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path
                    return (
                        <ButtonBase
                            key={index}
                            data-active={isActive}
                            onClick={() => navigate(item.path)}
                            sx={{
                                ...navItemSx,
                                ...(isActive ? navItemActiveSx : {}),
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: isActive ? '#444444' : '#888888',
                                transition: 'all 0.3s ease',
                                '& svg': { width: { xs: 18, sm: 24 }, height: { xs: 18, sm: 24 }, strokeWidth: 1.5 },
                            }}>
                                {item.icon}
                            </Box>
                            <Typography sx={{
                                fontSize: { xs: '0.5rem', sm: '0.65rem' },
                                fontWeight: isActive ? 700 : 600,
                                color: isActive ? '#444444' : '#888888',
                                textTransform: 'capitalize',
                                fontFamily: "'Poppins', 'Inter', sans-serif",
                                transition: 'all 0.3s ease',
                            }}>
                                {item.label}
                            </Typography>
                        </ButtonBase>
                    )
                })}

                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        height: { xs: 28, md: 36 },
                        mx: { xs: '4px', md: '8px' },
                        alignSelf: 'center',
                        borderRadius: '2px',
                        borderColor: '#e2e8f0',
                    }}
                />

                <ButtonBase
                    onClick={() => setIsLogoutModalOpen(true)}
                    sx={{
                        ...navItemSx,
                        ml: 'auto',
                        '&:hover': {
                            backgroundColor: '#fff5f5',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 10px rgba(229, 62, 62, 0.15)',
                            '& svg, & .MuiTypography-root': { color: '#e53e3e' },
                        },
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#888888',
                        '& svg': { width: { xs: 18, sm: 24 }, height: { xs: 18, sm: 24 } },
                    }}>
                        <LogoutOutlinedIcon />
                    </Box>
                    <Typography sx={{
                        fontSize: { xs: '0.5rem', sm: '0.65rem' },
                        fontWeight: 600,
                        color: '#888888',
                        textTransform: 'capitalize',
                        fontFamily: "'Poppins', 'Inter', sans-serif",
                    }}>
                        Logout
                    </Typography>
                </ButtonBase>
            </Box>

            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                title="Confirm Logout"
            >
                <Box sx={{ textAlign: 'center', py: '20px' }}>
                    <Typography sx={{ pb: '24px', fontSize: '15px', color: '#4a5568' }}>
                        Are you sure you want to log out of your account?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setIsLogoutModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="filled"
                            onClick={() => logout()}
                            sx={{ backgroundColor: '#e53e3e', '&:hover': { backgroundColor: '#c53030' } }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}
