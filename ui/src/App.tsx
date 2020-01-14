import React from 'react';
import Container from '@material-ui/core/Container';
//import Box from '@material-ui/core/Box';
import AddPerson from './AddPerson';

export default function App() {
  return (
    <Container maxWidth="sm">
      <AddPerson />
    </Container>
  );
}