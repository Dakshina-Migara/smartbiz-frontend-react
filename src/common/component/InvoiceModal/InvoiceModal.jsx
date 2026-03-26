import { useRef } from 'react'
import Modal from '../Modal/Modal'
import Button from '../Button/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Divider from '@mui/material/Divider'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useNotification } from '../../../context/NotificationContext'

export default function InvoiceModal({ isOpen, onClose, sale, businessName }) {
    const { showNotification } = useNotification()
    const receiptRef = useRef(null)

    const handleDownloadPdf = async () => {
        if (!receiptRef.current) return
        try {
            const canvas = await html2canvas(receiptRef.current, { scale: 2, useCORS: true })
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(`Invoice_${sale.invoiceNumber}.pdf`)
        } catch (error) {
            console.error('Failed to generate PDF:', error)
            showNotification('Failed to download PDF.', 'error')
        }
    }

    if (!sale) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Invoice Details">
            <Box>
                <Box ref={receiptRef} sx={{ p: 3, backgroundColor: '#fff' }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                                {businessName || 'SmartBiz'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#7a6e64', mt: 0.5 }}>
                                #{sale.invoiceNumber?.split('-').pop() || '0000'} | {new Date(sale.saleDate).toLocaleDateString()}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4a5568' }}>
                                Customer: {sale.customerName || 'Walk-in'}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Items Table */}
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: '#4a5568' }}>Item</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700, color: '#4a5568' }}>Qty</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: '#4a5568' }}>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sale.items?.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{item.productName || 'Product'}</TableCell>
                                    <TableCell align="center">{item.qty}</TableCell>
                                    <TableCell align="right">${(item.qty * item.price).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Divider sx={{ my: 2 }} />

                    {/* Footer */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Total Amount:</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            ${Number(sale.totalAmount).toFixed(2)}
                        </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#9a8e84' }}>
                        Paid with {sale.paymentMethod?.toUpperCase() || 'CASH'} | Status: {sale.status?.toUpperCase() || 'COMPLETED'}
                    </Typography>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button variant="outlined" onClick={handleDownloadPdf}>
                        DOWNLOAD PDF
                    </Button>
                    <Button variant="filled" onClick={onClose}>
                        CLOSE
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}
