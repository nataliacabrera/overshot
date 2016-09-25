window.$ = require('jquery');
window._ = require('underscore');

import 'core-js/es6/promise';
import 'whatwg-fetch';
import jsYaml from 'js-yaml';
import moment from 'moment';

var data;

$(() => {

  fetch('data.yaml')
  .then(response => {
    if (response.ok)
      return response.text();
    else
      document.body.innerHTML = `
        <pre>
          ${response.url}
          ${response.statusText}
        </pre>
      `;
  })
  .then(yaml => {
    data = jsYaml.safeLoad(yaml);
    update();
  })
  .catch(err => {
    console.error(err);
    // yaml error
    if (error.reason) {
      document.body.innerHTML = `
        <pre>
          ${err.reason}
          ${err.mark}
        </pre>
      `;
    }
    else
      document.body.innerHTML = `<pre>${err.message}</pre>`;
  });

});

$(window).on('popstate', function() {
  update();
  $('.modal').remove();
});

$(document).on('click', 'a', function(e) {
  if (e.target.hostname === location.hostname) {
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
  history.pushState(undefined, undefined, location.pathname + hash);
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

  var questions = data.questions.map(function(q, i) {
    return `
      <h3>${q.prompt}</h3>
      <select>` +
        q.answers.map(function(a, j) {
          if (answers[i] === j)
            return '<option selected value=' + j + '>' + a.text + '</option>';
          else
            return '<option value=' + j + '>' + a.text + '</option>';
        }).join('') +
      '</select>'
  }).join('');

  var html = `
    ${data['end modal']}
    <header>
      <img class=nyt src=images/NYTheader.jpg>
      <div class=top-date></div>
    </header>
    <main></main>
    <img class=nyt src=images/NYTbottom.png>
    <div class=changer>
      <h2>Change my answers</h2>
      <div class=close>&times;</div>
      <div class=questions>${questions}</div>
    </div>
  `;

  $(document.body).html(html);
  buildNewspaper();
  document.body.id = 'end';
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
    html += '<article class=question' + i + '>' + data.questions[i].answers[a].story + '</article>';
  });

  html += '<img class=nyt-filler src=images/NYTfiller.png>';

  $('main').html(html);

  let days = (10 - score()) * 36.5;
  let date = new Date(2040, 0, 1)
  date = date.setDate(date.getDate() + days);
  $('.top-date').text(moment(date).format('MMMM Do YYYY')); 
}


$(document).on('click', 'body#end .modal', function(e) {
  $('.modal').remove();
});

$(document).on('click', 'body#end .changer h2', function(e) {
  if ($(e.target).is('.close'))
    return;
  $('.changer').addClass('active');
});

$(document).on('click', 'body#end .close, body#end main', function(e) {
  $('.changer').removeClass('active');
});

$(document).on('change', 'select', function(e) {
  setHash('#q' + _($('select')).map(el => el.value).join());
  buildNewspaper();
});


