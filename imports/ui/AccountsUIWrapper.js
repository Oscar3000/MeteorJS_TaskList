import React, { Component } from 'react';
import ReactDom from 'react-dom';
import {Template} from 'meteor/templating';
import {Blaze} from 'meteor/blaze';

export default class AccountsUIWrapper extends Component {
  componentDidMount(){
    //Use Meteor Blaze to render Login Button
    this.view = Blaze.render(Template.loginButtons, ReactDom.findDOMNode(this.refs.container));
  }

  componentWillUnmount(){
    //Clean up Blaze view
    Blaze.remove(this.view);
  }
  render() {
    return <span ref="container" />
  }
}
