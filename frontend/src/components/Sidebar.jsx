import {Link} from "react-router-dom"; 

function Sidebar({title, links}) {
    return (
        <div style={{
            padding: "30px",
            backgroundColor: "#B65353",
            color: "black",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
        }}>
            <h2 style={{marginBottom: "30px"}}>{title}</h2>

            <nav style={{
                display:"flex", 
                flexDirection: "column", 
                gap:"15px",
                marginTop: "20px"
            }}>
                {links.map((link, index) => (
                    <Link key={index} to={link.to} style={{color: "black", textDecoration: "none"}}>
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export default Sidebar; 