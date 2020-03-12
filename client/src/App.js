import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Form from "./Form";

function App() {
  const [users, setUsers] = useState([]);
  const [userToEdit, setUserToEdit] = useState({});
  const deleteUser = id => {
    axios
      .delete(`http://localhost:4000/api/users/${id}`)
      .then(res => setUsers(users.filter(user => user.id !== id)))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/users")
      .then(res => setUsers(res.data.users))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="App">
      <h1>Add New User</h1>
      <Form users={users} setUsers={setUsers} />
      <h1>User List</h1>
      {users.map(user => (
        <div key={user.id}>
          <h2 className="title">
            <span>{user.name}</span>
            <span>
              <span className="delete" onClick={() => setUserToEdit(user)}>
                📝
              </span>{" "}
              <span className="delete" onClick={() => deleteUser(user.id)}>
                ❌
              </span>
            </span>
          </h2>
          <p>{user.bio}</p>
          {userToEdit.id === user.id ? (
            <Form
              userToEdit={userToEdit}
              setUserToEdit={setUserToEdit}
              users={users}
              setUsers={setUsers}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default App;
