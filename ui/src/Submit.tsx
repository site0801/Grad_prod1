import React, { useState, useCallback } from 'react';
import styled from "styled-components";
import {
    useParams
} from "react-router-dom";
//import jwt_decode from 'jwt-decode';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'

interface Problem {
    ans_title: string;
    prob_sentence: string;
    solver_name: string;
}

const Host = styled.div`
    margin-top: 10px;
`;

const Content = styled.div`
    margin-top:'30px';
`;

interface ParamTypes {
    id: string
}

const Submit = () => {
    let params: ParamTypes = { id: "" }
    params = useParams<ParamTypes>();
    let UsernameState = "";
    if (window.sessionStorage.getItem('gurupen.username') != null){
        UsernameState = window.sessionStorage.getItem('gurupen.username')!
    }
    const [submitAnswer, setSubmitAnswer] = useState<Problem>({ ans_title: params.id , prob_sentence: '', solver_name: UsernameState})
    const postDataHandler = useCallback(
        async () => {
            const response = await fetch(
                "http://127.0.0.1:1234/restricted/addanswer",
                {
                    headers: {'Content-type':'application/json', 'Authorization':' Bearer '+sessionStorage.getItem("gurupen.token")},
                    method: "POST",
                    body: JSON.stringify(submitAnswer)
                }
            )
            console.log(response);
            alert("Successfully added!");
            //window.location.reload();
        },
        [submitAnswer],
    );

    const changeProblemDescriptionHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            setSubmitAnswer(x => ({ ...x, prob_sentence: e.target.value }));
        },
        [],
    );

    // const changeProblemCategoryHandler = useCallback(
    //     (e: React.ChangeEvent<HTMLInputElement>) => {
    //         e.persist();
    //         setSubmitAnswer(x => ({ ...x, category: e.target.value }));
    //     },
    //     [],
    // );

    return (
        <Host>
            <h1>Add a new problem</h1>
            <hr></hr>
            <Content className="col-lg-8 offset-lg-2">
                <div className="form-group">
                    <TextField  className="form-control" value={submitAnswer.prob_sentence} onChange={changeProblemDescriptionHandler} id="standard-basic" label="Problem Description" />
                </div>
                <br/>
                <Button className="btn btn-success btn-block" onClick={postDataHandler} variant="contained" color="primary"><i className="fa fa-plus"></i>Add problem</Button>
                
            </Content>
        </Host>
    );
}

export default Submit;