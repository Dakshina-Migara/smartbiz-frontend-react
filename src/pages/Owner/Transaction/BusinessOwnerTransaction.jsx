import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import MuiTextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import Button from '../../../common/component/Button/Button'
import Modal from '../../../common/component/Modal/Modal'
import { useTransactions } from '../../../context/TransactionContext'
import { useNotification } from '../../../context/NotificationContext'

export default function BusinessOwnerTransaction() {
    const { transactions, loading, addTransaction, editTransaction, deleteTransaction } = useTransactions()
    const { showNotification, showConfirm } = useNotification()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category: 'Other',
        description: '',
        amount: ''
    })

    const categories = ['Marketing', 'Suppliers', 'Inventory', 'Utilities', 'Rent', 'Payroll', 'Other', 'Sales', 'Services']

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

    const handleOpenModal = (transaction = null) => {
        if (transaction) {
            setEditingTransaction(transaction)
            setFormData({
                date: transaction.date ? transaction.date.split('T')[0] : '',
                type: transaction.type || 'expense',
                category: transaction.category || 'Other',
                description: transaction.description || '',
                amount: transaction.amount || ''
            })
        } else {
            setEditingTransaction(null)
            setFormData({ date: new Date().toISOString().split('T')[0], type: 'expense', category: 'Other', description: '', amount: '' })
        }
        setIsModalOpen(true)
    }

    const handleDelete = async (transaction) => {
        const confirmed = await showConfirm('Are you sure you want to delete this transaction?')
        if (confirmed) {
            const id = transaction.transactionId || transaction.id
            const res = await deleteTransaction(id)
            showNotification(res.success ? 'Transaction deleted successfully' : 'Error: ' + res.error, res.success ? 'success' : 'error')
        }
    }

    const handleSubmit = async () => {
        if (!formData.description || !formData.amount || !formData.category) {
            showNotification('Please fill all required fields', 'error')
            return
        }
        setIsSubmitting(true)
        try {
            const payload = { ...formData, amount: Number(formData.amount) }
            let result
            if (editingTransaction) {
                const id = editingTransaction.transactionId || editingTransaction.id
                result = await editTransaction(id, payload)
            } else {
                result = await addTransaction(payload)
            }
            if (result.success) {
                setIsModalOpen(false)
                showNotification(`Transaction ${editingTransaction ? 'updated' : 'added'} successfully!`, 'success')
            } else {
                showNotification('Error processing transaction: ' + result.error, 'error')
            }
        } catch (err) {
            showNotification('An unexpected error occurred.', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const columns = useMemo(() => [
        { key: 'date', label: 'Date', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
        {
            key: 'type', label: 'Type',
            render: (val) => (
                <Chip
                    icon={val === 'income' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                    label={val}
                    size="small"
                    color={val === 'income' ? 'success' : 'error'}
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                />
            )
        },
        { key: 'category', label: 'Category' },
        { key: 'description', label: 'Description' },
        {
            key: 'amount', label: 'Amount', align: 'right',
            render: (val, row) => (
                <Typography component="span" sx={{ fontWeight: 700, color: row.type === 'income' ? '#27ae60' : '#e74c3c' }}>
                    {row.type === 'income' ? '+' : '-'}${Number(val).toFixed(2)}
                </Typography>
            )
        },
        {
            key: 'actions', label: 'Actions', align: 'center',
            render: (_, row) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton size="small" onClick={() => handleOpenModal(row)} title="Edit"
                        sx={{ color: '#4a5568', '&:hover': { backgroundColor: '#ebf8ff', color: '#0369a1' } }}>
                        <EditOutlinedIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(row)} title="Delete"
                        sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fef2f2', color: '#b91c1c' } }}>
                        <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Box>
            )
        }
    ], [handleDelete, handleOpenModal])

    return (
        <OwnerLayout breadcrumb="Transactions">
            <Box>
                {/* Summary Cards */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <Typography variant="body2" sx={{ color: '#7a6e64', fontWeight: 500 }}>Total Income</Typography>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#27ae60', mt: 0.5 }}>${totalIncome.toFixed(2)}</Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <Typography variant="body2" sx={{ color: '#7a6e64', fontWeight: 500 }}>Total Expenses</Typography>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#e74c3c', mt: 0.5 }}>${totalExpenses.toFixed(2)}</Typography>
                    </Paper>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Daily Transactions</Typography>
                    <Button startIcon={<AddIcon />} onClick={() => handleOpenModal()}>Add Transaction</Button>
                </Box>

                <Box sx={{ overflowX: 'auto' }}>
                    <DataTable columns={columns} data={transactions} isLoading={loading && transactions.length === 0} />
                </Box>
            </Box>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTransaction ? "Edit Transaction" : "Log a Transaction"}>
                <Box>
                    <Box sx={{ mb: 2.5 }}>
                        <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Date</InputLabel>
                        <MuiTextField type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            variant="outlined" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Type</InputLabel>
                            <FormControl fullWidth>
                                <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} sx={{ borderRadius: '12px' }}>
                                    <MenuItem value="income">Income</MenuItem>
                                    <MenuItem value="expense">Expense</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Category</InputLabel>
                            <FormControl fullWidth>
                                <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} sx={{ borderRadius: '12px' }}>
                                    {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                        <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Description</InputLabel>
                        <MuiTextField value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter description..." variant="outlined" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                        <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Amount</InputLabel>
                        <MuiTextField type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00" variant="outlined" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button variant="outlined" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button variant="filled" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'SAVING...' : 'SAVE TRANSACTION'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </OwnerLayout>
    )
}
