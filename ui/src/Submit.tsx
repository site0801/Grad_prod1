import React, { useState, useCallback, useContext } from 'react';
import styled from "styled-components";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    matchPath,
    useParams,
    RouteComponentProps
} from "react-router-dom";
//import jwt_decode from 'jwt-decode';
import {UsernameContext} from "./Totalprovider";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'

interface Problem {
    ans_title: string;
    prob_sentence: string;
    solver_name: string;
}

// Componentのstyleを直接いじるのは、JSでどうしても動的に変化させたい時だけと言う信念
// Styled-Componentを使います
const Host = styled.div`
    margin-top: 10px;
`;

const Content = styled.div`
    margin-top:'30px';
`;

interface ParamTypes {
    id: string
}

// React hooks を使いFCコンポーネントへと
const Submit = () => {
    let params: ParamTypes = { id: "" }
    params = useParams<ParamTypes>();
    let UsernameState = "";
    // Userの構造体が増えるたびにStateが増えるのはクソなのでUserObjectにまとめる
    if (window.sessionStorage.getItem('gurupen.username') != null){
        UsernameState = window.sessionStorage.getItem('gurupen.username')!
    }
    const [submitAnswer, setSubmitAnswer] = useState<Problem>({ ans_title: params.id , prob_sentence: '', solver_name: UsernameState})
    // memorizeします
    // https://ja.reactjs.org/docs/hooks-reference.html#usecallback
    const postDataHandler = useCallback(
        // async/await構文を用います
        async () => {
            // axiosでも問題ないです
            const response = await fetch(
                "http://localhost:1323/restricted/addanswer",
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
        // newUserをdependenciesに追加することをわすれずに！
        [submitAnswer],
    );

    // memorizeします
    // https://ja.reactjs.org/docs/hooks-reference.html#usecallback
    // const changeProblemTitleHandler = useCallback(
    //     (e: React.ChangeEvent<HTMLInputElement>) => {
    //         e.persist();
    //         setSubmitAnswer(x => ({ ...x, title: e.target.value }));
    //     },
    //     // React は再レンダー間で dispatch 関数の同一性が保たれ、変化しないことを保証します。従って useEffect や useCallback の依存リストにはこの関数を含めないでも構いません。(公式より)
    //     [],
    // );

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