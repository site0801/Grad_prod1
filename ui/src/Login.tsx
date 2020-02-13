import React, { useState, useCallback } from 'react';
import styled from "styled-components";

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
const Login = () => {

    // Userの構造体が増えるたびにStateが増えるのはクソなのでUserObjectにまとめる
    const [newLoginStatus, setNewLoginStatus] = useState<User>({ username: '', password: '' })
    
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
            )
            
            console.log(response);
            alert("Successfully Authentication!");
            //window.location.reload();
        },
        // newUserをdependenciesに追加することをわすれずに！
        [newLoginStatus]
    );

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
            <Content className="col-lg-8 offset-lg-2">
                <div className="form-group">
                    User Name: <input type="text" className="form-control" value={newLoginStatus.username} onChange={changeUserNameHandler}/>
                </div>
                <div className="form-group">
                    Password: <input type="text" className="form-control" value={newLoginStatus.password} onChange={changePasswordHandler}/>
                </div>
                <button className="btn btn-success btn-block" onClick={postDataHandler}><i className="fa fa-plus"></i> Add Problem</button>
            </Content>
        </Host>
    );
}

export default Login;