import FriendRow from "@/components/FriendRow";
import React, { useState, useEffect } from "react"
import Page from "@/components/Page"

const Request = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch("/api/users", { method: "GET" });
      const { data, error } = await response.json();
      if (error) console.error(`error: ${JSON.stringify(error)}`);
      setUsers(data);
    }
    getUsers();
  }, []);

  return (
    <Page title="Request">
      {users.map((user) => (
        <div className="pt-3" key={user.id}>
          <FriendRow user={user} />
        </div>
      ))}
    </Page>
  )
}

export default Request