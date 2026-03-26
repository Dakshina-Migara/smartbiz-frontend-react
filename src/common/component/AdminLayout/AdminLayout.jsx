import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import AdminNavbar from '../AdminNavbar/AdminNavbar'

export default function AdminLayout({ children, breadcrumb }) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'background.default',
                p: { xs: '8px 5px', sm: '10px', md: '15px 20px', lg: '20px 40px' },
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: '8px', sm: '10px', md: '15px' },
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                overflowX: 'hidden',
            }}
        >
            <Box>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.1rem' },
                        color: '#999999',
                        fontWeight: 500,
                        ml: { xs: '8px', sm: '5px', md: '10px' },
                    }}
                >
                    {breadcrumb}
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    backgroundColor: '#fcfcfc',
                    borderRadius: { xs: '16px', sm: '24px', md: '30px', lg: '40px' },
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'visible',
                    pb: { xs: '10px', sm: '15px', md: '30px' },
                    width: '100%',
                }}
            >
                <AdminNavbar />
                <Box sx={{ mx: { xs: '8px', sm: '10px', md: '15px', lg: '25px' }, mb: { xs: '8px', sm: '10px', md: '25px' } }}>
                    {children}
                </Box>
            </Paper>
        </Box>
    )
}
