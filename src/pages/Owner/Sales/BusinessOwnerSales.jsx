import { useState, useMemo, useEffect } from 'react'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import TextField from '../../../common/component/TextField/TextField'
import Button from '../../../common/component/Button/Button'
import Modal from '../../../common/component/Modal/Modal'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import InvoiceModal from '../../../common/component/InvoiceModal/InvoiceModal'
import Autocomplete from '@mui/material/Autocomplete'
import MuiTextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { useSales } from '../../../context/SalesContext'
import { useProducts } from '../../../context/ProductContext'
import { useCustomers } from '../../../context/CustomerContext'
import { useAuth } from '../../../context/AuthContext'
import { useNotification } from '../../../context/NotificationContext'
import './BusinessOwnerSales.css'

export default function BusinessOwnerSales() {
    const { user } = useAuth()
    const { sales, loading, searchSales, recordSale, getSaleDetails, deleteSale } = useSales()
    const { products, refreshData: refreshProducts } = useProducts()
    const { customers, refreshCustomers } = useCustomers()
    const { showNotification, showConfirm } = useNotification()

    useEffect(() => {
        refreshProducts()
        refreshCustomers()
    }, [refreshProducts, refreshCustomers])

    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
    const [selectedSale, setSelectedSale] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // New Sale Form State
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [cart, setCart] = useState([])
    const [paymentMethod, setPaymentMethod] = useState('cash')

    const handleSearch = (e) => {
        const query = e.target.value
        setSearchQuery(query)
        searchSales(query)
    }

    const handleViewInvoice = async (sale) => {
        if (!sale) return
        const sid = sale.saleId || sale.id
        if (!sid) {
            showNotification('Invalid sale ID', 'error')
            return
        }

        try {
            const details = await getSaleDetails(sid)
            if (details) {
                setSelectedSale(details)
                setIsInvoiceModalOpen(true)
            } else {
                showNotification('Invoice details not found.', 'error')
            }
        } catch (error) {
            showNotification('Failed to load invoice: ' + error.message, 'error')
        }
    }

    const handleDeleteSale = async (targetSale) => {
        if (!targetSale) return
        const confirmed = await showConfirm('Are you sure you want to delete this sale? Product stock levels will be restored automatically.')
        if (confirmed) {
            try {
                const id = targetSale.saleId || targetSale.id
                const result = await deleteSale(id)
                if (result.success) {
                    showNotification('Sale deleted successfully', 'success')
                    if (refreshProducts) refreshProducts()
                } else {
                    showNotification('Error deleting sale: ' + (result.error || 'Failed to delete sale'), 'error')
                }
            } catch (error) {
                showNotification('An unexpected error occurred: ' + error.message, 'error')
            }
        }
    }

    const addToCart = (product) => {
        if (!product) return
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                )
            }
            return [...prev, { ...product, qty: 1 }]
        })
    }

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId))
    }

    const updateCartQty = (productId, qty) => {
        if (qty < 1) return
        setCart(prev => prev.map(item =>
            item.id === productId ? { ...item, qty } : item
        ))
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)

    const handleCreateSale = async () => {
        if (cart.length === 0) return

        // Final validation to prevent "Null ID" backend error
        const invalidItems = cart.filter(item => !item.id)
        if (invalidItems.length > 0) {
            showNotification('One or more items are invalid. Please re-add them.', 'error')
            console.error('Missing ID for items:', invalidItems)
            return
        }

        setIsSubmitting(true)

        const saleData = {
            customerId: selectedCustomer?.customerId,
            customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
            customerEmail: selectedCustomer?.email,
            customerPhone: selectedCustomer?.phone,
            items: cart.map(item => ({
                productId: item.id,
                qty: item.qty,
                price: item.price
            })),
            totalAmount: totalAmount,
            itemsCount: cart.reduce((sum, i) => sum + i.qty, 0),
            paymentMethod: paymentMethod,
            status: 'completed'
        }

        console.log('Recording sale with payload:', saleData)
        const result = await recordSale(saleData)

        if (result.success) {
            setIsModalOpen(false)
            setCart([])
            setSelectedCustomer(null)
            setPaymentMethod('cash')
            showNotification('Sale recorded successfully!', 'success')
            console.log('Sale recorded successfully')
        } else {
            console.error('Sale recording failed:', result.error)
            showNotification('Failed to record sale: ' + (result.error || 'Unknown error'), 'error')
        }
        setIsSubmitting(false)
    }

    const columns = useMemo(() => [
        {
            key: 'invoiceNumber',
            label: 'Invoice #',
            render: (val) => <span className="invoice-cell">{val || 'N/A'}</span>
        },
        {
            key: 'customerName',
            label: 'Customer',
            render: (val) => <span className="customer-cell">{val || 'Walk-in Customer'}</span>
        },
        {
            key: 'itemsCount',
            label: 'Items',
            align: 'right',
            render: (val) => <span>{val || 0} item(s)</span>
        },
        {
            key: 'totalAmount',
            label: 'Total',
            align: 'right',
            render: (val) => <span className="total-cell">${Number(val || 0).toFixed(2)}</span>
        },
        {
            key: 'paymentMethod',
            label: 'Payment',
            render: (val) => <span className="payment-cell">{val || 'Cash'}</span>
        },
        {
            key: 'status',
            label: 'Status',
            align: 'center',
            render: (val) => (
                <span className={`status-badge status-badge--${(val || 'completed').toLowerCase()}`}>
                    {val || 'Completed'}
                </span>
            )
        },
        {
            key: 'saleDate',
            label: 'Date',
            render: (val) => <span>{val ? new Date(val).toLocaleDateString() : 'N/A'}</span>
        },
        {
            key: 'actions',
            label: 'Actions',
            align: 'center',
            render: (_, row) => (
                <div className="action-buttons">
                    <button
                        className="action-btn action-btn--view"
                        title="View Invoice"
                        onClick={() => handleViewInvoice(row)}
                    >
                        <ReceiptLongOutlinedIcon sx={{ fontSize: 20 }} />
                    </button>
                    <button
                        className="action-btn action-btn--delete"
                        title="Delete Sale"
                        onClick={() => handleDeleteSale(row)}
                        style={{ color: '#e53e3e', marginLeft: '8px' }}
                    >
                        <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                    </button>
                </div>
            )
        }
    ], [handleDeleteSale, handleViewInvoice])

    return (
        <OwnerLayout breadcrumb="Sales">
            <div className="sales-page">
                <div className="sales-section">
                    <div className="sales-header">
                        <h2 className="sales-title">Sales & Invoices</h2>
                        <Button
                            variant="filled"
                            startIcon={<AddIcon />}
                            onClick={() => setIsModalOpen(true)}
                            sx={{ backgroundColor: '#000', borderRadius: '8px' }}
                        >
                            New Sale
                        </Button>
                    </div>

                    <div className="sales-toolbar">
                        <TextField
                            placeholder="Search sales history..."
                            icon={<SearchIcon />}
                            value={searchQuery}
                            onChange={handleSearch}
                            fullWidth
                        />
                    </div>

                    <div className="sales-table-container">
                        <DataTable
                            columns={columns}
                            data={sales}
                            isLoading={loading && sales.length === 0}
                        />
                    </div>
                </div>
            </div>

            {/* New Sale Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Sale"
            >
                <div className="new-sale-container">
                    <div className="new-sale-grid">
                        <div className="new-sale-form">
                            <div className="form-group">
                                <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Search Customer (Optional)</InputLabel>
                                <Autocomplete
                                    options={customers || []}
                                    getOptionLabel={(option) => option?.name ? `${option.name} (${option.phone || 'No phone'})` : ''}
                                    value={selectedCustomer}
                                    onChange={(_, newValue) => setSelectedCustomer(newValue)}
                                    renderInput={(params) => (
                                        <MuiTextField
                                            {...params}
                                            placeholder="Select Customer"
                                            variant="outlined"
                                            fullWidth
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                        />
                                    )}
                                />
                            </div>

                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Add Products to Sale</InputLabel>
                                <Autocomplete
                                    options={products || []}
                                    getOptionLabel={(option) => option?.name ? `${option.name} - $${option.price?.toFixed(2)} (${option.stock} in stock)` : ''}
                                    onChange={(_, newValue) => {
                                        if (newValue) {
                                            addToCart(newValue)
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <MuiTextField
                                            {...params}
                                            placeholder="Search Products..."
                                            variant="outlined"
                                            fullWidth
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                        />
                                    )}
                                    clearOnBlur
                                    handleHomeEndKeys
                                />
                            </div>

                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Payment Method</InputLabel>
                                <FormControl fullWidth>
                                    <Select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        sx={{ borderRadius: '12px' }}
                                    >
                                        <MenuItem value="cash">Cash</MenuItem>
                                        <MenuItem value="card">Card</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        <div className="new-sale-cart">
                            <h3 className="cart-title">Order Items</h3>
                            <div className="cart-list">
                                {cart.length === 0 ? (
                                    <div className="empty-cart">No items added yet.</div>
                                ) : (
                                    <table className="cart-table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Qty</th>
                                                <th>Price</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cart.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="qty-input"
                                                            value={item.qty}
                                                            onChange={(e) => updateCartQty(item.id, parseInt(e.target.value) || 1)}
                                                            min="1"
                                                        />
                                                    </td>
                                                    <td>${(item.price * item.qty).toFixed(2)}</td>
                                                    <td>
                                                        <button className="remove-item" onClick={() => removeFromCart(item.id)}>
                                                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            <div className="cart-footer">
                                <div className="cart-total">
                                    <span>Total Amount:</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button variant="outlined" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            variant="filled"
                            onClick={handleCreateSale}
                            disabled={isSubmitting || cart.length === 0}
                            sx={{ minWidth: '150px' }}
                        >
                            {isSubmitting ? 'RECORDING...' : 'RECORD SALE'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* View Invoice Modal */}
            <InvoiceModal
                isOpen={isInvoiceModalOpen}
                onClose={() => {
                    setIsInvoiceModalOpen(false)
                    setSelectedSale(null)
                }}
                sale={selectedSale}
                businessName={user?.businessName}
            />
        </OwnerLayout>
    )
}
