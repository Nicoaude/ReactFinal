import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { createOrdenCompra, getOrdenCompra, getProducto, updateProducto} from '../../assets/firebase';
import { useCarritoContext } from '../../context/CartContext';

import './Checkout.css'


const Checkout = () => {
    const initialValues={nombreCompleto: "", email: "", validateEmail: "", DNI: "", celular: "", direccion: ""}
    const [formValues, setFormValues]=useState(initialValues);
    const [formErrors, setFormErrors]=useState({});
    const [isSubmit, setIsSubmit] = useState(false);    
    const {totalPrice, carrito, emptyCart} = useCarritoContext()
    const datosFormulario = React.useRef()
    let navigate = useNavigate()
    //Realizo un check antes de completar el formulario por si no hay stock, por mas comodidad para el usuario
    const checkCarritoVacio = [...carrito]
    checkCarritoVacio.forEach(prodCarrito => {
        getProducto(prodCarrito.id).then(prodBDD => {
            if(prodBDD.stock < prodCarrito.cant) {
                toast.error(`El producto ${prodBDD.nombreAMostrar} no tiene stock, se le ha devuelto al inicio para elegir otro producto.`);                    
                emptyCart();
                navigate("/")                          
            }
        })            
    })

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            consultarFormulario();
        }
      }, [formErrors]);


    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        e.target.reset()
    };

    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    }

    const validate = (values)=>{
        const errors ={};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;      
        if (!values.nombreCompleto) {
            errors.nombreCompleto = "Debe ingresar un nombre y apellido";
        }
        if (!values.email) {
            errors.email = "Debe ingresar un email";
        } else if (!regex.test(values.email)) {
            errors.email = "El email ingresado no es válido";
        }
        if (!values.validateEmail){
            errors.validateEmail = "Ingrese nuevamente el email";            
        }else if (!regex.test(values.validateEmail)) {
            errors.validateEmail = "El email ingresado no es válido";
        }else if (values.validateEmail!==values.email){
            errors.validateEmail = "El email ingresado no coincide";
        }
        if (!values.DNI){
            errors.DNI="Ingrese su DNI";
        }
        if (!values.celular){
            errors.celular="Ingrese su número de teléfono";
        }
        if (!values.direccion){
            errors.direccion="Ingrese una dirección válida";
        }
        return errors;
    };



    const consultarFormulario = (e) => {
        const datForm = new FormData(datosFormulario.current)
        const cliente = Object.fromEntries(datForm)
        const aux = [...carrito]
        aux.forEach(prodCarrito => {
            getProducto(prodCarrito.id).then(prodBDD => {
                if(prodBDD.stock >= prodCarrito.cant) {
                    prodBDD.stock -= prodCarrito.cant
                    updateProducto(prodCarrito.id, prodBDD)                    
                } else {
                    toast.error(`El producto ${prodBDD.nombreAMostrar} no tiene stock`);                    
                    emptyCart();
                    navigate("/")                      
                }
            })            
        })

        delete cliente["validateEmail"];

        createOrdenCompra(cliente,totalPrice(), new Date().toISOString().slice(0,10)).then(ordenCompra => {
            getOrdenCompra(ordenCompra.id).then(item => {
                toast.success(`¡Muchas gracias por su compra, su orden es ${item.id}`)
                emptyCart()              
                navigate("/")
            }).catch(error => {
                toast.error("No se ha podido registrar su orden. Inténtelo nuevamente.")
                console.error(error)
            })                
        })

    }

    return (
        <div className="container espaciadoNav">
            <form onSubmit={handleSubmit} ref={datosFormulario}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre y Apellido</label>
                    <input type="text" className="form-control" name="nombreCompleto"  value={formValues.nombreCompleto} onChange={handleChange}/>
                    <p className='colorMensajeCheckout'>{formErrors.nombreCompleto}</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="text" className="form-control" name="email" value={formValues.email} onChange={handleChange}/>
                    <p className='colorMensajeCheckout'>{formErrors.email}</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="email2" className="form-label">Repetir Email</label>
                    <input type="text" className="form-control" name="validateEmail" value={formValues.validateEmail} onChange={handleChange}/>
                    <p className='colorMensajeCheckout'>{formErrors.validateEmail}</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="dni" className="form-label">DNI</label>
                    <input type="number" className="form-control" name="DNI" value={formValues.DNI} onChange={handleChange}/>
                    <p className='colorMensajeCheckout'>{formErrors.DNI}</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="celular" className="form-label">Celular</label>
                    <input type="number" className="form-control" name="celular" value={formValues.celular} onChange={handleChange}/>
                    <p className='colorMensajeCheckout'>{formErrors.celular}</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">Dirección</label>
                    <input type="text" className="form-control" name="direccion"  value={formValues.direccion} onChange={handleChange}/>
                    <p className='colorMensajeCheckout'>{formErrors.direccion}</p>
                </div>
                <button type="submit" className="btn btn-primary">Finalizar Compra</button>
            </form>

        </div>
    );
}

export default Checkout;

