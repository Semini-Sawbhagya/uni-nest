import React, { useEffect, useState } from 'react';
import './Payment.css';
import { Form, Button } from 'react-bootstrap';
import BankCard from '../../../assets/bank_card.png';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Payment = () => {
  const [userId, setUserId] = useState('');
  const [landLordUserId, setLandLordUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [landlordAcountNo, setLandlordAccountNo] = useState('');
  const [landlordName, setLandlordName] = useState('');

  useEffect(() => {
    const token = Cookies.get('accessToken'); 
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      console.log('Token not found in cookies.');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLandlordId(userId);
    }
  }, [userId]);

  const fetchLandlordId = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/get-landlord-details/${userId}`);
      console.log("API Response:", response.data);  // ✅ Debugging: Check if API returns correct data
      setLandLordUserId(response.data.landlord_user_id); 
      setLandlordAccountNo(response.data.account_no);
      setLandlordName(response.data.name);
    } catch (error) {
      console.error("Error fetching landlord ID:", error);
    }
  };
  

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!landLordUserId) {
      alert("Landlord ID not found!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/student-payment/", {
        user_id: userId,  // Fixed
        amount: parseFloat(amount),
      });

      alert(response.data.message);
      setAmount(""); // Clear input field after payment
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className='payment-class'>
      <h2>Payment</h2>
      <div className='payment'>
        <img src={BankCard} alt="" />
        <Form className='payment-form' onSubmit={handlePayment}>

        <Form.Group controlId="formLandlordAccountNo">
        <Form.Label>Landlord's Account No</Form.Label>
        <Form.Control 
          type="text" 
          value={landlordAcountNo || ''}  // Prevents uncontrolled input warning
          placeholder="Fetching Landlord AccountNo..." 
          readOnly 
        />
        </Form.Group>
        <Form.Group controlId="formLandlordName">
        <Form.Label>Landlord's Name</Form.Label>
        <Form.Control 
          type="text" 
          value={landlordName || ''}  // Prevents uncontrolled input warning
          placeholder="Fetching Landlord Name..." 
          readOnly 
        />
      </Form.Group>

          <Form.Group controlId="formAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter the amount" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">Pay Now</Button>
        </Form>
      </div>
    </div>
  );
}

export default Payment;
