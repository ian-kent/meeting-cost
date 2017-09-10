import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Scanner from './Scanner';

class JoinMeeting extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Scanner />
        )
    }
}

const JoinMeetingWithRouter = withRouter(JoinMeeting);

export default JoinMeetingWithRouter;
