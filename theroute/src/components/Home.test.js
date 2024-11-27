import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import Home from './Home';


describe('Home Component', () => {
 test('navigates to login page on button click', () => {
   const history = createMemoryHistory();
   render(
     <Router location={history.location} navigator={history}>
       <Home />
     </Router>
   );


   // Simulate button click
   fireEvent.click(screen.getByText('Click Here to Begin'));


   // Check if the navigation happened
   expect(history.location.pathname).toBe('/login');
 });
});




