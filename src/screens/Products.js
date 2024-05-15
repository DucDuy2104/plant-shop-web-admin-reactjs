import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { formatCurrency } from "../local-function/convert-money";
import { Button } from "react-bootstrap";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField } from '@mui/material';

function Product() {
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState()
  const [showDialog, setShow] = useState(false)
  const [curProduct, setCurProduct] = useState()
  const [keySearch, setKeySearch] = useState()
  const [categories, setCategories] = useState([])
  const fetchProducts = async (mpage = 1, limit = 10, type = 'all') => {
    console.log('fetching...', mpage)
    const response = await fetch(`http://localhost:7000/products/get/${type}?page=${mpage}&limit=${limit}`)
      .then(res => res)
      .catch(err => console.log('err: ', err))
    const result = await response.json()
    console.log('result: ', result.data)
    if (result.status) {
      setProducts(pre => [...pre, ...result.data])
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Get products failure, refresh please!",
      });
    }
    return result
  }

  if (keySearch == '' && products.length == 0) {
    fetchProducts(1)
  }

  const fetchDeleteProduct = async (_id) => {
    const response = await fetch(`http://localhost:7000/products/delete?id=${_id}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    console.log(result)
    return result
  }

  const fetchUpdateProduct = async (_id) => {
    const response = await fetch(`http://localhost:7000/products/update?id=${_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(curProduct)
    })
    const result = await response.json()
    return result
  }

  const fetchSearchProduct = async () => {
    const response = await fetch(`http://localhost:7000/products/search?key=${keySearch}`)
    const result = await response.json()
    if (result.status) {
      setProducts(result.data)
    } else {
      setProducts([])
    }
  }

  useEffect(() => {
    fetchSearchProduct()
  }, [keySearch])

  const handleUpdate = async (id) => {
    console.log('Update...')
    setCurProduct(pre => {
      setShow(true)
      return products[id]
    })
  }

  const handleDelete = async (id) => {
    console.log('Delete...')
    setUpDialogDeleteAndShow(products[id])
  }

  const fetchCateogries = async (pageC = 1, limit = 6) => {
    const response = await fetch(`http://localhost:7000/categories/get?page=${pageC}&limit=${limit}`)
    const result = await response.json()
    console.log('categories: ', result.data)
    setCategories(pre => [...pre, ...result.data])
  }
  useEffect(() => {
    fetchCateogries()
  }, [])

  useEffect(() => {
    fetchProducts(page)
  }, [page]);

  if (!products) {
    return (
      <div style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <progress />
        <p>Loading...</p>
      </div>
    )
  }
  

  const setUpDialogUpdateAndShow = (item) => {
    setShow(false)
    Swal.fire({
      title: "Are you sure?",
      text: `Update ${item.name}\n, You won't be able to revert this!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await fetchUpdateProduct(item._id)
        if (result.status) {
          Swal.fire({
            title: "Updated!",
            text: "Your file has been deleted.",
            icon: "success"
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });

        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Updated Failure! Try again please"
          });
        }
      }
    });

  }

  const setUpDialogDeleteAndShow = async (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete ${item.name}\n, You won't be able to revert this!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await fetchDeleteProduct(item._id)
        if (result.status) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });

        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Delete Failure! Try again please"
          });
        }
      }
    });
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


  const onDeleteImage = (id) => {
    setCurProduct(pre => {
      const newPre = { ...pre }
      return {
        ...newPre,
        image: newPre.image.filter((e, i) => !(i == id))
      }
    })
  }

  const validateValue = () => {
    if( !curProduct.name || !curProduct.size || !curProduct.origin || !curProduct.quantity || curProduct.image.length == 0) {
      return false
    }

    if( curProduct.price < 0 || curProduct.quantity < 0) {
      return false
    }

    return  true
  }

  const onUpdatePress = () => {
    if(validateValue()) {
      setUpDialogUpdateAndShow(curProduct)
    } else {
      setShow(false)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid infomation!"
      }).then((response) => {
        if(response.isConfirmed) {
          setShow(true)
        }
      });
    }
  }

  console.log('curProduct: ', curProduct)

  return (
    <div className="container mt-3">
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        style={{ width: '100%', marginBottom: 20 }}
        onChange={(e) => {
          if (!e.target.value || e.target.value == '') {
            console.log('Key search empty')
            setKeySearch('')
            setPage(1)
            return
          } else {
            setKeySearch(e.target.value)
          }

        }}
      />
      <table style={{ display: products.length == 0 && 'none' }} className="table table-bordered">
        <thead>
          <tr>
            <th>INDEX</th>
            <th>NAME</th>
            <th>IMAGE</th>
            <th>PRICE</th>
            <th>SIZE</th>
            <th>ORIGIN</th>
            <th>QUANTITY</th>
            <th>CATEGORY</th>
            <th>OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {
            products.map((e, i) => {
              return (
                <tr key={i.toString()}>
                  <td>{i + 1}</td>
                  <td>{e.name}</td>
                  <td><img src={e.image[0]} style={{ width: 20, height: 20 }} /></td>
                  <td>{formatCurrency(e.price)}</td>
                  <td>{e.size}</td>
                  <td>{e.origin}</td>
                  <td>{e.quantity}</td>
                  <td>{e.category.name}</td>
                  <td>
                    <Button onClick={() => handleUpdate(i)} style={{ backgroundColor: 'green', marginRight: 10 }}>Update</Button>
                    <Button onClick={() => handleDelete(i)} style={{ backgroundColor: '#6b170c' }}>Delete</Button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <Button onClick={() => { console.log('View more...'); setPage(pre => pre + 1) }} style={{ marginTop: 10, marginBottom: 20, display: keySearch ? 'none' : 'flex' }}>View more product</Button>

      <Dialog open={showDialog} >
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form below.
          </DialogContentText>
          <TextField value={curProduct && curProduct.name} onChange={(e) => {
            setCurProduct(pre => ({ ...pre, name: e.target.value }))
          }} autoFocus margin="dense" id="name" label="Product Name" type="text" fullWidth variant="standard" />
          <TextField value={curProduct && curProduct.price} onChange={(e) => {
            setCurProduct(pre => ({ ...pre, price: parseInt(e.target.value) }))
          }} margin="dense" id="price" label="Product Price" type="number" fullWidth variant="standard" />
          <TextField value={curProduct && curProduct.size} onChange={(e) => {
            setCurProduct(pre => ({ ...pre, size: e.target.value }))
          }} margin="dense" id="size" label="Product Size" type="text" fullWidth variant="standard" />
          <TextField value={curProduct && curProduct.origin} onChange={(e) => {
            setCurProduct(pre => ({ ...pre, origin: e.target.value }))
          }} margin="dense" id="origin" label="Product Origin" type="text" fullWidth variant="standard" />
          <TextField value={curProduct && curProduct.quantity} onChange={(e) => {
            setCurProduct(pre => ({ ...pre, quantity: parseInt(e.target.value)}))
          }} margin="dense" id="quantity" label="Product Quantity" type="number" fullWidth variant="standard" />
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
            curProduct && (
              curProduct.image.map((e, i) => {
                return (
                  <img onClick={() => onDeleteImage(i)} key={i.toString()} style={{ width: 50, height: 50 }} src={e} />
                )
              })
            )
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShow(false)} >Cancel</Button>
          <Button onClick={onUpdatePress} style={{ backgroundColor: 'green' }}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Product;