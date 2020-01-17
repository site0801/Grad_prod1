import React from 'react';
import Container from '@material-ui/core/Container';
//import Box from '@material-ui/core/Box';
import AddProblem from './AddProblem';

export default function App() {
  return (
    <Container maxWidth="sm">
      <AddProblem />
    </Container>
  );
}