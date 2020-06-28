import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';


// const Content = styled.div`
//     margin-top:'30px';
// `;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    thirdryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
      },
    icon: {
      verticalAlign: 'bottom',
      height: 20,
      width: 20,
    },
    details: {
      alignItems: 'center',
    },
    column: {
      flexBasis: '33.33%',
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  }),
);

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

const Problem = () => {
//    const {UsernameState} = useContext(UsernameContext);
//    const [LoadState, setLoadState] = useState<boolean>(false);
    const [DataState, setDataState] = useState<Service<Problems>>({
        status: 'loading'
    });
    useEffect(() => {
        fetch(
            "http://127.0.0.1:1234/restricted/problems",
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
        <div className={classes.root}>
            <h1>Problems(Ver. β)</h1>
            <hr></hr>
            {DataState.status === 'loading' && <div>Loading...</div>}
            {DataState.status === 'loaded' &&
                DataState.payload.results.map((problem) => (
                    <ExpansionPanel defaultExpanded key={problem.ID}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1c-content"
                            id="panel1c-header"
                        >
                        <div className={classes.column}>
                            <Typography className={classes.heading}>No.{problem.ID} {problem.Title}</Typography>
                        </div>
                        <div className={classes.column}>
                            <Typography className={classes.secondaryHeading}>{problem.Author_name}</Typography>
                        </div>
                        <div className={classes.column}>
                            <Typography className={classes.thirdryHeading}>{problem.Status}</Typography>
                        </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.details}>
                        <div className={classes.column} />
                        <div className={classes.column}>
                            <Typography className={classes.heading}>{problem.Prob_sentence}</Typography>
                        </div>
                        <div className={clsx(classes.column, classes.helper)}>
                            <Typography variant="caption">
                                CreatedAt:{problem.CreatedAt}
                            <br />
                                UpdatedAt:{problem.UpdatedAt}
                            </Typography>
                        </div>
                        </ExpansionPanelDetails>
                        <Divider />
                        <ExpansionPanelActions>
                        <Link to={"/submit/" + problem.ID}>
                        <Button size="small" color="primary">
                            Submit
                        </Button>
                        </Link>
                        </ExpansionPanelActions>
                    </ExpansionPanel>
            ))}
            {DataState.status === 'error' && (
                <div>Error.</div>
            )}
        </ div>
    );
}

export default Problem;