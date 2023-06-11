import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0
  }
];

const App = () => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriend] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const showAddFormHandle = () => {
    setShowAddFriend(prev => !prev);
  };

  const addFriendHandler = friend => {
    setFriend(prev => [...prev, friend]);
    setShowAddFriend(false);
  };

  const selectFriendHandler = friend => {
    // setSelectedFriend(friend);
    setSelectedFriend(prev => (prev?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  };

  const splitBillHandler = value => {
    setFriend(friends =>
      friends.map(friend =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          selectedFriend={selectedFriend}
          onSelection={selectFriendHandler}
          friends={friends}
        />
        {showAddFriend && <FormAddFriend onAddFriend={addFriendHandler} />}
        <Button onClick={showAddFormHandle}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          key={selectedFriend.id}
          selectedFriend={selectedFriend}
          onSplitBill={splitBillHandler}
        />
      )}
    </div>
  );
};

function FriendsList({ selectedFriend, onSelection, friends }) {
  return (
    <ul>
      {friends.map(friend => (
        <Friend
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          friend={friend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function Friend({ selectedFriend, onSelection, friend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {friend.balance} ₹
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)} ₹
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const id = crypto.randomUUID();
  const submitHandler = e => {
    e.preventDefault();
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id
    };

    onAddFriend(newFriend);

    setImage("https://i.pravatar.cc/48");
    setName("");
  };

  return (
    <form className="form-add-friend" onSubmit={submitHandler}>
      <label>👫 Friend name</label>
      <input onChange={e => setName(e.target.value)} type="text" value={name} />

      <label>🌐 Image url</label>
      <input
        onChange={e => setImage(e.target.value)}
        value={image}
        type="text"
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ onSplitBill, selectedFriend }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setpaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const submitHandler = e => {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  };

  return (
    <form onSubmit={submitHandler} className="form-split-bill">
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💵 Bill value</label>
      <input onChange={e => setBill(e.target.value)} value={bill} type="text" />

      <label>💸 Your expense</label>
      <input
        value={paidByUser}
        onChange={e =>
          setpaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
        type="text"
      />

      <label>👥 {selectedFriend.name}'s expense</label>
      <input value={paidByFriend} type="text" disabled />

      <label>💰Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChangeCapture={e => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}

export default App;
