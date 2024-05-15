import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { json } from 'react-router-dom';
import Swal from 'sweetalert2';

const LoginComponent = ({ saveUser }) => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const fetchLogin = async () => {
        const body = {
            email: email,
            password, password
        }
        const response = await fetch('http://localhost:7000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res)
            .catch(err => console.log('err: ', err))
        const result = await response.json()

        console.log('result ', result)
        if (result.status) {
            Swal.fire({
                title: "Good job!",
                text: "Login Success!",
                icon: "success"
            });

            saveUser(result.user)
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid Email or Pass!",
            });
        }

    }
    

    const handleLogin = async () => {
        if (!password || !email) {

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid Infomation!",
            });
            console.log('Invalid infomation')
            return
        }
        await fetchLogin()
    }

    return (
        <Container style={{ maxWidth: "500px", margin: "auto", marginTop: "100px", padding: "30px", boxShadow: "0px 0px 10px 0px" }}>
            <h3 className="text-center">Đăng Nhập</h3>
            <Form style={{ textAlign: 'left' }}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control onChange={handleEmail} type="email" placeholder="Nhập email của bạn" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" style={{ marginBottom: 10 }}>
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control onChange={handlePassword} type="password" placeholder="Nhập mật khẩu của bạn" />
                </Form.Group>
                <Button onClick={handleLogin} variant="primary" type="button">
                    Đăng nhập
                </Button>
            </Form>
        </Container>
    );
}

export default LoginComponent;