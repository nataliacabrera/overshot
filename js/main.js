var $ = require('jquery');
var _ = require('underscore');

var data = require('../data.yaml');
console.log(data);

$(window).on('popstate', update);

$(document).on('click', 'a', function(e) {
  if (e.target.hostname = location.hostname) {
    e.preventDefault();
    location.hash = e.target.hash
    update();
  }
});


$(update);

function update() {
  var step = location.hash.slice(1);
  console.log('UPDATE', step);

  if (step == '')
    showIntro();
  else if (step == 'q0')
    showQuestion(0);
  else if (step == 'q1')
    showQuestion(1);
}


function showIntro() {
  $(document.body).html(data.intro);
  document.body.id = 'intro';
}

function showQuestion(index) {
  var html = '<div class=question>';
  let question = data.questions[index]
  console.log({question});
  html += question.prompt;
  html += '</div>';
  question.answers.map(function(a) {
    html += '<a href=#q' + (index+1) + '>' + a.text + '</a><br>';
  });
  $(document.body).html(html);
  document.body.id = 'question';
}

function answerQuestion(e) {

}

function showEnd() {

}

function generatePaper() {

}


