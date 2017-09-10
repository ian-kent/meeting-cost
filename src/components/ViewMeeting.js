import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import QRCode from 'qrcode.react';
import RaisedButton from 'material-ui/RaisedButton';

class ViewMeeting extends Component {
    constructor(props){
        super(props)
        this.state = {
            meeting: null,
            loading: true
        }

        this.startMeeting = this.startMeeting.bind(this);
    }

    componentWillMount() {
        const meetingId = this.props.match.params.id;

        fetch('https://l6w6ou7rnb.execute-api.eu-west-1.amazonaws.com/prod/meetings/' + meetingId, {
            method: 'get',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
        }).then(res=>res.json())
        .then(res => {
            console.log(res);
            this.setState({meeting: Object.assign({}, res), loading: false});
        })
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }

    startMeeting() {
        console.log("starting meeting");
    }
    
    render(){
        return(
            (!this.state.loading ? 
            <div>
                <QRCode value={this.props.match.params.id} />
                <p>{this.state.meeting.name}</p>
                <p>Created by {this.state.meeting.user.name} on {this.state.meeting.created}</p>
                <RaisedButton onClick={this.startMeeting} type="submit" label="Start meeting" primary={true} />
            </div> :
            <div>
                Loading
            </div>)
        )
    }
}

const ViewMeetingWithRouter = withRouter(ViewMeeting);

export default ViewMeetingWithRouter;
