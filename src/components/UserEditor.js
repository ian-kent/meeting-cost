import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';

class UserEditor extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: this.props.name,
            rate: this.props.rate,
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
        if(this.props.saveUser(this.state)) {
            this.props.history.push("/");
        }
    }
    
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <p>
                {
                    this.props.userExists ?
                    "This data is stored locally. It won't be shared without your permission." :
                    "Set your name and rate to get started. This data is stored locally, and won't be shared without your permission."
                }
                </p>
                <div>
                    <TextField floatingLabelText="Name" type="text" name="name" value={this.state.name} onChange={this.handleInputChange} />
                </div>
                <div>
                    <TextField floatingLabelText="Rate" type="number" name="rate" value={this.state.rate} onChange={this.handleInputChange} />
                </div>
                <div>
                    <RaisedButton type="submit" label="Save" primary={true} />
                </div>
            </form>
        )
    }
}

UserEditor.propTypes = {
    name: PropTypes.string,
    rate: PropTypes.number,
    userExists: PropTypes.boolean
};

const UserEditorWithRouter = withRouter(UserEditor);

export default UserEditorWithRouter;
