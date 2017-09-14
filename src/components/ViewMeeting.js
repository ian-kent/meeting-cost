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
            isAttending: false,
            cost: 0
        }

        this.startMeeting = this.startMeeting.bind(this);
        this.endMeeting = this.endMeeting.bind(this);
        this.attendMeeting = this.attendMeeting.bind(this);
        this.calculateCost = this.calculateCost.bind(this);
        this.calculateAttendeeCost = this.calculateAttendeeCost.bind(this);
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

                let attendees = [];
                let isAttending = false;
                if(m.attendees) {
                    attendees = Object.keys(m.attendees).map((a) => m.attendees[a]);
                    isAttending = m.user.id in m.attendees;
                }
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
                    isAttending: isAttending,
                    loading: false
                })
                setTimeout(() => {this.calculateCost()}, 0);
            });
        });
    }

    calculateCost() {
        if(!this.state.meeting.started) {
            console.log("meeting not started");
            this.setState({cost: Number(0).toLocaleString("en-GB", {style:"currency", currency:"GBP"})});
            return;
        }        

        const started = new Date(this.state.meeting.started);
        const ended = this.state.meeting.ended ? new Date(this.state.meeting.ended) : null;

        let cost = 0;
        for(let u in this.state.meeting.attendees) {
            const attendee = this.state.meeting.attendees[u];
            const joined = new Date(attendee.joined);
            cost += this.calculateAttendeeCost(attendee.rate, started, ended, joined);
        }

        this.setState({cost: cost.toLocaleString("en-GB", {style:"currency", currency:"GBP"})});

        if(!this.state.meeting.ended) {
            setTimeout(() => {this.calculateCost()}, 1000);
        }
    }

    calculateAttendeeCost(rate, started, ended, joined) {
        const rps = rate / 3600;
        
        const calcFrom = joined.getTime() > started.getTime() ? joined.getTime() : started.getTime();
        const calcTo = ended ? ended.getTime() : new Date().getTime();

        const seconds = (calcTo - calcFrom) / 1000;
        return seconds * rps;
    }

    startMeeting() {
        const meetingId = this.props.match.params.id;
        console.log("starting meeting");
        window.firebase.database().ref("/meetings/" + meetingId + "/started").set(new Date().toISOString(), (error) => {
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
        window.firebase.database().ref("/meetings/" + meetingId + "/ended").set(new Date().toISOString(), (error) => {
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
            joined: (new Date()).toISOString()
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
        const qrStyle = {
            padding: "10px"
        };

        return(
            (!this.state.loading ? 
            <div>
                <h1>{this.state.meeting.name}</h1>
                <div style={qrStyle}>
                    <QRCode value={this.props.match.params.id} />
                </div>
                <p>Cost: {this.state.cost}</p>
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
                        this.state.meeting.attendees.map((a) => <li key={a.id}>{a.name} (joined {a.joined})</li>)
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
