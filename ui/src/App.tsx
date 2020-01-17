import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import Container from '@material-ui/core/Container';
//import Box from '@material-ui/core/Box';
import AddProblem from './AddProblem';

export default function App() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/problems">Problem</Link>
          </li>
          <li>
            <Link to="/addproblem">AddProblem</Link>
          </li>
        </ul>

        <Switch>
          <Route path="/problems">
            <Problems />
          </Route>
          <Route path="/addproblem">
            <AddProblem />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function Problems() {
  let match = useRouteMatch();

  return (
    <div>
      <h2>Problems</h2>

      <ul>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>
            Props v. State
          </Link>
        </li>
      </ul>

      {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
      <Switch>
        <Route path={`${match.path}/:problemId`}>
          <Problem />
        </Route>
        <Route path={match.path}>
          <h3>Please select a problem.</h3>
        </Route>
      </Switch>
    </div>
  );
}

function Problem() {
  let { problemId } = useParams();
  return <h3>Requested problem ID: {problemId}</h3>;
}