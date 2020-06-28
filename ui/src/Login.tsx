import React, { useState, useCallback, useContext, useEffect} from 'react';
import styled from "styled-components";
import {LoginContext, UsernameContext} from "./Totalprovider";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

interface User {
    username: string;
    password: string;
}

interface LocalLogin {
    state: boolean;
    username: string;
}

const Host = styled.div`
    margin-top: 10px;
`;

const Content = styled.div`
    margin-top:'30px';
`;

const Login = () => {

    const [newLoginStatus, setNewLoginStatus] = useState<User>({ username: '', password: '' })
    const {UsernameState} = useContext(UsernameContext);
//    const [LocalLoginState, setLocalLoginState] = useState<LocalLogin>({state: false, username: ''})
    const {LoginState, setLoginState} = useContext(LoginContext);

    const postDataHandler = useCallback(
        async () => {
            const response = await fetch(
                "http://127.0.0.1:1234/login",
                {
                    headers: {'Content-type':'application/json'},
                    method: "POST",
                    body: JSON.stringify(newLoginStatus)
                }
            ).then(response => response.json())
            .then(data => window.sessionStorage.setItem('gurupen.token', data.token)) // then で data にアクセス
            .then(() => setLoginState(true))
            .then(() => window.sessionStorage.setItem('gurupen.loginstate', "true"))
            .then(() => window.sessionStorage.setItem('gurupen.username', newLoginStatus.username))
            .then(() => alert("Successfully Authentication!"))
            .catch(error => console.error(error))
            .catch(() => alert("Failed Authentication."))

            console.log(response);
            console.log(UsernameState);
            console.log("newLoginStatus.username: " + newLoginStatus.username);
            console.log("UsernameState: " + UsernameState);
            console.log(window.sessionStorage.getItem('gurupen.token'));
            // if (window.sessionStorage.getItem('gurupen') != null){
            //     setLoginState(() => true);
            //     alert("Successfully Authentication!");
            //     //window.location.reload();
            // }
        },
        [newLoginStatus, UsernameState, setLoginState]
    );

    useEffect(() => {
        console.log('first')
        //setLoginState(LocalLoginState.state)
        console.log(LoginState)
    }, [LoginState])

    const changeUserNameHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            setNewLoginStatus(x => ({ ...x, username: e.target.value }));
        },
        [],
    );

    const changePasswordHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            setNewLoginStatus(x => ({ ...x, password: e.target.value }));
        },
        [],
    );

    return (
        <Host>
            <h1>Login</h1>
            <hr></hr>
            <Content className="col-lg-8 offset-lg-2">
                <div className="form-group">
                <TextField className="form-control" value={newLoginStatus.username} onChange={changeUserNameHandler} id="standard-basic" label="Username" />
                </div>
                <div className="form-group">
                <TextField className="form-control" value={newLoginStatus.password} onChange={changePasswordHandler} id="standard-basic" label="Password" />   
                </div>
                <br/>
                <Button className="btn btn-success btn-block" onClick={postDataHandler} variant="contained" color="primary"><i className="fa fa-plus"></i> Login</Button>       
            </Content>
        </Host>
    );
}

export default Login;