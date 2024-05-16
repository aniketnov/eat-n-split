import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectionFriend, setSelectedFriend] = useState(false);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
    setSelectedFriend(false);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }
  function handleselection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((selected) =>
      selected.id === friend.id ? false : friend
    );
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friend) =>
      friend.map((friend) =>
        friend.id === selectionFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Header />
        <Friend
          friends={friends}
          onSelection={handleselection}
          selectionFriend={selectionFriend}
        />

        {showAddFriend && <FormAddPerson onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      {selectionFriend && (
        <Formsplitbill
          selectionFriend={selectionFriend}
          onSplitBill={handleSplitBill}
          key={selectionFriend.id}
        />
      )}
    </div>
  );
}

function Friend({ friends, onSelection, selectionFriend }) {
  return (
    <ul>
      {friends.map((person) => (
        <Friendslist
          onSelection={onSelection}
          person={person}
          key={person.id}
          selectionFriend={selectionFriend}
        />
      ))}
    </ul>
  );
}

function Friendslist({ person, onSelection, selectionFriend }) {
  const isSelected = selectionFriend.id === person.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={person.image} alt={person.name} />
      <h3>{person.name}</h3>
      {person.balance < 0 && (
        <p className="red">
          you own {person.name} 💵{Math.abs(person.balance)}
        </p>
      )}
      {person.balance > 0 && (
        <p className="green">
          {person.name} owns you 💵{Math.abs(person.balance)}
        </p>
      )}
      {person.balance === 0 && <p>you and {person.name} are even</p>}
      <Button onClick={() => onSelection(person)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}

function FormAddPerson({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleNewFriend(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <>
      <form className="form-add-friend" onSubmit={handleNewFriend}>
        <lebal>
          <h3>🧑Friend Name</h3>
        </lebal>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <lebal>
          <h3>🔗Image URL</h3>
        </lebal>
        <input
          type="url"
          placeholder="https://i.pravatar.cc/48?u=933372"
          onChange={(e) => setImage(e.target.value)}
          value={image}
        />
        <Button>Add</Button>
      </form>
    </>
  );
}

function Formsplitbill({ selectionFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [expense, setExpense] = useState("");
  const frdExpense = bill ? bill - expense : "";
  const [paidByUser, setPaidByUser] = useState("user");

  function handleNewFriend(e) {
    e.preventDefault();
    if (!bill || !expense) return;
    const data = paidByUser === "user" ? frdExpense : -frdExpense;
    onSplitBill(data);
  }

  return (
    <form className="form-split-bill" onSubmit={handleNewFriend}>
      <h2>Split a bill with {selectionFriend.name}</h2>
      <lebal>
        <h3>💲 Bill value</h3>
      </lebal>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <lebal>
        <h3>🙍‍♂️ Your expense</h3>
      </lebal>
      <input
        type="text"
        value={expense}
        onChange={(e) =>
          setExpense(
            Number(e.target.value) > bill ? expense : Number(e.target.value)
          )
        }
      />
      <lebal>
        <h3>👩🏻‍🤝‍🧑🏼 {selectionFriend.name} expense</h3>
      </lebal>
      <input type="text" disabled value={frdExpense} />
      <label>
        <h3>✋ Who is paying the bill</h3>
      </label>
      <select
        value={paidByUser}
        onChange={(e) => setPaidByUser(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectionFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

function Header() {
  return (
    <div>
      <h1>Eat Split Bill</h1>
    </div>
  );
}
