import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import axios from 'axios';
import { useFetcher } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function Insert() {

  const [categories, setCategories] = useState([])
  const [curProduct, setCurProduct] = useState({
    name: '',
    image: [],
    price: 0,
    size: '',
    origin: '',
    quantity: 0,
    category_id: ''
  })
  const [show, setShow] = useState(true)
  const onDeleteImage = (id) => {
    setCurProduct(pre => {
      const newPre = { ...pre }
      return {
        ...newPre,
        image: newPre.image.filter((e, i) => !(i == id))
      }
    })
  }

  const uploadToCloundinary = async () => {
    try {
      const file = document.getElementById('image').files[0];
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'ml_default');
      const response = await
        fetch('https://api.cloudinary.com/v1_1/dapqiosjm/image/upload', {
          method: 'POST',
          body: data
        });
      const result = await response.json();
      console.log('result: ', result)
      setCurProduct(pre => {
        const newPre = { ...pre }
        return {
          ...newPre,
          image: [...newPre.image, result.secure_url]
        }
      })
    } catch (error) {

    }
  }


  const fetchUploadProduct = async () => {
    const response = await fetch(`http://localhost:7000/products/add-new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(curProduct)
    })
    const result = await response.json()
    console.log('sent product: ', result)
    if (result.status) {
      setShow(false)
      Swal.fire({
        title: "Good job!",
        text: "Add product success!",
        icon: "success"
      }).then((result) => {
        if (result.isConfirmed) {
          setShow(true)
          setCurProduct({
            name: '',
            image: [],
            price: 0,
            size: '',
            origin: '',
            quantity: 0,
            category_id: ''
          })
        }
      })
    } else {
      setShow(false)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong, try again!",
      }).then((result) => {
        if (result.isConfirmed) {
          setShow(true)
        }
      });
    }
  }

  const fetchCateogries = async (page = 1, limit = 10) => {
    const response = await fetch(`http://localhost:7000/categories/get?page=${page}&limit=${limit}`)
    const result = await response.json()
    console.log('categories: ', result.data)
    setCategories(pre => [...pre, ...result.data])
  }

  const onNameChange = (e) => {
    setCurProduct({
      ...curProduct,
      name: e.target.value
    })
  }


  const onPriceChange = (e) => {
    setCurProduct({
      ...curProduct,
      price: parseInt(e.target.value)
    })
  }

  const onSizeChange = (e) => {
    setCurProduct({
      ...curProduct,
      size: e.target.value
    })
  }

  const onOriginChange = (e) => {
    setCurProduct({
      ...curProduct,
      origin: e.target.value
    })
  }

  const onQuantityChange = (e) => {
    setCurProduct({
      ...curProduct,
      quantity: parseInt(e.target.value)
    })
  }

  const onCategoryChange = (e) => {
    setCurProduct({
      ...curProduct,
      category_id: e.target.value
    })
  }

  const handleAddProduct = () => {
    if (validateValue()) {
      fetchUploadProduct()
    } else {
      setShow(false)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid infomation!"
      }).then((response) => {
        if (response.isConfirmed) {
          setShow(true)
        }
      });
    }
  }

  const validateValue = () => {
    if (!curProduct.name || !curProduct.size || !curProduct.origin || !curProduct.quantity || curProduct.image.length == 0 || !curProduct.category_id) {
      return false
    }

    if (curProduct.price < 0 || curProduct.quantity < 0) {
      return false
    }

    return true
  }

  useEffect(() => {
    fetchCateogries()
  }, [])
  return (
    <Dialog open={show} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Insert Product</DialogTitle>
      <DialogContent>
        <TextField
          value={curProduct.name}
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          fullWidth
          variant="outlined"
          onChange={(e) => onNameChange(e)}
        />
        <input
          margin="dense"
          id="image"
          label="Image URL"
          fullWidth
          variant="outlined"
          type='file'
          onChange={uploadToCloundinary}
        />
        <br />
        {
          curProduct.image.map((e, i) => {
            return (
              <img onClick={() => onDeleteImage(i)} key={i.toString()} style={{ width: 50, height: 50 }} src={e} />
            )
          })
        }
        <TextField
          value={curProduct.price}
          margin="dense"
          id="price"
          label="Price"
          fullWidth
          variant="outlined"
          type='number'
          onChange={(e) => onPriceChange(e)}
        />
        <TextField
          value={curProduct.size}
          margin="dense"
          id="size"
          label="Size"
          fullWidth
          variant="outlined"
          onChange={(e) => onSizeChange(e)}
        />
        <TextField
          value={curProduct.origin}
          margin="dense"
          id="origin"
          label="Origin"
          fullWidth
          variant="outlined"
          onChange={(e) => onOriginChange(e)}
        />
        <TextField
          value={curProduct.quantity}
          margin="dense"
          id="quantity"
          label="Quantity"
          type='number'
          fullWidth
          variant="outlined"
          onChange={(e) => onQuantityChange(e)}
        />
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category_id"
          fullWidth
          variant="outlined"
          onChange={(e) => onCategoryChange(e)}
        >
          {
            categories.map((e, i) => {
              return (
                <MenuItem key={i} value={e._id}>{e.name}</MenuItem>
              )
            })
          }
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddProduct} variant="contained">Submit</Button>
      </DialogActions>
    </Dialog>
  );
}