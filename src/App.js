import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

//! get local storage list data
const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditiId] = useState(null);
  const [alert, setAlert] = useState({
    show: true,
    msg: "",
    type: "",
  });

  //! functions
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!name) {
      //? show alert if value empty
      showAlert(true, "danger", "Check your input");
    } else if (name && isEditing) {
      //? edit the value
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditiId(null);
      setIsEditing(false);
      showAlert(true, "success", "value changed");
    } else {
      //? add the new value
      showAlert(true, "success", "Item added");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };
  const clearList = () => {
    showAlert(true, "danger", "list emptied");
    setList([]);
  };
  const removeItem = (id) => {
    showAlert(true, "danger", "item removed");
    setList(list.filter((item) => item.id !== id));
  };
  const editItem = (id) => {
    const editedItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditiId(id);
    setName(editedItem.title);
  };
  //! save to local storage whenever the list changes
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>Grocery bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="eg. eggs"
            value={name}
            onChange={(evt) => {
              setName(evt.target.value);
            }}
          />
          <button className="submit-btn" type="submit">
            {isEditing ? "Edit" : "Submit"}
          </button>
        </div>
      </form>
      {/* if list length > 0 display list */}
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            Clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
