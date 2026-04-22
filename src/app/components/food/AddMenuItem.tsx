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
  photo: File | null;
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
  photo: null,
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
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      photo: file ?? null,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()){
      setError("Name is Required");
      return;
    }
    if(formData.price <= 0){
      setError("Price must be greater than 0");
      return;
    }

    await onSubmit(formData);
    onClose();
  }
  
  return (
  
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
            sx={{
              '& input[type=number]': {
                MozAppearance: 'textfield', // Firefox
              },
              '& input[type=number]::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '& input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
            }}
          />
          
          <Button
            variant="outlined"
            component="label"
          >
            Upload Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          {formData.photo && (
            <span>{formData.photo.name}</span>
          )}
        
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

  );
}