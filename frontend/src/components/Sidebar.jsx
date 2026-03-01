import {Link} from "react-router-dom"; 

function Sidebar({title, links}) {
    return (
        <div style={{padding:"30px"}}>
            <h2 style={{marginBottom: "30px"}}>{title}</h2>

            <nav style={{display:"flex", flexDirection: "column", gap:"15px"}}>
                {links.map((link, index) => (
                    <Link key={index} to={link.to}>
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export default Sidebar; 