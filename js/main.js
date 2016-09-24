window.$ = require('jquery');
window._ = require('underscore');
var data = require('../data.yaml');

$(update);

$(window).on('popstate', update);

$(document).on('click', 'a', function(e) {
  if (e.target.hostname = location.hostname) {
    e.preventDefault();
    setHash(e.target.hash);
    update();
  }
});


function update() {
  var answers = parseHash();

  if (location.hash == '')
    showIntro();
  else if (answers.length < data.questions.length)
    showQuestion(answers.length);
  else if (answers.length >= data.questions.length)
    showEnd(answers);
  else
    showIntro();
}

function setHash(hash) {
  history.replaceState(undefined, undefined, location.pathname + hash);
}

function parseHash() {
  var answers = _(location.hash.slice(2).split(',')).compact();
  return answers.map(function(a) { return a * 1; });
}

function score() {
  return parseHash().reduce(function(sum,a,i) {
    return sum + data.questions[i].answers[a].points
  },0);
};

function showIntro() {
  $(document.body).html(data.intro);
  document.body.id = 'intro';
}


function showQuestion(index) {
  let question = data.questions[index]
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
  var answers = parseHash();
  var html = data.end

  html += '<main></main>'

  html += '<div class="questions closed"><h2 class=change>Change my answers<h2><div class=close>&times;</div>'
  html += data.questions.map(function(q, i) {
    return (
      '<h4>' + q.prompt + '</h3>' +
      '<select>' +
        q.answers.map(function(a, j) {
          if (answers[i] === j)
            return '<option selected value=' + j + '>' + a.text + '</option>';
          else
            return '<option value=' + j + '>' + a.text + '</option>';
        }).join('') +
      '</select>'
    );
  }).join('');
  html += '</div>';

  $(document.body).html(html);
  document.body.id = 'end';
  buildNewspaper();
}

function buildNewspaper() {
  var html = '';
  var answers = parseHash();

  var main = data['main story'].slice().reverse().find(function(option) {
    return score() >= option.points;
  });
  main = main || _(data['main story']).last();
  html += '<article class=main>' + main.html + '</article>';

  answers.forEach(function(a,i) {
    html += '<article>' + data.questions[i].answers[a].story + '</article>';
  });

  $('main').html(html);
}


$(document).on('click', 'body#end .change', function(e) {
  $('.questions').removeClass('closed');
});

$(document).on('click', 'body#end .close', function(e) {
  $('.questions').addClass('closed');
});

$(document).on('change', 'select', function(e) {
  setHash('#q' + _($('select')).map(el => el.value).join());
  buildNewspaper();
});


