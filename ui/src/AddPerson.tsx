// TypeScriptを使うのだ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
import React, { useState, useCallback } from 'react';
import styled from "styled-components";

interface User {
    firstName: string;
    lastName: string;
}

// Componentのstyleを直接いじるのは、JSでどうしても動的に変化させたい時だけと言う信念
// Styled-Componentを使います
const Host = styled.div`
    margin-top: 10px;
`;

const Content = styled.div`
    margin-top:'30px';
`;

// React hooks を使いFCコンポーネントへと
const AddPerson = () => {

    // Userの構造体が増えるたびにStateが増えるのはクソなのでUserObjectにまとめる
    const [newUser, setNewUser] = useState<User>({ firstName: '', lastName: '' })

    // memorizeします
    // https://ja.reactjs.org/docs/hooks-reference.html#usecallback
    const postDataHandler = useCallback(
        // async/await構文を用います
        async () => {
            // axiosで全然問題ないです
            const response = await fetch(
                "https://rest-api-example-go.herokuapp.com/people",
                {
                    method: "POST",
                    body: JSON.stringify(newUser)
                }
            )
            console.log(response);
            alert("Successfully added!");
            window.location.reload();
        },
        // newUserをdependenciesに追加することをわすれずに！
        [newUser],
    );

    // memorizeします
    // https://ja.reactjs.org/docs/hooks-reference.html#usecallback
    const changeFirstNameHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            setNewUser(x => ({ ...x, firstName: e.target.value }));
        },
        // React は再レンダー間で dispatch 関数の同一性が保たれ、変化しないことを保証します。従って useEffect や useCallback の依存リストにはこの関数を含めないでも構いません。(公式より)
        [],
    );

    const changeLastNameHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            setNewUser(x => ({ ...x, lastName: e.target.value }));
        },
        [],
    );

    return (
        <Host>
            <h1>Add a new person</h1>
            <Content className="col-lg-8 offset-lg-2">
                <div className="form-group">
                    First Name: <input type="text" className="form-control" value={newUser.firstName} onChange={changeFirstNameHandler}/>
                </div>
                <div className="form-group">
                    Last Name: <input type="text" className="form-control" value={newUser.lastName} onChange={changeLastNameHandler}/>
                </div>
                <button className="btn btn-success btn-block" onClick={postDataHandler}><i className="fa fa-plus"></i> Add Person</button>
            </Content>
        </Host>
    );
}

export default AddPerson;