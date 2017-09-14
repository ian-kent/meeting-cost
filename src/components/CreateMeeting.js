import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom';

import uuidv4 from 'uuid/v4';

class CreateMeeting extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: this.props.name,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {   
        this.setState({
          [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const uid = uuidv4();
        const email = uid + "@meeting-cost.ian-kent.github.io";
        window.firebase.auth().createUserWithEmailAndPassword(email, uid).then(() => {
            console.log('Created user ', email);
            window.firebase.auth().signOut();
            window.firebase.auth().signInWithEmailAndPassword(email, uid).then((userData) => {
                console.log(userData);

                const meeting = {
                    uid: userData.uid,
                    name: this.state.name,
                    created: (new Date()).toISOString(),
                    user: {
                        id: this.props.user.id,
                        name: this.props.user.name
                    }
                };

                window.firebase.database().ref('/meetings/' + uid).set(meeting, (error) => {
                    if (error) {
                        console.log('Error creating meeting: ', error);
                        return;
                    }

                    console.log('Created meeting ', uid);
                    this.props.history.push("/meeting/" + uid);
                });
            }, (error) => {
                console.log('User login failed: ', error);
            })
        }, (error) => {
            console.log('Create user failed: ', error);
        });
    }
    
    render(){
        return(
            <div>
                <h1>Create a meeting</h1>
                <p>
                    Your rate will not be shared.
                </p>
                <p>
                    You can also <Link to="/join">join a meeting</Link>.
                </p>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <TextField floatingLabelText="User" type="text" name="name" disabled={true} value={this.props.user.name} />
                    </div>
                    <div>
                        <TextField floatingLabelText="Meeting name" type="text" name="name" value={this.state.name} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <RaisedButton type="submit" label="Create" primary={true} />
                    </div>
                </form>
            </div>
        )
    }
}

CreateMeeting.propTypes = {
    name: PropTypes.string
};

const CreateMeetingWithRouter = withRouter(CreateMeeting);

export default CreateMeetingWithRouter;
