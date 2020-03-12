import React, { useState, useEffect } from "react";
import axios from "axios";
const INITIAL_STATE = { name: "", bio: "" };

const Form = props => {
  const { users, setUsers, userToEdit, setUserToEdit } = props;
  const [user, setUser] = useState({
    name: userToEdit?.name || "",
    bio: userToEdit?.bio || ""
  });

  const handleChange = e =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    !userToEdit
      ? axios
          .post("http://localhost:4000/api/users", user)
          .then(res => {
            setUsers([...users, { ...res.data.newUser }]);
            setUser(INITIAL_STATE);
          })
          .catch(err => console.log(err))
      : axios
          .put(`http://localhost:4000/api/users/${userToEdit?.id}`, user)
          .then(res => {
            console.log(res.data);
            setUsers(
              users.map(u =>
                u.id === userToEdit.id ? { ...u, ...res.data.updatedUser } : u
              )
            );
            setUserToEdit({});
          })
          .catch(err => console.log(err));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <input
        name="name"
        placeholder="name"
        value={user.name}
        onChange={handleChange}
      />
      <textarea
        name="bio"
        placeholder="bio"
        value={user.bio}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>
        {userToEdit ? "Save Changes" : "Add New User"}
      </button>
    </div>
  );
};

export default Form;
