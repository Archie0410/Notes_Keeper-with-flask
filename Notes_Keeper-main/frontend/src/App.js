import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import List from "./List";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true); // Spinner state
  const [userName, setUserName] = useState("");

  // Fetch user name from /api/protected
  function fetchUserName() {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:5000/api/protected", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // Assuming backend returns: { msg: "Hello, <name>! This is a protected route." }
        const match = data.msg && data.msg.match(/Hello, (.+?)!/);
        setUserName(match ? match[1] : "");
      })
      .catch(() => setUserName(""));
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetch("http://localhost:5000/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setNotes(Array.isArray(data) ? data : data.notes || []))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
      fetchUserName(); // Fetch user name on load if logged in
    } else {
      setLoading(false);
    }
  }, []);

  function handleLogin() {
    setIsLoggedIn(true);
    const token = localStorage.getItem("token");
    setLoading(true);
    fetch("http://localhost:5000/api/notes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setNotes(Array.isArray(data) ? data : data.notes || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
    fetchUserName(); // Fetch user name after login
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setNotes([]);
    setUserName("");
  }

  function addNote(newNote) {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newNote),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.note) {
          setNotes((prev) => [...prev, data.note]);
        } else if (data.id || data._id) {
          setNotes((prev) => [...prev, data]);
        }
      })
      .catch((err) => console.error(err));
  }

  function updateNote(id, updatedNote) {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedNote),
    })
      .then((res) => res.json())
      .then((data) => {
        setNotes((prev) =>
          prev.map((note) =>
            (note.id || note._id) === id ? { ...note, ...data } : note
          )
        );
      })
      .catch((err) => console.error(err));
  }

  function deleteNote(id) {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setNotes((prev) => prev.filter((note) => (note.id || note._id) !== id));
        } else {
          console.error("Failed to delete note");
        }
      })
      .catch((err) => console.error(err));
  }

  // Spinner while loading notes
  if (loading) {
    return <div className="spinner">Loading notes...</div>;
  }

  // Show Register or Login if not logged in
  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <Register
          onRegister={() => setShowRegister(false)}
          onGoBack={() => setShowRegister(false)}
        />
      );
    }
    return (
      <div>
        <Login onLogin={handleLogin} />
        <p className="centered-redirect">
          Don't have an account?{" "}
          <button onClick={() => setShowRegister(true)}>Register</button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <Header userName={userName} onLogout={handleLogout} />
      <CreateArea onAdd={addNote} />
      <div className="notes-container">
  {Array.isArray(notes) &&
    notes.map((noteItem) => {
      // ...your note rendering logic...
      return (
        <Note
          key={noteItem.id || noteItem._id}
          id={noteItem.id || noteItem._id}
          title={noteItem.title}
          content={noteItem.content}
          onDelete={deleteNote}
          onUpdate={updateNote}
        />
      );
    })}
</div>
      <Footer />
    </div>
  );
}

export default App;
