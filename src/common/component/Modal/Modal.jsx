import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { forwardRef } from 'react'

const SlideTransition = forwardRef(function SlideTransition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'sm' }) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            TransitionComponent={SlideTransition}
            maxWidth={maxWidth}
            fullWidth
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(4px)',
                    },
                },
            }}
        >
            <DialogTitle>
                {title}
                <IconButton
                    onClick={onClose}
                    sx={{
                        backgroundColor: '#f8f8f8',
                        color: '#888',
                        width: 40,
                        height: 40,
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            backgroundColor: '#eee',
                            color: '#000',
                            transform: 'rotate(90deg)',
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    )
}
