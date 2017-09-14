import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Scanner from './Scanner';

class JoinMeeting extends Component {
    render(){
        return(
            <div>
                <h1>Join a meeting</h1>
                <p>Scan a QR code to join a meeting.</p>
                <p>Your name and rate will not be shared.</p>
                <Scanner />
            </div>
        )
    }
}

const JoinMeetingWithRouter = withRouter(JoinMeeting);

export default JoinMeetingWithRouter;
