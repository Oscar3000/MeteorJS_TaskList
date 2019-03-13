import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Task from './Task';
import {withTracker} from 'meteor/react-meteor-data';
import {Tasks} from '../api/tasks';
import AccountsUIWrapper from './AccountsUIWrapper';

//app component represents the whole app
class App extends Component{
  constructor(props){
    super(props);
    this.state={
      hideCompleted:false
    };
  }
  handleSubmit(e){
    e.preventDefault();
    //find the text field via the react ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('tasks.insert',text);
    //Clear the form 
    ReactDOM.findDOMNode(this.refs.textInput).value ='';
  }

  toggleHideCompleted(){
    this.setState({
      hideCompleted:!this.state.hideCompleted
    });
  }
  render(){
    let tasks = this.props.tasks;
    if(this.state.hideCompleted){
      tasks = tasks.filter(task=> !task.checked);
    }
    tasks = tasks.map(task=>{
      const cuurentUserId = this.props.CurrentUser && this.props.CurrentUser._id;
      const showPrivateButton = task.owner === cuurentUserId;

      return <Task key={task._id} task={task} showPrivateButton={showPrivateButton} />
    });
    return (
      <div className="container">
        <header>
          <h1>To do List ({this.props.incompleteTasksCount})</h1>
          <label className="hide-completed">
            <input  type="checkbox" readOnly checked={this.state.hideCompleted} onClick={this.toggleHideCompleted.bind(this)} />
            Hide Completed Tasks
          </label>
          <AccountsUIWrapper />
          {this.props.CurrentUser ?
          <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
            <input
              type="text"
              ref="textInput"
              placeholder="Add a new task"
            />
          </form>:""
          }
        </header>
        <ul>
          {tasks}
        </ul>
      </div>
    );
  }
}

export default withTracker(()=>{
  Meteor.subscribe('tasks');
  return{
    tasks: Tasks.find({},{sort: {createdAt: -1 }}).fetch(),
    incompleteTasksCount: Tasks.find({checked:{$ne:true}}).count(),
    CurrentUser:Meteor.user()
  };
})(App);