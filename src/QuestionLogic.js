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
      language: word.lang,
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
};

module.exports = QuestionLogic;