import React, { useCallback } from 'react';
import styled from "styled-components";

// Componentのstyleを直接いじるのは、JSでどうしても動的に変化させたい時だけと言う信念
// Styled-Componentを使います
const Host = styled.div`
    margin-top: 10px;
`;

const Content = styled.div`
    margin-top:'30px';
`;

// React hooks を使いFCコンポーネントへと
const Admin = () => {

    // memorizeします
    // https://ja.reactjs.org/docs/hooks-reference.html#usecallback
    const getDataHandler = useCallback(
        // async/await構文を用います
        async () => {
            // axiosでも問題ないです
            const response = await fetch(
                "http://localhost:1323/restricted/problems",
                {
                    headers: {'Content-type':'application/json','Authorization':'Bearer '+sessionStorage.getItem("gurupen")},
                    method: "GET"
                }
            )
            console.log(response);
            alert("Successfully added!");
            //window.location.reload();
        },
        // newUserをdependenciesに追加することをわすれずに！
        [],
    );

    
    return (
        <Host>
            <h1>Add a new problem</h1>
            <hr></hr>
            <Content className="col-lg-8 offset-lg-2">
                <button className="btn btn-success btn-block" onClick={getDataHandler}><i className="fa fa-plus"></i> Add Problem</button>
            </Content>
        </Host>
    );
}

export default Admin;