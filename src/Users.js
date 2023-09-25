import React from 'react';

const Users = ({ users, things })=> {

  return (<>
   <div>
        <h2>Users ({ users.length })</h2>
        <ul>
          {
            users.map((user)=>{
              const usersThings = things.filter(thing=> thing.user_id === user.id)
              return (
                <li key={user.id}>
                  {user.name}
                  ({ usersThings.length })
                  </li>
              )
            })
          }
        </ul>
      </div>
  </>);
};
export default Users
