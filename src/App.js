import React, { useState } from "react";
import { Table, Button, Modal, Form, InputGroup } from "react-bootstrap";
import axios from 'axios'
import { useEffect } from "react";

function App() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [busqueda, setBusqueda] = useState('')
  const [form, setForm] = useState({
    code: '',
    name: '',
    description: ''
  })

  const url = 'http://chatdoc.eastus.cloudapp.azure.com:8000/api/form'

  useEffect(()=>{
    fetchProducts();
  },[])

  const fetchProducts = async () =>{
    await axios.get(url)
    .then(response=>{
      console.log(response.data);
      setProducts(response.data);
      setFilteredProducts(response.data);
      
    })
    .catch(error=>{
      console.log(error);
    })

  }

  const handleFormEdit = (event) =>{
    const {name, value} = event.target;
    setForm({...form, [name]: value});
    console.log(form.code);
    console.log(form.name);
    console.log(form.description);
  }

  const handleEditButton = (product) =>{
    setSelectedProduct(product);
    setForm({
      code: product.code,
      name: product.name,
      description: product.description
    })
    handleShow();

  }
  const handleEdit = async (e) =>{
    e.preventDefault();
    await axios.put(`${url}/${selectedProduct.id}`,form)
    .then(response=>{
      console.log(response)
    })
    .catch(error=>{
      console.log(error)
    })
    resetForm();
    handleClose();
    fetchProducts();
  }

  const handleDelete = async (id) =>{
    
    await axios.delete(`${url}/${selectedProduct.id}`)
    .then(response=>{
      console.log('se elimino'+ response)
    })
    .catch(error=>{
      console.log('no se puedo eliminar' + error)
    })

    fetchProducts();
  }

  const abrir = () =>{
    resetFormAbrir();
  }

  const handleSearchBar = (event) =>{
    setBusqueda(event.target.value);
    handleSearch(busqueda)
  }

  const handleSearch = (termino) =>{
    if(termino.trim() === ''){
      fetchProducts();
    }
    else{
      const productos = filteredProducts.filter( (product) =>{
        for (const key in product){
          if(product[key] && product[key].toString().toLowerCase().includes(termino.toLowerCase())){
            return product;
          }
        }
      })
  
      setProducts(productos);
    }
  }

  const resetForm = () =>{
    setForm({
      code: '',
      name: '',
      description: ''
    })
  }

  const resetFormAbrir = () =>{
    setForm({
      code: '',
      name: '',
      description: ''
    })

    setSelectedProduct(null);
    handleShow();
  }

  const addProduct = async(event) =>{
    event.preventDefault();
    console.log('pasa por add');
    await axios.post(url,form)
    .then(response=>{
      
      console.log('se agregó' + response);
      
    })
    .catch(error=>{
      console.log('no se agregó' + error);
    })
    handleClose();
    fetchProducts();
    resetForm();
    
  }

  return (
    <>
    <div className="p-3">
    <h1 className="text-center mt-4 mb-4">Formularios</h1>
      <div class="row">
        <div class="col-2">
          <Button variant="primary" onClick={abrir} className="mb-2">
            Añadir
          </Button>
        </div>
        <div class="col-10">
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Buscar en formularios"
              aria-label="Buscar en formularios"
              aria-describedby="basic-addon2"
              value ={busqueda}
              onChange={handleSearchBar}
            />
            
          </InputGroup>
        </div>
      </div>

      <Table striped bordered hover>
        <thead className="bg-secondary text-white">
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products && 
           products.map((product)=>(
            <tr key = {product.id}>
              <td>{product.code} </td>
              <td>{product.name} </td>
              <td>{product.description} </td>

              <td>
                <button onClick={()=>{handleEditButton(product)}}>Editar</button>
                {'   '} 
                <button onClick={()=>{handleDelete(product.id)}}>Eliminar</button>

              </td>
            </tr>

          ))}
          
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir nuevo formulario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={selectedProduct? handleEdit : addProduct}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Código</Form.Label>
              <Form.Control type="text" placeholder="Código" value={form.code} onChange={handleFormEdit} name='code'/>
              <Form.Text className="text-muted">Error código</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Nombre" value={form.name} onChange={handleFormEdit} name='name' />
              <Form.Text className="text-muted">Error Nombre</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Descripcción</Form.Label>
              <Form.Control type="text" placeholder="Descripcción" value={form.description} onChange={handleFormEdit} name='description' />
              <Form.Text className="text-muted">Error Descripcción</Form.Text>
            </Form.Group>

            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" type="submit">
              {selectedProduct? 'Editar' : 'Agregar'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
    
    </>
  );
}

export default App;
