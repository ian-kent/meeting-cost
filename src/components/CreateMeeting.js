import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';

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
        //this.props.userCreated(this.state);
        const meeting = {
            user: {
                id: this.props.user.id,
                name: this.props.user.name
            },
            name: this.state.name
        }
        fetch('https://l6w6ou7rnb.execute-api.eu-west-1.amazonaws.com/prod/meetings', {
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(meeting)
        }).then(res=>res.json())
        .then(res => {
            console.log(res);
            this.props.history.push("/meeting/" + res.id);
        })
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }
    
    render(){
        return(
            <div>
            <p>
                Creating meeting as { this.props.user.name }
            </p>
            <form onSubmit={this.handleSubmit}>
                <TextField floatingLabelText="Meeting name" type="text" name="name" value={this.state.name} onChange={this.handleInputChange} />
                <RaisedButton type="submit" label="Create" primary={true} />
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
