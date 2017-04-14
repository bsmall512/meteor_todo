import { Meteor } from 'meteor/meteor';

import { Template } from 'meteor/templating';
 
import { Tasks } from '../api/tasks.js';

import { ReactiveDict } from 'meteor/reactive-dict';
 
import './body.html';
 
import './task.js';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});
  
Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    let days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    const deadline = target.deadline.value;
    const priority = 1; 
    
    if(text.length < 5){ 
      // Insert a task into the collection
      alert('task must be at least 5 characters')
      // Clear form
    } else if(days.indexOf(deadline.toLowerCase()) === -1){
      alert('please enter a day of the week');
    } else {
      Meteor.call('tasks.insert', text, deadline, priority);
      target.text.value = '';
      target.deadline.value = ''; 
    }  

  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
  'click .sortByDeadline'(){
    return Tasks.find({}, {sort: {deadline: -1}});
  },
  'click .sortByPriority' (event){
    Meteor.call('tasks.prioritize')
  },
  
});
