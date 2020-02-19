import React, { useState, useEffect, useContext } from 'react';
import styled from "styled-components";
import {UsernameContext} from "./Totalprovider";
// Componentのstyleを直接いじるのは、JSでどうしても動的に変化させたい時だけと言う信念
// Styled-Componentを使います
const Host = styled.div`
    margin-top: 10px;
`;

const Content = styled.div`
    margin-top:'30px';
`;

interface ServiceInit {
    status: 'init';
}
interface ServiceLoading {
    status: 'loading';
}
interface ServiceLoaded<T> {
    status: 'loaded';
    payload: T;
}
interface ServiceError {
    status: 'error';
    error: Error;
}
type Service<T> =
    | ServiceInit
    | ServiceLoading
    | ServiceLoaded<T>
    | ServiceError;

interface Problem {
    ID: number;
    CreatedAt: any;
    UpdatedAt: any;
    DeletedAt: any;
    Title: string;
    Prob_sentence: string;
    Author_name: string;
    Category: string;
    Status: string;
}

interface Problems {
    results: Problem[];
}

// React hooks を使いFCコンポーネントへと
const Problems = () => {
    const {UsernameState} = useContext(UsernameContext);
    const [LoadState, setLoadState] = useState<boolean>(false);
    const [DataState, setDataState] = useState<Service<Problems>>({
        status: 'loading'
    });
    // memorizeします
    // https://ja.reactjs.org/docs/hooks-reference.html#usecallback
    useEffect(() => {
        fetch(
            "http://localhost:1323/restricted/problems",
            {
                headers: {'Content-type':'application/json','Authorization':'Bearer '+sessionStorage.getItem("gurupen")},
                method: "GET"
            }
        ).then((response) => response.json())
        .then(response => setDataState({ status: 'loaded', payload: {results: response} }))
        .catch((error) =>{
            console.error(error);
        });
        console.log(DataState);
    },[]);
    console.log(DataState);
    
    return (
        <Host>
            <h1>Add a new problem</h1>
            <hr></hr>
            <Content className="col-lg-8 offset-lg-2">
                {DataState.status === 'loading' && <div>Loading...</div>}
                {DataState.status === 'loaded' &&
                    DataState.payload.results.map((problem) => (
                        <div key={problem.ID}>{problem.Title}</div>
                ))}
                {DataState.status === 'error' && (
                    <div>Error.</div>
                )}
            </Content>
        </Host>
    );
}

export default Problems;