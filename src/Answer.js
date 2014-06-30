/** @jsx React.DOM */
var React = require('react/addons');

var Answer = React.createClass({
  getInitialState: function() {
    return {
      answered: false
    }
  },
  handleAnswerClick: function() {
    var self = this;
    this.props.clickCallback(this.props.answer);
    this.setState({
      answered: true
    });
    setTimeout(function() {
      self.setState({
        answered: false
      })
    }, 1000);
  },
  render: function() {

    if (this.state.answered && this.props.isCorrect) {
      var cx = React.addons.classSet;
      var classes = cx({
        "answer-button": true,
        "answer-button--correct": this.props.isCorrect
      });
      return (
        <li>
          <button onClick={this.handleAnswerClick} className={classes}>
            {this.props.correctAnswerLang}
          </button>
        </li>
      );
    } else if (this.state.answered && this.props.isWrong) {
      var cx = React.addons.classSet;
      var classes = cx({
        "answer-button": true,
        "answer-button--wrong": this.props.isWrong
      });
      return (
        <li>
          <button onClick={this.handleAnswerClick} className={classes}>
            {this.props.answer}
          </button>
        </li>
      );
    } else {
      return (
        <li>
          <button onClick={this.handleAnswerClick} className="answer-button">
            {this.props.answer}
          </button>
        </li>
      );
    }
  }
});

module.exports = Answer;