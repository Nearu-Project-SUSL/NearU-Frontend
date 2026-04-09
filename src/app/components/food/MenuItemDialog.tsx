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
  item: MenuItem | null;        // either menuitem or null (when closed)
  onClose: () => void;          // function to close the dialog
}

export default function MenuItemDialog({ item, onClose }: MenuItemDialogProps) {
  return (
    <Dialog
      open={!!item} //convert anything to boolean
      onClose={onClose} //when user close dialog like click outside dialog
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx:{
          bgcolor:'#0a0a0a',
          borderRadius:'28px',
          border:'1px solid rgba(255,255,255,0.08)',
          backgroundImage:'none',
          overflow:'hidden',
          m:2
        },
      }}
    >
      
      {item && (
        <Box>
          
          {/*photo */}
          <Box sx={{position:'relative', height:'260',overflow:'hidden'}}>
            
            <Box 
              component="img"
              src={item.photoUrl}
              alt={item.name}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            <Box 
              sx={{
                position:'absolute',
                bottom:0,
                left:0,
                right:0,
                height:'50%',
                background: 'linear-gradient(to top, #0a0a0a, transparent)',
              }}/>

            <IconButton
              onClick={onClose}
              sx={{
                position:'absolute',
                top:16,
                right:16,
                bgcolor:'rgba(0,0,0,0.6)',
                color:'#fff',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' },
              }}>
                
                <CloseIcon />
              
              </IconButton>


              <Box
                sx={{
                  position:'absolute',
                  bottom:20,
                  left:24,
                  px:2,
                  py:0.8,
                  bgcolor:'#facc15',
                  borderRadius:'12px'
                }}>

                  <Typography
                    variant='h6'
                    sx={{color:'#000', fontWeight:800, fontsize:'1.2rem'}}>
                      Rs.{item.price.toLocaleString()}

                    </Typography>
                </Box>
          </Box>

          {/*content */}
          <DialogContent sx={{p:3.5}}>
            <Typography
            variant='h5'
            sx={{ color: '#fff', fontWeight:800, mb:1.5}}
          >
            {item.name}

          </Typography>

          <Typography
            variant='body1'
            sx={{
              color:'rgba(255,255,255,0.6)',
              lineHeight:1.8,
              fontSize:'0.95rem'
            }}>

              {item.description}

          </Typography>
          </DialogContent>
        </Box>
      )}
    </Dialog>
  );
}