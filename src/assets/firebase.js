
import { initializeApp } from "firebase/app";
import {getFirestore, addDoc, getDocs, getDoc, updateDoc, deleteDoc, collection, doc} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyD6ji-2gYxnktV5rdBo7nml_4sg2uN_VJQ",
    authDomain: "ecommerce-mercadito.firebaseapp.com",
    projectId: "ecommerce-mercadito",
    storageBucket: "ecommerce-mercadito.appspot.com",
    messagingSenderId: "206606140358",
    appId: "1:206606140358:web:c5bf271c8dbd0b4fc468c7"
  };  

const app = initializeApp(firebaseConfig);

const db = getFirestore();

const getProductos = async() => {
    const productos = await getDocs(collection(db, "productos"))
    const items = productos.docs.map(prod => {
        return {...prod.data(), id: prod.id}
    })
    return items
}

const getProducto =  async (id) => {
    const producto = await getDoc(doc(db, "productos", id))
    const item = {...producto.data(), id: producto.id}
    return item
}

const updateProducto = async (id, info) => {
    const estado = await updateDoc(doc(db,"productos", id), info)
    return estado
}

const deleteProducto = async(id) =>{
    const estado = await deleteDoc(doc(db, "productos", id))
    return estado
}

const createOrdenCompra = async (cliente, preTotal, fecha ) => {
    const ordenCompra = await addDoc(collection(db, "ordenCompra"),{
        nombreCompleto: cliente.nombreCompleto,
        dni: cliente.DNI,
        celular: cliente.celular,
        direccion: cliente.direccion,
        email: cliente.email,
        fecha: fecha,
        precioTotal: preTotal
    })

    return ordenCompra
}

const getOrdenCompra =  async (id) => {
    const ordenCompra = await getDoc(doc(db, "ordenCompra", id))
    const item = {...ordenCompra.data(), id: ordenCompra.id}
    return item
}

export { getProductos, getProducto, updateProducto, deleteProducto, createOrdenCompra, getOrdenCompra}