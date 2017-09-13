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
        this.User = this.User.bind(this);
    };

    Home() {
        return <div>
            <RaisedButton containerElement={<Link to="/create" />} type="submit" label="Create meeting" primary={true} />
            <RaisedButton containerElement={<Link to="/join" />} type="submit" label="Join meeting" primary={false} />
        </div>;
    };

    User() {
        return <UserEditor name={this.state.user.name} rate={this.state.user.rate} saveUser={this.saveUser} />;
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
                        showMenuIconButton={this.state.userExists}
                    />
                    <Drawer 
                            open={this.state.menuOpen} 
                            docked={false}
                            onRequestChange={(open) => this.setState({menuOpen: open})}
                        >
                        <MenuItem containerElement={<Link to="/create" />} onClick={this.handleClose}>Create meeting</MenuItem>
                        <MenuItem containerElement={<Link to="/join" />} onClick={this.handleClose}>Join meeting</MenuItem>
                        <MenuItem containerElement={<Link to="/user" />} onClick={this.handleClose}>Edit user</MenuItem>
                    </Drawer>

                    { !this.state.userExists ? <Redirect to="/user"/> : "" }
                
                    <Switch>
                        <Route exact path="/" component={this.Home} />
                        <Route exact path="/user" component={this.User} />
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
            </Router>
        );
    }

}

export default App;
