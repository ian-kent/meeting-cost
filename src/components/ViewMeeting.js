import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import QRCode from 'qrcode.react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import ActionToday from 'material-ui/svg-icons/action/today';

const styles = {
    chip: {
        margin: 4,
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
};

class ViewMeeting extends Component {
    constructor(props){
        super(props)
        this.state = {
            meeting: null,
            loading: true,
            isAttending: false,
            cost: 0,
            confirmAttend: false
        }

        this.startMeeting = this.startMeeting.bind(this);
        this.endMeeting = this.endMeeting.bind(this);
        this.attendMeeting = this.attendMeeting.bind(this);
        this.startAttendMeeting = this.startAttendMeeting.bind(this);
        this.calculateCost = this.calculateCost.bind(this);
        this.calculateAttendeeCost = this.calculateAttendeeCost.bind(this);
        this.handleClose = this.handleClose.bind(this);
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
                    isAttending = this.props.user.id in m.attendees;
                    console.log(isAttending);
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

    startAttendMeeting() {
        this.setState({confirmAttend: true});
    }

    handleClose() {
        this.setState({confirmAttend: false});
    }

    attendMeeting() {
        this.setState({confirmAttend: false});
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
            padding: "10px",
        };

        return(
            (!this.state.loading ? 
            <div>
                <Card>
                    <CardTitle title={this.state.meeting.name} 
                        subtitle={"Created by " + this.state.meeting.user.name + " on " + this.state.meeting.created}
                    />
                    <CardText>
                        <div style={qrStyle}>
                            <QRCode size="196" value={this.props.match.params.id} />
                        </div>
                        <div>
                            {
                                this.state.meeting.started ?
                                <p>Started on { this.state.meeting.started }</p> :
                                ""
                            }
                            {
                                this.state.meeting.ended ?
                                <p>Finished on { this.state.meeting.ended }</p> :
                                ""
                            }
                        </div>
                        <p>Cost: {this.state.cost}</p>
                        <div style={styles.wrapper}>
                            {
                                this.state.meeting.attendees.map((a) =>
                                <Chip style={styles.chip} key={a.id}>
                                    <Avatar size={32}>{ a.name.charAt(0) }</Avatar>
                                    { a.name }
                                </Chip>
                                )
                            }
                        </div>
                    </CardText>
                    <CardActions>
                        {
                            !this.state.meeting.started ?
                            <RaisedButton onClick={this.startMeeting} type="submit" label="Start meeting" primary={true} /> : 
                            ( !this.state.meeting.ended ?
                            <RaisedButton onClick={this.endMeeting} type="submit" label="End meeting" primary={true} /> :
                            "" )
                        }
                        {
                            !this.state.meeting.ended && !this.state.isAttending ?
                            <span>
                            <RaisedButton onClick={this.startAttendMeeting} type="submit" label="Attend meeting" secondary={true} />
                            <Dialog
                                actions={[
                                    <FlatButton
                                        label="No, cancel"
                                        primary={true}
                                        onClick={this.handleClose}
                                    />,
                                    <FlatButton
                                        label="Yes"
                                        primary={true}
                                        onClick={this.attendMeeting}
                                    />
                                ]}
                                modal={false}
                                open={this.state.confirmAttend}
                                onRequestClose={this.handleClose}
                            >
                                <p>Attending a meeting will share your rate.</p>
                                <p>Are you sure?</p>
                            </Dialog> 
                            </span> :
                            ""
                        }
                    </CardActions>
                </Card>
            </div> :
            <div>
                Loading
            </div>)
        )
    }
}

const ViewMeetingWithRouter = withRouter(ViewMeeting);

export default ViewMeetingWithRouter;
