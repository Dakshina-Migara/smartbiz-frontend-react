import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function StatCard({ title, value, subtitle, valueColor, icon, iconColor }) {
    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: '14px',
                p: { xs: '16px', sm: '18px 20px', md: '22px 24px' },
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
                transition: 'box-shadow 0.3s ease, transform 0.25s ease',
                minWidth: 0,
                '&:hover': {
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: { xs: '0.78rem', md: '0.82rem' },
                        fontWeight: 500,
                        color: '#7a6e64',
                    }}
                >
                    {title}
                </Typography>
                {icon && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: { xs: 34, md: 38 },
                            height: { xs: 34, md: 38 },
                            borderRadius: '10px',
                            backgroundColor: iconColor ? `${iconColor}14` : '#f0ebe7',
                            color: iconColor || '#5a5048',
                            flexShrink: 0,
                            '& svg': {
                                width: { xs: 18, md: 20 },
                                height: { xs: 18, md: 20 },
                            },
                        }}
                    >
                        {icon}
                    </Box>
                )}
            </Box>
            <Typography
                sx={{
                    fontSize: { xs: '1.25rem', sm: '1.4rem', md: '1.6rem' },
                    fontWeight: 700,
                    color: valueColor || '#1a1a1a',
                }}
            >
                {value}
            </Typography>
            {subtitle && (
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                        fontWeight: 400,
                        color: '#9a8e84',
                    }}
                >
                    {subtitle}
                </Typography>
            )}
        </Paper>
    )
}
