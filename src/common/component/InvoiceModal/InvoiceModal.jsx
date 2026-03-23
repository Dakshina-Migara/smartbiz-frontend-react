import React, { useRef } from 'react'
import Modal from '../Modal/Modal'
import Button from '../Button/Button'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useNotification } from '../../../context/NotificationContext'
import './InvoiceModal.css'

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
            <div className="invoice-modal-wrapper">
                <div className="simple-receipt" ref={receiptRef}>
                    <div className="invoice-header-simple">
                        <div className="biz-details">
                            <h2>{businessName || 'SmartBiz'}</h2>
                            <p>#{sale.invoiceNumber?.split('-').pop() || '0000'} | {new Date(sale.saleDate).toLocaleDateString()}</p>
                        </div>
                        <div className="cust-details">
                            <strong>Customer:</strong> {sale.customerName || 'Walk-in'}
                        </div>
                    </div>

                    <div className="invoice-body-simple">
                        <table className="receipt-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th style={{ textAlign: 'center' }}>Qty</th>
                                    <th style={{ textAlign: 'right' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.items?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.productName || 'Product'}</td>
                                        <td style={{ textAlign: 'center' }}>{item.qty}</td>
                                        <td style={{ textAlign: 'right' }}>${(item.qty * item.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="invoice-footer-simple">
                        <div className="total-row-simple">
                            <span>Total Amount:</span>
                            <span className="grand-total-amount">${Number(sale.totalAmount).toFixed(2)}</span>
                        </div>
                        <div className="payment-note-simple">
                            Paid with {sale.paymentMethod?.toUpperCase() || 'CASH'} | Status: {sale.status?.toUpperCase() || 'COMPLETED'}
                        </div>
                    </div>
                </div>

                <div className="invoice-actions no-print">
                    <Button variant="outlined" onClick={handleDownloadPdf}>
                        DOWNLOAD PDF
                    </Button>
                    <Button variant="filled" onClick={onClose}>
                        CLOSE
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
