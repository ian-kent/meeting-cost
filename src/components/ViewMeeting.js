import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import QRCode from 'qrcode.react';
import RaisedButton from 'material-ui/RaisedButton';

class ViewMeeting extends Component {
    constructor(props){
        super(props)
        this.state = {
            meeting: null,
            loading: true,
            isAttending: false
        }

        this.startMeeting = this.startMeeting.bind(this);
        this.endMeeting = this.endMeeting.bind(this);
        this.attendMeeting = this.attendMeeting.bind(this);
    }

    componentWillMount() {
        const uid = this.props.match.params.id;
        const email = uid + "@meeting-cost.ian-kent.github.io";
        window.firebase.auth().signOut();
        window.firebase.auth().signInWithEmailAndPassword(email, uid).then((userData) => {
            console.log(userData);

            window.firebase.database().ref('/meetings/' + uid).on('value', (meeting) => {
                if (meeting.val() === null) {
                    console.log("meeting value is null");
                    this.props.history.push("/create");
                    return;
                }

                console.log(meeting.val());
                const m = meeting.val();

                const attendees = Object.keys(m.attendees).map((a) => m.attendees[a]);
                console.log(attendees);

                this.setState({
                    meeting: {
                        name: m.name,
                        created: m.created,
                        started: m.started,
                        ended: m.ended,
                        user: {
                            name: m.user.name,
                            id: m.user.id
                        },
                        attendees: attendees
                    },
                    isAttending: (m.user.id in m.attendees),
                    loading: false
                })
            });
        });
    }

    startMeeting() {
        const meetingId = this.props.match.params.id;
        console.log("starting meeting");
        window.firebase.database().ref("/meetings/" + meetingId + "/started").set(new Date().toString(), (error) => {
            if(error) {
                console.log("error starting meeting ", error);
                return;
            }
            console.log("meeting started");
        });
    }

    endMeeting() {
        const meetingId = this.props.match.params.id;
        console.log("ending meeting");
        window.firebase.database().ref("/meetings/" + meetingId + "/ended").set(new Date().toString(), (error) => {
            if(error) {
                console.log("error ending meeting ", error);
                return;
            }
            console.log("meeting ended");
        });
    }

    attendMeeting() {
        console.log("attend meeting");
        const meetingId = this.props.match.params.id;
        const user = {
            id: this.props.user.id,
            name: this.props.user.name,
            rate: this.props.user.rate,
            joined: (new Date()).toString()
        }
        window.firebase.database().ref("/meetings/" + meetingId + "/attendees/" + this.props.user.id).set(user, (error) => {
            if(error) {
                console.log("error attending meeting ", error);
                return;
            }
            console.log("meeting attended");
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
                    !this.state.meeting.ended && !this.state.isAttending ?
                    <RaisedButton onClick={this.attendMeeting} type="submit" label="Attend meeting" primary={true} /> :
                    ""
                }
                <ul>
                    {
                        this.state.meeting.attendees.map((a) => <li key={a.id}>{a.name}</li>)
                    }
                </ul>
            </div> :
            <div>
                Loading
            </div>)
        )
    }
}

const ViewMeetingWithRouter = withRouter(ViewMeeting);

export default ViewMeetingWithRouter;
