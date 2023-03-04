import { Link } from 'react-router-dom';

const Categorias = () => {
    return (
        <div className="navbar-nav">
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <button className="botonesNavBar"><Link className='nav-link' to={"/categoria/procesadores"}>Procesadores</Link></button>
            <button className="botonesNavBar"><Link className='nav-link' to={"/categoria/graficas"}>Graficas</Link></button>
            <button className="botonesNavBar"><Link className='nav-link' to={"/categoria/motherboards"}>Motherboards</Link></button>
            <button className="botonesNavBar"><Link className='nav-link' to={"/categoria/rams"}>Memorias RAM</Link></button>
            <button className="botonesNavBar"><Link className='nav-link' to={"/categoria/coolers"}>Coolers</Link></button>
            <button className="botonesNavBar"><Link className='nav-link' to={"/categoria/discos"}>Discos</Link></button>
            <button className="botonesNavBar"><Link className='nav-link' to={"/categoria/gabinetes"}>Gabinetes</Link></button>
            <button className="botonesNavBar"><Link className='nav-link' to={"/categoria/fuentes"}>Fuentes</Link></button>
        </div>
      </div>
        
    );
}

export default Categorias;
