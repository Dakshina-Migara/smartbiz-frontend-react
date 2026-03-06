import { useState, useMemo } from 'react'
import OwnerLayout from '../../../common/component/OwnerLayout/OwnerLayout'
import DataTable from '../../../common/component/DataTable/DataTable'
import Button from '../../../common/component/Button/Button'
import Modal from '../../../common/component/Modal/Modal'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import MuiTextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { useTransactions } from '../../../context/TransactionContext'
import './BusinessOwnerTransaction.css'

export default function BusinessOwnerTransaction() {
    const { transactions, loading, addTransaction, editTransaction, deleteTransaction } = useTransactions()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)

    // Form State
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category: 'Other',
        description: '',
        amount: ''
    })

    const categories = ['Marketing', 'Suppliers', 'Inventory', 'Utilities', 'Rent', 'Payroll', 'Other', 'Sales', 'Services']

    // Calculate totals
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)

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
            setFormData({
                date: new Date().toISOString().split('T')[0],
                type: 'expense',
                category: 'Other',
                description: '',
                amount: ''
            })
        }
        setIsModalOpen(true)
    }

    const handleDelete = async (transaction) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            const id = transaction.transactionId || transaction.id
            const res = await deleteTransaction(id)
            if (!res.success) {
                alert('Error: ' + res.error)
            }
        }
    }

    const handleSubmit = async () => {
        if (!formData.description || !formData.amount || !formData.category) {
            alert('Please fill all required fields')
            return
        }

        setIsSubmitting(true)
        try {
            const payload = {
                ...formData,
                amount: Number(formData.amount)
            }

            let result
            if (editingTransaction) {
                const id = editingTransaction.transactionId || editingTransaction.id
                result = await editTransaction(id, payload)
            } else {
                result = await addTransaction(payload)
            }

            if (result.success) {
                setIsModalOpen(false)
            } else {
                alert('Error processing transaction: ' + result.error)
            }
        } catch (err) {
            console.error(err)
            alert('An unexpected error occurred.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const columns = useMemo(() => [
        {
            key: 'date',
            label: 'Date',
            render: (val) => <span>{val ? new Date(val).toLocaleDateString() : 'N/A'}</span>
        },
        {
            key: 'type',
            label: 'Type',
            render: (val) => (
                <span className={`type-badge type-badge--${val}`}>
                    {val === 'income' ? <TrendingUpIcon sx={{ fontSize: 16 }} /> : <TrendingDownIcon sx={{ fontSize: 16 }} />}
                    {val}
                </span>
            )
        },
        {
            key: 'category',
            label: 'Category',
            render: (val) => <span>{val}</span>
        },
        {
            key: 'description',
            label: 'Description',
            render: (val) => <span>{val}</span>
        },
        {
            key: 'amount',
            label: 'Amount',
            render: (val, row) => (
                <span className={`amount-cell amount-cell--${row.type}`}>
                    {row.type === 'income' ? '+' : '-'}${Number(val).toFixed(2)}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div className="action-buttons">
                    <button
                        className="action-btn action-btn--edit"
                        title="Edit Transaction"
                        onClick={() => handleOpenModal(row)}
                    >
                        <EditOutlinedIcon sx={{ fontSize: 20 }} />
                    </button>
                    <button
                        className="action-btn action-btn--delete"
                        title="Delete Transaction"
                        onClick={() => handleDelete(row)}
                        style={{ color: '#e53e3e', marginLeft: '8px' }}
                    >
                        <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                    </button>
                </div>
            )
        }
    ], [])

    return (
        <OwnerLayout breadcrumb="Transactions">
            <div className="transactions-page">
                {/* Summary Cards */}
                <div className="summary-cards">
                    <div className="summary-card">
                        <div className="summary-card-title">Total Income</div>
                        <div className="summary-card-value income-value">
                            ${totalIncome.toFixed(2)}
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-card-title">Total Expenses</div>
                        <div className="summary-card-value expense-value">
                            ${totalExpenses.toFixed(2)}
                        </div>
                    </div>
                </div>

                <div className="transactions-section">
                    <div className="transactions-header">
                        <h2 className="transactions-title">Daily Transactions</h2>
                        <Button
                            variant="filled"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenModal()}
                            sx={{ backgroundColor: '#000', borderRadius: '8px' }}
                        >
                            Add Transaction
                        </Button>
                    </div>

                    <div className="transactions-table-container">
                        <DataTable
                            columns={columns}
                            data={transactions}
                            isLoading={loading && transactions.length === 0}
                        />
                    </div>
                </div>
            </div>

            {/* Transaction Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTransaction ? "Edit Transaction" : "Log a Transaction"}
            >
                <div className="transaction-form-container">
                    <div className="form-group">
                        <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Date</InputLabel>
                        <MuiTextField
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Type</InputLabel>
                            <FormControl fullWidth>
                                <Select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    sx={{ borderRadius: '12px' }}
                                >
                                    <MenuItem value="income">Income</MenuItem>
                                    <MenuItem value="expense">Expense</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className="form-group" style={{ flex: 1 }}>
                            <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Category</InputLabel>
                            <FormControl fullWidth>
                                <Select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    sx={{ borderRadius: '12px' }}
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Description</InputLabel>
                        <MuiTextField
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter description..."
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </div>

                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <InputLabel sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>Amount</InputLabel>
                        <MuiTextField
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </div>

                    <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
                        <Button variant="outlined" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            variant="filled"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            sx={{ minWidth: '150px' }}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </OwnerLayout>
    )
}
