import { Template } from 'meteor/templating';

import { noUiSlider } from 'meteor/rcy:nouislider';
 
import { Tasks } from '../api/tasks.js';
 
import './task.html';
 

Template.task.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});

Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Tasks.update(this._id, {
      $set: { checked: ! this.checked },
    });
  },
  'click .delete'() {
    Tasks.remove(this._id);
  },
  'click .toggle-private'() {
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },

  'change .priority'(event){
    var sliderVal = event.target.value;
    Tasks.update(this._id,{
      $set: {priority: sliderVal}
    })
  },
});