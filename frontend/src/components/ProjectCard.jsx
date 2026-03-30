import { useNavigate } from "react-router-dom";

function ProjectCard({project, onRemove, onEditClick}) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/test");
    }
    return (
        <div onClick={handleClick} style={cardStyle}>
            <h3 style={{textAlign:"center"}}>{project.name}</h3>
            <p style={descStyle}>{project.description}</p>

            <button style={removeStyle} onClick = {(e) => {e.stopPropagation(); onRemove(project.id)}}>
                Remove Project
            </button>

            <button style={editStyle} onClick = {(e) => { e.stopPropagation(); onEditClick(project)}}>
                Edit Project
            </button>
        </div>
    );
}

const descStyle = {
    lineHeight: "1.5rem",
    minHeight: "4.5rem", // 1.5rem × 3 lines
    overflowWrap: "break-word",
};

const removeStyle = {
    margin: "5px",
    background:"#862424",
    borderRadius: "3px", 
    color: "white",
    padding: "5px", 
    border : "0px",
    cursor: "pointer"
}

const editStyle = {
    margin: "5px",
    borderRadius: "3px", 
    padding: "5px",
    border : "0px",
    color: "white", 
    background : "black",
    cursor: "pointer"
}


const cardStyle = {
    border : "1px solid #ccc", 
    padding: "16px",
    borderRadius : "8px",
    marginBottom : "12px",
    background : "#fff", 
    width: "300px",
    cursor:"pointer"
};
export default ProjectCard; 