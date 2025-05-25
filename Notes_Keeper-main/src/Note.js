import React, { useState } from "react";

function Note({ id, title, content, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);

  function handleUpdate(e) {
    e.preventDefault();
    if (editTitle.trim() && editContent.trim()) {
      onUpdate(id, { title: editTitle, content: editContent });
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <div className="note">
        <form onSubmit={handleUpdate}>
          <input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            required
          />
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            required
          />
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="note">
      <h1>{title}</h1>
      <p>{content}</p>
      <div className="note-buttons">
        <button onClick={() => onDelete(id)}>Delete</button>
        <button onClick={() => setEditing(true)}>Edit</button>
      </div>
    </div>
  );
}

export default Note;