import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MeetingCostApp from './MeetingCostApp';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <MeetingCostApp />
      </MuiThemeProvider>
    );
  }
}

export default App;
