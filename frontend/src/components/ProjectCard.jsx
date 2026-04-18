import { useNavigate } from "react-router";

function ProjectCard({project, onRemove, onEditClick}) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/projects/${project.id}/`);
    }
    return (
        <div onClick={handleClick} style={cardStyle}>
            <h3 style={{textAlign:"center"}}>{project.name}</h3>
            <p style={descStyle}>{project.description}</p>
        </div>
    );
}

const descStyle = {
    lineHeight: "1.5rem",
    minHeight: "4.5rem",
    overflowWrap: "break-word",
};

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