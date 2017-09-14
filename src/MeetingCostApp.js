import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import UserEditor from './components/UserEditor';
import CreateMeeting from './components/CreateMeeting';
import ViewMeeting from './components/ViewMeeting';
import JoinMeeting from './components/JoinMeeting';

import IconButton from 'material-ui/IconButton';
import ActionToday from 'material-ui/svg-icons/action/today';
import ActionSupervisorAccount from 'material-ui/svg-icons/action/supervisor-account';
import ActionAccountBox from 'material-ui/svg-icons/action/account-box';

import ReactGridLayout from 'react-grid-layout';

import uuidv4 from 'uuid/v4';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            userExists: false,
            menuOpen: false, 
            userId: null,
            user: {
                id: null,
                name: null, 
                rate: null 
            }
        };

        this.saveUser = this.saveUser.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.Home = this.Home.bind(this);
    };

    Home() {
        return <div></div>;
    };

    componentWillMount() {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = uuidv4();
            localStorage.setItem('userId', userId)
        }
        this.setState({userId: userId});

        const userJSON = localStorage.getItem('user');
        if (userJSON) {
            let user = JSON.parse(userJSON);
            const modUser = { id: userId, name: user.name, rate: user.rate };
            console.log(modUser);
            this.setState({ user: modUser, userExists: true });
        }
    }

    saveUser(user) {
        console.log(user);
        localStorage.setItem('user', JSON.stringify(user));
        const modUser = { id: this.state.userId, name: user.name, rate: user.rate };
        console.log(modUser);
        this.setState({ user: modUser, userExists: true });
        return true;
    }

    toggleMenu() {
        this.setState({ menuOpen: !this.state.menuOpen });
    }

    handleClose() {
        this.setState({menuOpen: false})
    }

    render() {
        return (
            <Router>
                <div>
                    <AppBar
                        title={<span>Meeting Cost</span>}
                        onLeftIconButtonTouchTap={this.toggleMenu}
                        showMenuIconButton={false}
                        iconElementRight={ 
                            !this.state.userExists ? 
                            "" :
                            <div>
                                <IconButton 
                                    containerElement={<Link to="/create" />} 
                                    type="submit" 
                                    label="Create" 
                                    primary={true} 
                                ><ActionToday /></IconButton>
                                <IconButton 
                                    containerElement={<Link to="/join" />} 
                                    type="submit" 
                                    label="Join" 
                                    secondary={true} 
                                ><ActionSupervisorAccount /></IconButton>
                                <IconButton 
                                    containerElement={<Link to="/user" />} 
                                    type="submit" 
                                    label="User" 
                                ><ActionAccountBox /></IconButton>
                            </div>
                         }
                    />

                    { !this.state.userExists ? <Redirect to="/user"/> : "" }
                
                    <div style={{marginTop: 48, marginBottom: 48, marginLeft: 72, marginRight: 72}}>
                        <Switch>
                            <Route exact path="/" render={ props => (
                                <Redirect to="/create"/>
                            )} />
                            <Route exact path="/user" render={ props => (
                                <UserEditor 
                                    name={this.state.user.name}
                                    rate={this.state.user.rate}
                                    saveUser={this.saveUser}
                                    userExists={this.state.userExists}
                                />
                            )} />
                            <Route exact path="/join" component={JoinMeeting} />
                            <Route exact path="/create" render={ props => (
                                <CreateMeeting user={this.state.user} />
                            )} />
                            <Route exact path="/meeting/:id" render={ props => (
                                <ViewMeeting user={this.state.user} />
                            )} />
                            <Route>
                                <div>Page not found</div>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }

}

export default App;
