import { useState } from "react";
import EditableListItem from "./EditableListItem";
import Modal from "../modals/ExampleModal";


//let list = ["list item 1", "list item 2", "list item 3", "list item 4"]

function EditableList({itemList}) {
  const [isModalOpen, setModalOpen] = useState(false);

  const addItem = (event) => {
      event.preventDefault()
      itemList.push(event.target.elements.newItem.value)
  }

  return (
      <div>
          <p>{JSON.stringify(itemList)}</p>
          {list.map((item, key) => (<EditableListItem key={key} value={item}></EditableListItem>))}
          <button onClick={() => setModalOpen(true)}>Add Item</button>
          {isModalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <h2>New List Item</h2>
            <p>This is modal content.</p>
            <form onSubmit={addItem}>
              <label htmlFor="newItem">New Item:</label>
              <input id="newItem" type="text"></input>
              <button type="submit">Add</button>
            </form>
          </Modal>
        )}
      </div>
  );
}

export default EditableList 
