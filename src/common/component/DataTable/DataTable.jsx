import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    IconButton,
} from '@mui/material'

export default function DataTable({ columns = [], data = [] }) {
    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                border: '1px solid #f0f0f0',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            }}
        >
            <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#fafafa' }}>
                    <TableRow>
                        {columns.map((col, i) => (
                            <TableCell
                                key={i}
                                align={col.align || 'left'}
                                sx={{ width: col.width }}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <TableCell
                                        key={colIndex}
                                        align={col.align || 'left'}
                                    >
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No data available
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
