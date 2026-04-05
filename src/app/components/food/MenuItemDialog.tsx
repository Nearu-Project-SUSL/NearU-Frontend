import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { MenuItem } from '../../../data/foodMockData';

interface MenuItemDialogProps {
  item: MenuItem | null;        // null means dialog is closed
  onClose: () => void;          // function to close the dialog
}

export default function MenuItemDialog({ item, onClose }: MenuItemDialogProps) {
  return (
    <Dialog open={!!item} onClose={onClose}>
      <DialogContent>
        {item && (
          <Box>
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="body2">${item.price.toFixed(2)}</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}