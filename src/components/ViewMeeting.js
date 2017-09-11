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
        this.updateMeeting = this.updateMeeting.bind(this);
        this.endMeeting = this.endMeeting.bind(this);
        this.attendMeeting = this.attendMeeting.bind(this);
    }

    componentWillMount() {
        this.updateMeeting(this.props.match.params.id);
    }

    updateMeeting(meetingId) {
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
        const meetingId = this.props.match.params.id;
        fetch('https://l6w6ou7rnb.execute-api.eu-west-1.amazonaws.com/prod/meetings/' + meetingId + '/start', {
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
        })
        .then(res => {
            console.log(res);
            this.updateMeeting(meetingId);
        })
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }

    endMeeting() {
        console.log("ending meeting");
        const meetingId = this.props.match.params.id;
        fetch('https://l6w6ou7rnb.execute-api.eu-west-1.amazonaws.com/prod/meetings/' + meetingId + '/end', {
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
        })
        .then(res => {
            console.log(res);
            this.updateMeeting(meetingId);
        })
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }

    attendMeeting() {
        console.log("attend meeting");
        const meetingId = this.props.match.params.id;
        const user = {
            user: {
                id: this.props.user.id,
                name: this.props.user.name,
                rate: this.props.user.rate
            }
        }
        fetch('https://l6w6ou7rnb.execute-api.eu-west-1.amazonaws.com/prod/meetings/' + meetingId + '/attend', {
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(res => {
            console.log(res);
            this.updateMeeting(meetingId);
        })
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }
    
    render(){
        return(
            (!this.state.loading ? 
            <div>
                <QRCode value={this.props.match.params.id} />
                <p>{this.state.meeting.name}</p>
                <p>Created by {this.state.meeting.user.name} on {this.state.meeting.created}</p>
                { 
                    !this.state.meeting.started ? 
                    <RaisedButton onClick={this.startMeeting} type="submit" label="Start meeting" primary={true} /> : 
                    <div>
                        <p>Started on {this.state.meeting.started}</p>
                        {
                            !this.state.meeting.ended ?
                            <RaisedButton onClick={this.endMeeting} type="submit" label="End meeting" primary={true} /> :
                            <p>Ended on {this.state.meeting.ended}</p>
                        }
                    </div>
                }
                {
                    !this.state.meeting.ended ?
                    <RaisedButton onClick={this.attendMeeting} type="submit" label="Attend meeting" primary={true} /> :
                    ""
                }
            </div> :
            <div>
                Loading
            </div>)
        )
    }
}

const ViewMeetingWithRouter = withRouter(ViewMeeting);

export default ViewMeetingWithRouter;
