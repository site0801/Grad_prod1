import React, { useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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
    Prob_Title: string;
    Prob_sentence: string;
    Solver_name: string;
    Status: string;
}

interface Problems {
    results: Problem[];
}

const Answers = () => {
//    const {UsernameState} = useContext(UsernameContext);
//    const [LoadState, setLoadState] = useState<boolean>(false);
    const [DataState, setDataState] = useState<Service<Problems>>({
        status: 'loading'
    });
    useEffect(() => {
        fetch(
            "http://localhost:1323/restricted/answers",
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
    },[DataState]);
    console.log(DataState);

    const classes = useStyles();
    
    return (
        <TableContainer component={Paper}>
            <h1>Answers</h1>
            <hr></hr>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell align="right">Sentence</TableCell>
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
                            No.{problem.Prob_Title}
                        </TableCell>
                        <TableCell align="right">{problem.Prob_sentence}</TableCell>
                        <TableCell align="right">{problem.Solver_name}</TableCell>
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

export default Answers;