import { useState, useMemo, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import MuiTextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import TextField from '../../../common/component/TextField/TextField'
import Button from '../../../common/component/Button/Button'
import Modal from '../../../common/component/Modal/Modal'
import InvoiceModal from '../../../common/component/InvoiceModal/InvoiceModal'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useSales } from '../../../context/SalesContext'
import { useProducts } from '../../../context/ProductContext'
import { useCustomers } from '../../../context/CustomerContext'
import { useAuth } from '../../../context/AuthContext'
import { useNotification } from '../../../context/NotificationContext'

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
        if (!sid) { showNotification('Invalid sale ID', 'error'); return }
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
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
            }
            return [...prev, { ...product, qty: 1 }]
        })
    }

    const removeFromCart = (productId) => setCart(prev => prev.filter(item => item.id !== productId))

    const updateCartQty = (productId, qty) => {
        if (qty < 1) return
        setCart(prev => prev.map(item => item.id === productId ? { ...item, qty } : item))
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)

    const handleCreateSale = async () => {
        if (cart.length === 0) return
        const invalidItems = cart.filter(item => !item.id)
        if (invalidItems.length > 0) {
            showNotification('One or more items are invalid. Please re-add them.', 'error')
            return
        }
        setIsSubmitting(true)
        const saleData = {
            customerId: selectedCustomer?.customerId,
            customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
            customerEmail: selectedCustomer?.email,
            customerPhone: selectedCustomer?.phone,
            items: cart.map(item => ({ productId: item.id, qty: item.qty, price: item.price })),
            totalAmount, itemsCount: cart.reduce((sum, i) => sum + i.qty, 0),
            paymentMethod, status: 'completed'
        }
        const result = await recordSale(saleData)
        if (result.success) {
            setIsModalOpen(false); setCart([]); setSelectedCustomer(null); setPaymentMethod('cash')
            showNotification('Sale recorded successfully!', 'success')
        } else {
            showNotification('Failed to record sale: ' + (result.error || 'Unknown error'), 'error')
        }
        setIsSubmitting(false)
    }

    const columns = useMemo(() => [
        { key: 'invoiceNumber', label: 'Invoice #', render: (val) => <Typography component="span" sx={{ fontWeight: 600 }}>{val || 'N/A'}</Typography> },
        { key: 'customerName', label: 'Customer', render: (val) => val || 'Walk-in Customer' },
        { key: 'itemsCount', label: 'Items', align: 'right', render: (val) => `${val || 0} item(s)` },
        { key: 'totalAmount', label: 'Total', align: 'right', render: (val) => <Typography component="span" sx={{ fontWeight: 700, color: '#1a1a1a' }}>${Number(val || 0).toFixed(2)}</Typography> },
        { key: 'paymentMethod', label: 'Payment', render: (val) => <Chip label={val || 'Cash'} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} /> },
        {
            key: 'status', label: 'Status', align: 'center',
            render: (val) => <Chip label={val || 'Completed'} size="small" color={val?.toLowerCase() === 'completed' ? 'success' : 'default'} variant="outlined" sx={{ textTransform: 'capitalize' }} />
        },
        { key: 'saleDate', label: 'Date', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
        {
            key: 'actions', label: 'Actions', align: 'center',
            render: (_, row) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton size="small" onClick={() => handleViewInvoice(row)} title="View Invoice"
                        sx={{ color: '#4a5568', '&:hover': { backgroundColor: '#f0fdf4', color: '#166534' } }}>
                        <ReceiptLongOutlinedIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteSale(row)} title="Delete Sale"
                        sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fef2f2', color: '#b91c1c' } }}>
                        <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Box>
            )
        }
    ], [handleDeleteSale, handleViewInvoice])

    return (
        <OwnerLayout breadcrumb="Sales">
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Sales & Invoices</Typography>
                    <Button startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>New Sale</Button>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <TextField placeholder="Search sales history..." icon={<SearchIcon />} value={searchQuery} onChange={handleSearch} fullWidth />
                </Box>

                <Box sx={{ overflowX: 'auto' }}>
                    <DataTable columns={columns} data={sales} isLoading={loading && sales.length === 0} />
                </Box>
            </Box>

            {/* New Sale Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Sale" maxWidth="md">
                <Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        {/* Left: Form */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Box>
                                <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Search Customer (Optional)</InputLabel>
                                <Autocomplete options={customers || []} getOptionLabel={(opt) => opt?.name ? `${opt.name} (${opt.phone || 'No phone'})` : ''}
                                    value={selectedCustomer} onChange={(_, newVal) => setSelectedCustomer(newVal)}
                                    renderInput={(params) => <MuiTextField {...params} placeholder="Select Customer" variant="outlined" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />}
                                />
                            </Box>
                            <Box>
                                <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Add Products to Sale</InputLabel>
                                <Autocomplete options={products || []} getOptionLabel={(opt) => opt?.name ? `${opt.name} - $${opt.price?.toFixed(2)} (${opt.stock} in stock)` : ''}
                                    onChange={(_, newVal) => { if (newVal) addToCart(newVal) }}
                                    renderInput={(params) => <MuiTextField {...params} placeholder="Search Products..." variant="outlined" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />}
                                    clearOnBlur handleHomeEndKeys
                                />
                            </Box>
                            <Box>
                                <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Payment Method</InputLabel>
                                <FormControl fullWidth>
                                    <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} sx={{ borderRadius: '12px' }}>
                                        <MenuItem value="cash">Cash</MenuItem>
                                        <MenuItem value="card">Card</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        {/* Right: Cart */}
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Order Items</Typography>
                            {cart.length === 0 ? (
                                <Typography sx={{ color: '#9a8e84', textAlign: 'center', py: 4 }}>No items added yet.</Typography>
                            ) : (
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell align="center">Qty</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="center" />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cart.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell align="center">
                                                    <MuiTextField type="number" value={item.qty}
                                                        onChange={(e) => updateCartQty(item.id, parseInt(e.target.value) || 1)}
                                                        inputProps={{ min: 1, style: { textAlign: 'center', width: 50 } }}
                                                        variant="outlined" size="small"
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">${(item.price * item.qty).toFixed(2)}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton size="small" onClick={() => removeFromCart(item.id)} sx={{ color: '#ef4444' }}>
                                                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: '2px solid #f0f0f0' }}>
                                <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>Total Amount:</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1a1a1a' }}>${totalAmount.toFixed(2)}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button variant="outlined" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button variant="filled" onClick={handleCreateSale} disabled={isSubmitting || cart.length === 0}>
                            {isSubmitting ? 'RECORDING...' : 'RECORD SALE'}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <InvoiceModal isOpen={isInvoiceModalOpen} onClose={() => { setIsInvoiceModalOpen(false); setSelectedSale(null) }} sale={selectedSale} businessName={user?.businessName} />
        </OwnerLayout>
    )
}
