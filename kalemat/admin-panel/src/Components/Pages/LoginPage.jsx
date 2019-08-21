import React, { Component } from 'react'
import styled from 'styled-components'
import { auth } from 'firebase/app'
import 'firebase/auth'
import { toast } from 'react-toastify'

// Styles
import { Button } from '../Styles'

export default class LoginPage extends Component {
    state = {
        email: '',
        password: ''
    }

    handleInputChange = ({ target: { name, value } }) => {
        this.setState({
            [name]: value
        })
    }

    handleLoginButtonClick = (e) => {
        e.preventDefault()

        const { email, password } = this.state

        console.log(email);
        console.log(password);

        auth().signInWithEmailAndPassword(email, password)
            .catch(e => {
                toast.error(e.message)
                console.log('Authentication error', e.message)
            })
    }

    render = () =>
        <LoginPageWrapper>
            <Container>
                <Title>Authentication</Title>

                <form onSubmit={this.handleLoginButtonClick}>
                    <Input
                        placeholder="E-mail"
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                    />
                    <Input
                        placeholder="password"
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                    />

                    <Button type="submit">Log in</Button>
                </form>
            </Container>
        </LoginPageWrapper>
}

const

    LoginPageWrapper = styled.div`
        height: 100vh;
        width: 100vw;

        background: center url('https://images.unsplash.com/photo-1470104240373-bc1812eddc9f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=55331e0f4e106640b86ae0fe66f7c1e1&auto=format&fit=crop&w=1050&q=80') no-repeat;
        background-size: cover;

        display: flex;
        justify-content: center;
        align-items: center;
    `,

    Title = styled.h1`
        color: #636979;
        font-weight: 100;

        margin-bottom: 50px;
    `,

    Container = styled.div`
        width: 280px;
        height: auto;

        padding: 40px 50px 60px;

        background: rgba(255,255,255,.96);
        box-shadow: 0 0 3px rgba(0,0,0,.1);

        text-align: center;
    `,

    Input = styled.input`
        box-sizing: border-box;
        width: 100%;

        padding: 8px;
        margin-bottom: 40px;

        border: 1px solid #DADCEF;
        background: none;

        outline: none;
    `