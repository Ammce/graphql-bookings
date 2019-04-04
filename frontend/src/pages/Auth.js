import React, { Component } from 'react';

import './Auth.css';

import AuthContext from '../context/auth-context';

class Auth extends Component {

    state = {
        isLogin: true
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = event => {
        this.setState(prevState => {
            return {
                isLogin: !prevState.isLogin
            }
        })
    }

    submitHandler = event => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
              mutation {
                createUser(data: {email: "${email}", password: "${password}"}) {
                  _id
                  email
                }
              }
            `
        };

        if (this.state.isLogin) {
            requestBody = {
                query: `
                  query {
                    login(email: "${email}", password: "${password}") {
                      token
                      userId
                      tokenExpiration
                    }
                  }
                `
            };
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                return res.json();
            })
            .then(respData => {
                if(respData.data.login.token){
                    this.context.login(respData.data.login.token, respData.data.login.userId, respData.data.login.tokenExpiration)
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" ref={this.emailEl} />
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEl} />
                </div>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
                </div>
            </form>
        );
    }
}

export default Auth;