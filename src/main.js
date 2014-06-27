/** @jsx React.DOM */
var React = require('react');
var Router = require('react-nested-router');
var Route = Router.Route;
var Link = Router.Link;

var App = React.createClass({
  getInitialState: function() {
    return {
      sources: [
        {
          name: "Normal words",
          words: []
        },
        {
          name: "Palindromes",
          words: []
        }
      ]
    }
  },
  indexTemplate: function() {
    var sources = this.state.sources.map(function(source) {
      return (
        <li>
          <Link to="question" sourceName={source.name}>
            {source.name}
          </Link>
        </li>  
      );
    });
    return (
      <div className="container">
        <header>
          <h1>Pimp my ferret</h1>
        </header>
        <ul className="source-list">
          {sources}
        </ul>
      </div>
    );
  },
  render: function() {
    return (
      <div className="container">
        {this.props.activeRoute || this.indexTemplate()}
      </div>
    );
  }
});

var Question = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Question!</h2>
        <p>{this.props.params.sourceName}</p>
        <Link to="/">Home</Link>
      </div>
    );
  }
});

var routes = (
  <Route name="home" handler={App}>
    <Route name="question" path="/:sourceName" handler={Question}/>
  </Route>
);

React.renderComponent(routes, document.body);