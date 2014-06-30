/** @jsx React.DOM */
var React = require('react/addons');
var Route = require('react-nested-router').Route;
var App = require('./App');
var Question = require('./Question');

React.initializeTouchEvents(true)

var routes = (
  <Route name="home" handler={App}>
    <Route name="question" path="/:sourceName" handler={Question}/>
  </Route>
);

React.renderComponent(routes, document.body);
