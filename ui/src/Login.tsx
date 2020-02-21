import React, { useState, useCallback, useContext, useEffect} from 'react';
import styled from "styled-components";
import {LoginContext, UsernameContext} from "./Totalprovider";

interface User {
    username: string;
    password: string;
}

interface LocalLogin {
    state: boolean;
    username: string;
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
const Login = () => {

    // Userの構造体が増えるたびにStateが増えるのはクソなのでUserObjectにまとめる
    const [newLoginStatus, setNewLoginStatus] = useState<User>({ username: '', password: '' })
    const {UsernameState, setUsernameState} = useContext(UsernameContext);
    const [LocalLoginState, setLocalLoginState] = useState<LocalLogin>({state: false, username: ''})
    const {LoginState, setLoginState} = useContext(LoginContext);

    // memorizeします
    // https://ja.reactjs.org/docs/hooks-reference.html#usecallback
    const postDataHandler = useCallback(
        // async/await構文を用います
        async () => {
            // axiosでも問題ないです
            const response = await fetch(
                "http://localhost:1323/login",
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

            
            //setUsernameState(newLoginStatus.username);
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
        // newUserをdependenciesに追加することをわすれずに！
        [newLoginStatus, UsernameState, LoginState]
    );

    useEffect(() => {
        console.log('first')
        //setLoginState(LocalLoginState.state)
        console.log(LoginState)
    }, [])

    // memorizeします
    // https://ja.reactjs.org/docs/hooks-reference.html#usecallback
    const changeUserNameHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            setNewLoginStatus(x => ({ ...x, username: e.target.value }));
        },
        // React は再レンダー間で dispatch 関数の同一性が保たれ、変化しないことを保証します。従って useEffect や useCallback の依存リストにはこの関数を含めないでも構いません。(公式より)
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
                    User Name: <input type="text" className="form-control" value={newLoginStatus.username} onChange={changeUserNameHandler}/>
                </div>
                <div className="form-group">
                    Password: <input type="text" className="form-control" value={newLoginStatus.password} onChange={changePasswordHandler}/>
                </div>
                <button className="btn btn-success btn-block" onClick={postDataHandler}><i className="fa fa-plus"></i> Login</button>
            </Content>
        </Host>
    );
}

export default Login;