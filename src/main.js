/** @jsx React.DOM */
var React = require('react');
var Router = require('react-nested-router');
var Route = Router.Route;
var Link = Router.Link;

var App = React.createClass({
  render: function() {
    return (
      <div>
        <ul>
          <li><Link to="source">Home</Link></li>
          <li><Link to="word">Word</Link></li>
        </ul>
        {this.props.activeRoute}
      </div>
    );
  }
});

var Source = React.createClass({
  render: function() {
    return <h2>Source</h2>;
  }
});

var Word = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Word route</h2>
      </div>
    );
  }
});

React.renderComponent((
  <Route handler={App}>
    <Route name="source" handler={Source}/>
    <Route name="word" handler={Word} />
  </Route>
), document.body);