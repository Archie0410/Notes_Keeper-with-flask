import React, { useState } from "react";

function Register({ onRegister, onGoBack }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then((res) => res.json().then(data => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 201) {
          setSuccess("Registration successful! You can now log in.");
          setForm({ name: "", email: "", password: "" });
          if (onRegister) onRegister();
        } else {
          setError(data.msg || "Registration failed.");
        }
      })
      .catch(() => setError("Server error. Please try again later."));
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <div style={{color: "red"}}>{error}</div>}
      {success && <div style={{color: "green"}}>{success}</div>}
      <button
        type="button"
        style={{
          marginTop: "16px",
          background: "none",
          border: "none",
          color: "#f9c74f",
          fontWeight: "bold",
          cursor: "pointer",
          textDecoration: "underline"
        }}
        onClick={onGoBack}
      >
        Go back to Login
      </button>
    </div>
  );
}

export default Register;