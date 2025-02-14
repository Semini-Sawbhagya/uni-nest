import React from 'react'
import './Payment.css'
import { Form, Button } from 'react-bootstrap'
import BankCard from '../../../assets/bank_card.png'

const Payment = () => {
  return (
    <div className='payment-class'>
      <h2>Payment</h2>
      <div className='payment'>
        <img src={BankCard} alt="" />
        <Form className='payment-form'>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Landlord's AccountNumber</Form.Label>
            <Form.Control type="text" placeholder="Landlord Account Number" />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Amount</Form.Label>
            <Form.Control type="text" placeholder="Enter the amount" />
          </Form.Group>
        </Form>
      </div>
       
     
      
    </div>
  )
}

export default Payment