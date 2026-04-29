import { useState } from "react";

function ProjectEdit({project, onEdit, onClose, error}) {
    const [title, setTitle] = useState(project.name)
    const [description, setDescription] = useState(project.description)

    return (
        <div style={overlay} onClick={onClose}>
            <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
                <h1 style={{padding : "20px 20px 0px 20px"}}>Edit project</h1>
                <button style={exitButton} onClick={onClose}>✖</button>

                <p style = {{padding : "0px 0px 0px 20px"}}> Some text explaining editing project</p>

                <div style={{ display: "flex", padding: "20px"}}>
                    <div style={{ width: "100%", maxWidth: "840px" }}>
                        <div style={{ marginBottom: "24px" }}>
                            <label>Project Title</label>
                            <input type="text" value={title} style={titleStyle} onChange={e => setTitle(e.target.value)} />
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label>Project Description</label>
                            <textarea type="text" placeholder="Description..." style={descStyle} value={description} onChange={e => setDescription(e.target.value)}/>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button style={buttonStyle} onClick={()=> {onEdit(project.id, {title, description});}}>Save Changes</button>
                        </div>
                        
                    </div>
                </div>

                {error && (
                    <div style={{ color: "red", marginTop: "10px" }}>
                        {error}
                    </div>
                    )}
            </div>
        </div>
    );
}


const titleStyle = {
  width: "95%",
  height: "20px",
  marginTop: "8px",
  padding: "12px 16px",
  background: "#F2F4F8",
  border: "none",
  borderBottom: "1px solid #C1C7CD",
  fontSize: "16px",
  borderRadius : "7px", 
};

const descStyle = {
  width: "95%",
  height: "150px",
  marginTop: "8px",
  padding: "12px 16px",
  background: "#F2F4F8",
  border: "none",
  borderBottom: "1px solid #C1C7CD",
  fontSize: "17px",
  borderRadius : "7px", 
  resize: "none",
  fontFamily: "Arial"
};

const buttonStyle = {
  padding: "12px 32px",
  background: "#121619",
  color: "white",
  borderRadius: "8px",
  border: "none",
  fontSize: "16px",
  cursor: "pointer"
};

const cardStyle = {
  width: "650px",
  background: "white",
  borderRadius: "10px",
  position: "relative",
  padding: "20px"
};

const exitButton = {
    position : "absolute", 
    top:"20px", 
    right: "20px", 
    fontSize: "20px", 
    border : "0",
    background : "transparent", 
    color: "red",
    cursor : "pointer"
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

export default ProjectEdit; 