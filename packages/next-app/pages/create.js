import React, { Component } from "react";
import { Button,  Form  } from 'semantic-ui-react'

class addTask extends Component {
    constructor(props){
        super(props)
        this.state = {
          taskDetails:'',
          funds:null
        }
    };

    handleSubmit = async (event) =>{
        event.preventDefault();
        try {
            await this.props.contract.methods
            .submitTask(
                this.props.web3.utils.toWei(this.state.funds,'ether'),
                this.state.taskDetails)
            .send({from: this.props.accounts[0]});
        } catch (error) {
             // Catch any errors for any of the above operations.
            alert(`Transaction Failed. Only the PM can submit. Check console for details`);
            console.error(error);
        }
    };

    render(){        
        return(
            <Form onSubmit={this.handleSubmit}>
            <Form.Field>
                <label>Task Details</label>
                <input 
                placeholder='Task Details'
                onChange = {event => {this.setState({taskDetails:event.target.value})}}/> 
            </Form.Field>
            <Form.Field>
                <label>Funds</label>
                <input 
                placeholder='Funds' 
                onChange = {event => {this.setState({funds:event.target.value})}}/> 
            </Form.Field>
            <Button type='submit'>Submit</Button>
            </Form>
        )
    }
}

export default addTask;