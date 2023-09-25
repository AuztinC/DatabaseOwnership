import React from 'react';
import ReactDOM from 'react-dom/client';
import { useEffect, useState } from 'react';
import axios from 'axios'
import Users from './Users'
import Things from './Things';

const App = ()=> {
  const [users, setUsers] = useState([])
  const [things, setThings] = useState([])

  useEffect(()=>{
    const fetchUsers = async()=>{
      const response = await axios.get('api/users')
      setUsers(response.data)
    }
    fetchUsers()
  }, [])
  useEffect(()=>{
    const fetchThings = async()=>{
      const response = await axios.get('api/things')
      setThings(response.data)
    }
    fetchThings()
  }, [])

    async function addOwner(thing, user){
      thing = {...thing, user_id: user.id}
      const response = axios.put(`/api/things/${thing.id}`, thing)
      setThings(things.map(_thing=>_thing.id === thing.id ? thing : _thing))
    }
    async function removeOwner(thing){
      thing = {...thing, user_id: null}
      const response = axios.put(`/api/things/${thing.id}`, thing)
      setThings(things.map(_thing=>_thing.id === thing.id ? thing : _thing))
    }

  return (<>
    <h1>thing_tracker</h1>
    <main>
      <Users things={things} users={users} />
      <Things things={things} users={users} addOwner={addOwner} removeOwner={removeOwner}/>
    </main>
  </>);
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
