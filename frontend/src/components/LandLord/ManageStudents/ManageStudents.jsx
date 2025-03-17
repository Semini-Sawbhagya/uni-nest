import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageStudents.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../NavBar/NavBar';

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userId, setUserId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentUserId, setStudentUserId] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      // Get the authorization token from wherever you store it (localStorage, context, etc.)
      //const token = localStorage.getItem('authToken');
      const token = Cookies.get('accessToken');
      const decoded = jwtDecode(token);
      setUserId(decoded.user_id);
      
      // Assuming you have a list of student IDs or a separate endpoint to get all students
      // Here we're using a demo student ID based on your example
      
      const response = await axios.get(`http://localhost:8000/student-details/${decoded.user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Check if response is an array or a single object
      const studentData = Array.isArray(response.data) ? response.data : [response.data];
      setStudents(studentData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch students: ' + (err.response?.data?.detail || err.message));
      setLoading(false);
      console.error('Error fetching students:', err);
    }
  };

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setConfirmDelete(true);
  };

  const confirmDeleteStudent = async () => {
    if (!selectedStudent) return;
    
    try {
      const token =Cookies.get('accessToken');
      await axios.delete(`http://localhost:8000/delete-student/${selectedStudent.student_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove student from state
      setStudents(students.filter(s => s.boarding_id !== selectedStudent.boarding_id));
      setConfirmDelete(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err) {
      setError('Failed to delete student: ' + (err.response?.data?.detail || err.message));
      console.error('Error deleting student:', err);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
    setSelectedStudent(null);
  };

  if (loading) return <div className="loading">Loading students...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div><Navbar />
    <div className="manage-students-container">
      <h1>Manage Students</h1>
      
      <button className="refresh-btn" onClick={fetchStudents}>
        Refresh Student List
      </button>
      
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
              <th>Profile Picture</th>
                <th>Boarding ID</th>
                <th>Name</th>
                <th>Account Number</th>
                <th>Contact</th>
                <th>Address</th>
                
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.boarding_id}>
                  <td>
                    {student.profile_pic && (
                      <img 
                        src={student.profile_pic} 
                        alt="../assets/ns.png" 
                        className="profile-thumbnail" 
                      />
                    )}
                  </td>
                  <td>{student.boarding_id}</td>
                  <td>{student.user_name}</td>
                  <td>{student.account_no}</td>
                  <td>{student.contact}</td>
                  <td>{student.address}</td>
                  
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteClick(student)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete student with account number {selectedStudent.account_no}?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmDeleteStudent}>Yes, Delete</button>
              <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default ManageStudents;