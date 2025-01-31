import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const fetchUsers = async () => {          //Func to fetch users from the API
    setLoading(true);                       //Loading when we are calling user
    setError(null);                         //Resetting the error(usestate), so the new error can be shown in try catch block
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>        //filteredUsers = filter variable, using filter() method
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="container">
      <h1>Manage Users</h1>
      <div className='bar'>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        <button onClick={fetchUsers} className="refresh-button">Refresh</button>
      </div>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <table className={error ? "hidden" : "user-table"}>
        <thead>
          <tr>
            <th>S No</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.id}>
              <td className="sno">{user.id}</td>
              <td><Link to={`/user/${user.id}`} className="user-link">{user.name}</Link></td>
              <td><Link to={`/user/${user.id}`} className="user-link">{user.email}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={error ? "hidden" : "pagination"}>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage}</span>
        <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={indexOfLastUser >= filteredUsers.length}>Next</button>
      </div>
    </div>
  );
};

export default UserList;
