import React, { useState, useEffect, useContext } from 'react';
import styled from "styled-components";
import {UsernameContext} from "./Totalprovider";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// Componentのstyleを直接いじるのは、JSでどうしても動的に変化させたい時だけと言う信念
// Styled-Componentを使います
// const Host = styled.div`
//     margin-top: 10px;
// `;

// const Content = styled.div`
//     margin-top:'30px';
// `;

const useStyles = makeStyles({
    table: {
    minWidth: 650,
    },
});

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
                headers: {'Content-type':'application/json','Authorization':'Bearer '+sessionStorage.getItem("gurupen.token")},
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

    const classes = useStyles();
    
    return (
        <TableContainer component={Paper}>
            <h1>Add a new problem</h1>
            <hr></hr>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell align="right">Author</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">CreatedAt</TableCell>
                    <TableCell align="right">UpdatedAt</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {DataState.status === 'loading' && <div>Loading...</div>}
                {DataState.status === 'loaded' &&
                    DataState.payload.results.map((problem) => (
                        <TableRow key={problem.ID}>
                        <TableCell component="th" scope="row">
                            {problem.Title}
                        </TableCell>
                        <TableCell align="right">{problem.Author_name}</TableCell>
                        <TableCell align="right">{problem.Status}</TableCell>
                        <TableCell align="right">{problem.CreatedAt}</TableCell>
                        <TableCell align="right">{problem.UpdatedAt}</TableCell>
                        </TableRow>
                ))}
                {DataState.status === 'error' && (
                    <div>Error.</div>
                )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Problems;