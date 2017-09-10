import React, { Component } from 'react';
import {Redirect} from 'react-router';
import QrReader from 'react-qr-reader'

class Scanner extends Component {
    constructor(props){
        super(props)
        this.state = {
            delay: 100,
            result: null,
        }

        this.handleScan = this.handleScan.bind(this)
    }
    handleScan(data){
        this.setState({
            result: data,
        })
    }
    handleError(err){
        console.error(err)
    }
    render(){
        const previewStyle = {
            height: 240,
            width: 320,
        }

        return(
            !this.state.result ?
            <div>
            <QrReader
                delay={this.state.delay}
                style={previewStyle}
                onError={this.handleError}
                onScan={this.handleScan}
                />
            </div> :
            <Redirect to={"/meeting/" + this.state.result}/>
        )
    }
}

export default Scanner;
