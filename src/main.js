/** @jsx React.DOM */
var React = require('react');
var Router = require('react-nested-router');
var Route = Router.Route;
var Link = Router.Link;
var Q = require('q');
var _ = require('lodash');

var QuestionLogic = function(sourceName) {
  var self = this;

  self.ferretImages = _.range(0, 10);

  self.init = function () {
    return loadMasterList().then(function(masterList) {
      self.masterList = masterList; 
      self.userList = loadUserList();

      if (self.userList.length === 0) {
        self.userList = _.sample(self.masterList, 3);
        saveUserList();
      }
    });
  };

  self.createQuestion = function () {
    var word = _.sample(self.userList);
    var wrongAnswers = _.sample(self.masterList, 3).map(function(word) { 
      return word.target; 
    });

    var question = {
      en: word.en,
      target: word.target,
      language: word.language,
      answers: _.shuffle(wrongAnswers.concat(word.target))
    };

    return question;
  };

  self.getFerretImage = function() {
    var image = '/ferrets/' + _.sample(self.ferretImages) + '.jpg';
  
    return image;
  };

  self.getProgress = function() {
    return Math.floor((self.userList.length / self.masterList.length) * 100, 0).toString() + '%';
  };

  self.getLangsLearnt = function() {
    return _.keys(_.groupBy(self.userList, function(word) { return word.lang; })).length;
  };

  self.answerQuestion = function(question, answer) {
    if (question.target === answer) {
      if (self.userList.length < self.masterList.length) {
        // TODO: this might need to be optimized...
        var availableList = _.reject(self.masterList, function(word) {
          return _.some(self.userList, function (userWord) {
            return word.en === userWord.en;
          })
        });

        self.userList.push(_.sample(availableList));
        saveUserList();
      }

      return true;
    } else {
      return false;      
    }
  };

  function loadUserList() {
    var rawData = localStorage.getItem('userList-' + sourceName);

    return rawData ? JSON.parse(rawData) : [];
  }

  function saveUserList() {
    localStorage.setItem('userList-' + sourceName, JSON.stringify(self.userList));
  }

  function loadMasterList() {
    var request = new XMLHttpRequest();
    request.open('GET', '/lists/' + sourceName + '.json', true);

    var deferred = Q.defer();

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        var data = JSON.parse(request.responseText);

        deferred.resolve(data);
      } else {
        deferred.reject(new Error('Data load error'));
      }
    };

    request.onerror = function() {
      deferred.reject(new Error('Data load error'));
    };

    request.send();
    
    return deferred.promise;
  }
};;

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
      return (
        <li>
          <Link to="question" sourceName={source.name}>
            {source.name} (progress: {source.progress}, langsLearnt: {source.langsLearnt})
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

var Answer = React.createClass({
  handleAnswerClick: function() {
    this.props.clickCallback(this.props.answer);
  },
  render: function() {
    return (
      <li>
        <button onClick={this.handleAnswerClick} className="answer-button">
          {this.props.answer}
        </button>
      </li>
    );
  }
});

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
      this.setState({ question: this.logic.createQuestion() })
    }
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
            <Answer answer={this.state.question.answers[0]} clickCallback={this.answerClicked} />
            <Answer answer={this.state.question.answers[1]} clickCallback={this.answerClicked} />
            <Answer answer={this.state.question.answers[2]} clickCallback={this.answerClicked} />
            <Answer answer={this.state.question.answers[3]} clickCallback={this.answerClicked} />
          </ul>
        </div>
      );
    }
  }
});

var routes = (
  <Route name="home" handler={App}>
    <Route name="question" path="/:sourceName" handler={Question}/>
  </Route>
);

React.renderComponent(routes, document.body);
