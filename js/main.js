var $ = require('jquery');
var _ = require('underscore');
var data = require('../data.yaml');

$(update);

$(window).on('popstate', update);

$(document).on('click', 'a', function(e) {
  if (e.target.hostname = location.hostname) {
    e.preventDefault();
    location.hash = e.target.hash
    update();
  }
});


function update() {
  var answers = _(location.hash.slice(2).split(',')).compact();
  console.log('UPDATE', answers);

  if (location.hash == '')
    showIntro();
  else if (answers.length < data.questions.length)
    showQuestion(answers.length);
  else if (answers.length >= data.questions.length)
    showEnd();
  else
    showIntro();
}


function showIntro() {
  $(document.body).html(data.intro);
  document.body.id = 'intro';
}


function showQuestion(index) {
  let question = data.questions[index]
  console.log({question});
  var html = '<h1>' + question.prompt + '</h1>';
  var base = location.hash;
  if (base.length > 2)
    base += ',';
  question.answers.map(function(a, i) {
    html += '<a class=answer href=' + base + i + '>' + a.text + '</a><br>';
  });
  $(document.body).html(html);
  document.body.id = 'question';
}


function showEnd() {
  $(document.body).html(data.end);
  document.body.id = 'end';
}


