import React, { useState, useCallback } from 'react';
import styled from "styled-components";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

interface User {
    username: string;
    password: string;
}

const Host = styled.div`
    margin-top: 10px;
`;

const Content = styled.div`
    margin-top:'30px';
`;

const Signup = () => {

    const [newSignupStatus, setNewSignupStatus] = useState<User>({ username: '', password: '' })

    const postDataHandler = useCallback(
        async () => {
            const response = await fetch(
                "http://192.168.1.104:1234/signup",
                {
                    headers: {'Content-type':'application/json'},
                    method: "POST",
                    body: JSON.stringify(newSignupStatus)
                }
            )
            
            console.log(response);
            alert("Successfully Authentication!");
            //window.location.reload();
        },
        [newSignupStatus]
    );

    const changeUserNameHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            setNewSignupStatus(x => ({ ...x, username: e.target.value }));
        },
        [],
    );

    const changePasswordHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            setNewSignupStatus(x => ({ ...x, password: e.target.value }));
        },
        [],
    );

    return (
        <Host>
            <h1>Signup</h1>
            <hr></hr>
            <Content className="col-lg-8 offset-lg-2">
                <div className="form-group">
                
                <TextField className="form-control" value={newSignupStatus.username} onChange={changeUserNameHandler} id="standard-basic" label="Username" />
                </div>
                <div className="form-group">
                <TextField className="form-control" value={newSignupStatus.password} onChange={changePasswordHandler} id="standard-basic" label="password" />
                </div>
                <br/>
                <Button className="btn btn-success btn-block" onClick={postDataHandler} variant="contained" color="primary"><i className="fa fa-plus"></i>Signup</Button>
            </Content>
        </Host>
    );
}

export default Signup;
