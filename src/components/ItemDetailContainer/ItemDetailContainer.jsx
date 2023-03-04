import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { getProducto } from "../../assets/firebase";
import ItemDetail from "../ItemDetail/ItemDetail";

const ItemDetailContainer = () => {
    
    const [producto,setProducto] = useState([]);
    const {id}=useParams();
    
    useEffect(() => {
        getProducto(id).then(prod =>setProducto(prod))      
    }, []);




    return (
        <div className="card cardProductoDetail itemDetail">
            <ItemDetail producto={producto}/>                        
        </div>
    );
}

export default ItemDetailContainer;
