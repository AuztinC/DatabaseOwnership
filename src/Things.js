import React from "react"

const Things = ({ things, users, removeOwner, addOwner})=> {

    return (
        <div>
        <h2>Things ({ things.length })</h2>
        <ul>
          {
            things.map((thing)=>{
              return (
                <li key={thing.id}>
                  {thing.name}
                  <ul>
                    {
                      users.map(user=>{
                        return (
                          <li key={user.id} className={ thing.user_id === user.id ? "owner" : ""}>
                            { user.name }
                            {
                              thing.user_id === user.id ? (
                                <button onClick={()=>removeOwner(thing)}>Remove</button>
                              ) : (
                                <button onClick={()=> addOwner(thing, user)}>Add</button>
                              )

                            }
                          </li>
                        )
                      })
                    }
                  </ul>
                  </li>
              )
            })
          }
        </ul>
      </div>
    )
}

export default Things