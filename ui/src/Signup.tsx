import React, { useState, useCallback } from 'react';
import styled from "styled-components";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

interface User {
    username: string;
    password: string;
}

// Componentのstyleを直接いじるのは、JSでどうしても動的に変化させたい時だけと言う信念
// Styled-Componentを使います
const Host = styled.div`
    margin-top: 10px;
`;

const Content = styled.div`
    margin-top:'30px';
`;

// React hooks を使いFCコンポーネントへと
const Signup = () => {

    // Userの構造体が増えるたびにStateが増えるのはクソなのでUserObjectにまとめる
    const [newSignupStatus, setNewSignupStatus] = useState<User>({ username: '', password: '' })
    
    // memorizeします
    // https://ja.reactjs.org/docs/hooks-reference.html#usecallback
    const postDataHandler = useCallback(
        // async/await構文を用います
        async () => {
            // axiosでも問題ないです
            const response = await fetch(
                "http://localhost:1323/signup",
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
        // newUserをdependenciesに追加することをわすれずに！
        [newSignupStatus]
    );

    // memorizeします
    // https://ja.reactjs.org/docs/hooks-reference.html#usecallback
    const changeUserNameHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            setNewSignupStatus(x => ({ ...x, username: e.target.value }));
        },
        // React は再レンダー間で dispatch 関数の同一性が保たれ、変化しないことを保証します。従って useEffect や useCallback の依存リストにはこの関数を含めないでも構いません。(公式より)
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
