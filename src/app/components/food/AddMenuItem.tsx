import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";

export interface AddMenuItemFormData {
  name: string;
  description: string;
  price: number;
  photoUrl: string;
}

interface AddMenuItem {
  open:boolean;
  onClose: () => void;
  onSubmit: (data: AddMenuItemFormData) => void;
}

const initialState: AddMenuItemFormData = {
  name: "",
  description: "",
  price: 0,
  photoUrl: "",
};

export default function AddMenuItem({ 
  open,
  onClose,
  onSubmit
}: AddMenuItem) {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");

  useEffect(() => {
    if(!open){
      setFormData(initialState);
      setError("");
    }
  }, [open])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price"? Number(value) : value,
    }));
  }

  const handleSubmit = () => {
    if (!formData.name.trim()){
      setError("Name is Required");
      return;
    }
    if(formData.price <= 0){
      setError("Price must be greater than 0");
      return;
    }

    onSubmit(formData);
    onClose();
  }
  
  return <Button variant="contained">Test Button
  
  <Dialog
    open = {open}
    onClose={onClose}
    fullWidth
    maxWidth="sm"
    PaperProps={{
      sx:{
        borderRadius:'24px',
        bgcolor:"#111",
        color:'#fff',
        backgroundImage:'none'
      },
    }}
    >
      <DialogTitle sx={{fontWeight:700}}>Add Menu Item</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{mt:1}}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
          />
          <TextField
            label="Photo URL"
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleChange}
          />
        
        </Stack>
      </DialogContent>

      <DialogActions sx={{px:3, pb:3}}>
        
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        
        <Button onClick={handleSubmit} variant="contained">
          Add Item
        </Button>
      
      </DialogActions>
    </Dialog>

  </Button>;
}