import React, { useState, useCallback } from 'react';
import styled from "styled-components";

interface Problem {
    ProblemTitle: string;
    ProblemDescription: string;
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
const AddProblem = () => {

    // Userの構造体が増えるたびにStateが増えるのはクソなのでUserObjectにまとめる
    const [newProblem, setNewProblem] = useState<Problem>({ ProblemTitle: '', ProblemDescription: '' })

    // memorizeします
    // https://ja.reactjs.org/docs/hooks-reference.html#usecallback
    const postDataHandler = useCallback(
        // async/await構文を用います
        async () => {
            // axiosでも問題ないです
            const response = await fetch(
                "http://127.0.0.1:8080",
                {
                    method: "POST",
                    body: JSON.stringify(newProblem)
                }
            )
            console.log(response);
            alert("Successfully added!");
            window.location.reload();
        },
        // newUserをdependenciesに追加することをわすれずに！
        [newProblem],
    );

    // memorizeします
    // https://ja.reactjs.org/docs/hooks-reference.html#usecallback
    const changeProblemTitleHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            setNewProblem(x => ({ ...x, ProblemTitle: e.target.value }));
        },
        // React は再レンダー間で dispatch 関数の同一性が保たれ、変化しないことを保証します。従って useEffect や useCallback の依存リストにはこの関数を含めないでも構いません。(公式より)
        [],
    );

    const changeProblemDescriptionHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            setNewProblem(x => ({ ...x, ProblemDescription: e.target.value }));
        },
        [],
    );

    return (
        <Host>
            <h1>Add a new problem</h1>
            <Content className="col-lg-8 offset-lg-2">
                <div className="form-group">
                    Problem Name: <input type="text" className="form-control" value={newProblem.ProblemTitle} onChange={changeProblemTitleHandler}/>
                </div>
                <div className="form-group">
                    Problem Description: <input type="text" className="form-control" value={newProblem.ProblemDescription} onChange={changeProblemDescriptionHandler}/>
                </div>
                <button className="btn btn-success btn-block" onClick={postDataHandler}><i className="fa fa-plus"></i> Add Problem</button>
            </Content>
        </Host>
    );
}

export default AddProblem;