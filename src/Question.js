/** @jsx React.DOM */
var React = require('react/addons');
var QuestionLogic = require('./QuestionLogic');
var Link = require('react-nested-router').Link;
var Answer = require('./Answer');

var Question = React.createClass({
  getInitialState: function() {
    var self = this;

    self.correctAnswers = 0;

    self.logic = new QuestionLogic(this.props.params.sourceName);

    self.logic.init().then(function() {
      self.setState({ question: self.logic.createQuestion() });
    });

    return { question: null };
  },
  answerClicked: function(answer) {
    var result = this.logic.answerQuestion(this.state.question, answer);
    var self = this;

    if (result) {
      this.correctAnswers++;
    } else {
      this.correctAnswers = 0;
    }

    if (this.correctAnswers === 3) {
      this.correctAnswers = 0;
      
      this.setState({ ferret: this.logic.getFerretImage() })
    
      var self = this;

      setTimeout(function() {
        self.setState({ question: self.logic.createQuestion(), ferret: null })
      }, 3000);
    } else {
      setTimeout(function() {
        self.setState({ question: self.logic.createQuestion() })
      }, 1000);
    };
  },
  handleTimeout: function() {
    this.setState({ question: this.logic.createQuestion() })
  },
  render: function() {
    if (!this.state.question) {
      return (<h1>Loading!</h1>);
    } else if (this.state.ferret) {
      return (<img src={this.state.ferret} />);
    } else {
      return (
        <div className="container">
          <div className="answer-header">
            <Link to="/" className="back-button">Home</Link>
            <h2>{this.state.question.en}</h2>
          </div>
          <ul className="answer-list">
            <Answer answer={this.state.question.answers[0]} clickCallback={this.answerClicked} correctAnswerLang={this.state.question.language} isCorrect={this.state.question.answers[0] === this.state.question.target} isWrong={this.state.question.answers[0] !== this.state.question.target}/>
            <Answer answer={this.state.question.answers[1]} clickCallback={this.answerClicked} correctAnswerLang={this.state.question.language} isCorrect={this.state.question.answers[1] === this.state.question.target} isWrong={this.state.question.answers[1] !== this.state.question.target}/>
            <Answer answer={this.state.question.answers[2]} clickCallback={this.answerClicked} correctAnswerLang={this.state.question.language} isCorrect={this.state.question.answers[2] === this.state.question.target} isWrong={this.state.question.answers[2] !== this.state.question.target}/>
            <Answer answer={this.state.question.answers[3]} clickCallback={this.answerClicked} correctAnswerLang={this.state.question.language} isCorrect={this.state.question.answers[3] === this.state.question.target} isWrong={this.state.question.answers[3] !== this.state.question.target}/>
          </ul>
        </div>
      );
    }
  }
});

module.exports = Question;