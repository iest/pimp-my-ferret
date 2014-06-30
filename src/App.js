/** @jsx React.DOM */
var React = require('react/addons');
var Link = require('react-nested-router').Link;
var Q = require('q');
var QuestionLogic = require('./QuestionLogic');

var App = React.createClass({
  getInitialState: function() {
    var self = this;

    var sources = [
      {
        name: "Normal Words",
      },
      {
        name: "Palindromes"
      }
    ];

    sources.forEach(function(source) {
      source.logic = new QuestionLogic(source.name);
    });

    Q.all(sources.map(function(source) { return source.logic.init() })).then(function() {
      sources.forEach(function(source) {
        source.progress = source.logic.getProgress();
        source.langsLearnt = source.logic.getLangsLearnt();
      });

      self.setState({ sources: sources });
    });

    return {
      sources: null
    }
  },
  indexTemplate: function() {
    var sources = this.state.sources.map(function(source) {
    var style = {
      width: source.progress,
    };
      return (
        <li>
          <div className="progress" style={style} />
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
    if (this.state.sources) {
      return (
        <div className="container">
          {this.props.activeRoute || this.indexTemplate()}
        </div>
      );
    } else {
      return (
        <h1>Loading...</h1>
      );   
    }
  }
});

module.exports = App;