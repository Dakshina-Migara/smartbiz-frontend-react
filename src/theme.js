import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary: {
            main: '#3d3229',
            dark: '#2a2118',
            light: '#5a4a3e',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#7a6e64',
            light: '#9a8e84',
            contrastText: '#ffffff',
        },
        error: {
            main: '#ef4444',
            dark: '#dc2626',
        },
        warning: {
            main: '#f39c12',
        },
        success: {
            main: '#27ae60',
        },
        info: {
            main: '#3498db',
        },
        background: {
            default: '#e5e5e5',
            paper: '#fcfcfc',
        },
        text: {
            primary: '#1a1a1a',
            secondary: '#7a6e64',
            disabled: '#9a8e84',
        },
        divider: '#f0f0f0',
    },
    typography: {
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
        h1: { fontWeight: 700, color: '#1a1a1a' },
        h2: { fontWeight: 700, color: '#1a1a1a' },
        h3: { fontWeight: 700, color: '#1a1a1a' },
        h4: { fontWeight: 700, color: '#1a1a1a' },
        h5: { fontWeight: 600, color: '#1a1a1a' },
        h6: { fontWeight: 600, color: '#1a1a1a' },
        body1: { color: '#1a1a1a' },
        body2: { color: '#7a6e64' },
        caption: { color: '#9a8e84' },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '*, *::before, *::after': {
                    margin: 0,
                    padding: 0,
                    boxSizing: 'border-box',
                },
                html: {
                    fontSize: '16px',
                    WebkitTextSizeAdjust: '100%',
                    '@media (max-width: 480px)': {
                        fontSize: '14px',
                    },
                },
                body: {
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '30px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                },
                contained: {
                    backgroundColor: '#3d3229',
                    color: '#ffffff',
                    letterSpacing: '1.2px',
                    boxShadow: '0 4px 12px rgba(61, 50, 41, 0.3)',
                    '&:hover': {
                        backgroundColor: '#2a2118',
                        boxShadow: '0 6px 18px rgba(61, 50, 41, 0.45)',
                        transform: 'translateY(-1px)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                        boxShadow: '0 2px 8px rgba(61, 50, 41, 0.3)',
                    },
                },
                outlined: {
                    color: '#1a1a1a',
                    border: '2.5px solid #1a1a1a',
                    textTransform: 'none',
                    '&:hover': {
                        backgroundColor: '#1a1a1a',
                        color: '#ffffff',
                        borderColor: '#1a1a1a',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 14px rgba(26, 26, 26, 0.3)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                },
                text: {
                    color: '#3d3229',
                    fontWeight: 500,
                    letterSpacing: '0.3px',
                    textTransform: 'none',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    padding: '4px 8px',
                    '&:hover': {
                        color: '#1a1a1a',
                        textDecoration: 'underline',
                        backgroundColor: 'rgba(61, 50, 41, 0.06)',
                    },
                },
                sizeSmall: {
                    padding: '8px 24px',
                    fontSize: '0.8rem',
                    '@media (max-width: 480px)': {
                        padding: '7px 18px',
                        fontSize: '0.75rem',
                    },
                },
                sizeMedium: {
                    padding: '13px 40px',
                    fontSize: '0.9rem',
                    '@media (max-width: 480px)': {
                        padding: '11px 28px',
                        fontSize: '0.82rem',
                    },
                },
                sizeLarge: {
                    padding: '16px 56px',
                    fontSize: '1rem',
                    '@media (max-width: 480px)': {
                        padding: '13px 36px',
                        fontSize: '0.9rem',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#e8e0da',
                        borderRadius: '30px',
                        fontSize: '0.95rem',
                        color: '#2a2118',
                        transition: 'all 0.3s ease',
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '2px solid transparent',
                            transition: 'border-color 0.3s ease',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(61, 50, 41, 0.3)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#f0ebe7',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3d3229',
                                borderWidth: '2px',
                            },
                        },
                        '& .MuiOutlinedInput-input': {
                            color: '#1a1a1a',
                            caretColor: '#3d3229',
                            '&::placeholder': {
                                color: '#9a8e84',
                                fontWeight: 400,
                                opacity: 1,
                            },
                        },
                        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e53e3e !important',
                            borderWidth: '2px !important',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#7a6e64',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        '&.Mui-focused': {
                            color: '#3d3229',
                        },
                    },
                    '& .MuiFormHelperText-root.Mui-error': {
                        color: '#e53e3e',
                        fontWeight: 500,
                        marginLeft: '14px',
                        marginTop: '4px',
                        fontSize: '0.75rem',
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: '40px',
                    maxWidth: '550px',
                    width: '100%',
                    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #eee',
                    overflow: 'hidden',
                    '@media (max-width: 600px)': {
                        borderRadius: '24px 24px 0 0',
                        margin: 0,
                        maxHeight: '95vh',
                        position: 'fixed',
                        bottom: 0,
                    },
                },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontSize: '1.45rem',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    letterSpacing: '-0.01em',
                    padding: '24px 32px',
                    borderBottom: '1px solid #f2f2f2',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '@media (max-width: 600px)': {
                        padding: '16px 20px',
                        fontSize: '1.2rem',
                    },
                },
            },
        },
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    padding: '32px !important',
                    '@media (max-width: 600px)': {
                        padding: '20px !important',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '16px 20px',
                    fontSize: '0.88rem',
                    color: '#2d3748',
                    borderBottom: '1px solid #f0f0f0',
                },
                head: {
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#718096',
                    borderBottom: '2px solid #f0f0f0',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: '#f8fafc !important',
                    },
                },
            },
        },
    },
})

export default theme
