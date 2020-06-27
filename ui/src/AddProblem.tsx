import React, { useState, useCallback } from 'react';
import styled from "styled-components";
//import jwt_decode from 'jwt-decode';
//import {UsernameContext} from "./Totalprovider";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'

interface Problem {
    title: string;
    prob_sentence: string;
    author_name: string;
    category: string;
}

const Host = styled.div`
    margin-top: 10px;
`;

const Content = styled.div`
    margin-top:'30px';
`;

const AddProblem = () => {
    let UsernameState = "";
    if (window.sessionStorage.getItem('gurupen.username') != null){
        UsernameState = window.sessionStorage.getItem('gurupen.username')!
    }
    const [newProblem, setNewProblem] = useState<Problem>({ title: '', prob_sentence: '', author_name: UsernameState, category: ''})
    const postDataHandler = useCallback(
        async () => {
            const response = await fetch(
                "http://localhost:1323/restricted/addproblem",
                {
                    headers: {'Content-type':'application/json', 'Authorization':' Bearer '+sessionStorage.getItem("gurupen.token")},
                    method: "POST",
                    body: JSON.stringify(newProblem)
                }
            )
            console.log(response);
            alert("Successfully added!");
            //window.location.reload();
        },
        [newProblem],
    );

    const changeProblemTitleHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            setNewProblem(x => ({ ...x, title: e.target.value }));
        },
        [],
    );

    const changeProblemDescriptionHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            setNewProblem(x => ({ ...x, prob_sentence: e.target.value }));
        },
        [],
    );

    const changeProblemCategoryHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            setNewProblem(x => ({ ...x, category: e.target.value }));
        },
        [],
    );

    return (
        <Host>
            <h1>Add a new problem</h1>
            <hr></hr>
            <Content className="col-lg-8 offset-lg-2">
                <div className="form-group">
                <TextField className="form-control" value={newProblem.title} onChange={changeProblemTitleHandler} id="standard-basic" label="Problem Name" />
                </div>
                <div className="form-group">
                <TextField  className="form-control" value={newProblem.prob_sentence} onChange={changeProblemDescriptionHandler} id="standard-basic" label="Problem Description" />
                </div>
                <div className="form-group">
                <TextField className="form-control" value={newProblem.category} onChange={changeProblemCategoryHandler} id="standard-basic" label="Category" />
                    
                </div>
                <br/>
                <Button className="btn btn-success btn-block" onClick={postDataHandler} variant="contained" color="primary"><i className="fa fa-plus"></i>Add problem</Button>
                
            </Content>
        </Host>
    );
}

export default AddProblem;