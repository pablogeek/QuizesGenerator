var namesGame = Array();

var holder = document.getElementById('holder'),
    tests = {
      filereader: typeof FileReader != 'undefined',
      dnd: 'draggable' in document.createElement('span'),
      formdata: !!window.FormData,
      progress: "upload" in new XMLHttpRequest
    },
    support = {
      filereader: document.getElementById('filereader'),
      formdata: document.getElementById('formdata'),
      progress: document.getElementById('progress')
    },
    acceptedTypes = {
      'image/png': true,
      'image/jpeg': true,
      'image/gif': true,
      'text/txt' : true
    },
    progress = document.getElementById('uploadprogress'),
    fileupload = document.getElementById('upload');

"filereader formdata progress".split(' ').forEach(function (api) {
  if (tests[api] === false) {
    support[api].className = 'fail';
  } else {
    // FFS. I could have done el.hidden = true, but IE doesn't support
    // hidden, so I tried to create a polyfill that would extend the
    // Element.prototype, but then IE10 doesn't even give me access
    // to the Element object. Brilliant.
    support[api].className = 'hidden';
  }
});

Array.prototype.extend = function (other_array) {
    /* you should include a test to check whether other_array really is an array */
    other_array.forEach(function(v) {this.push(v)}, this);
}

function previewfile(file) {
  //if (tests.filereader === true && acceptedTypes[file.type] === true) {
    var reader = new FileReader();
    reader.onload = function (event) {
      console.log('file load');

      var contents = reader.result;
      var lines = contents.split('\n');

        holder.innerHTML += '<p>Content </p>';
        var imagesQuiz = Array();
        var namesQuiz = Array();

        var lineNames = lines[0];
        namesGame = lineNames.split(',');

        var correctAnswer = 0;
        var quizs = Array();
        var line = 2;
        for (; line < lines.length-1; line++) {

          var lineString = lines[line];
          if(lineString != '-'){
            var resultsQuizs = Array();
            //holder.innerHTML += '<p>' + lineString + '</p>';
            var lineArray = lineString.split('>');
            imagesQuiz.push(lineArray[0]);
            namesQuiz.push(lineArray[1]);
            if(correctAnswer == 0){
              correctAnswer = getRandomInt(0,5) + 1;
            }
            var Result = {
              resultText : lineArray[1],
              resultValue: correctAnswer
            }

            var restOfResults = generate5Results(correctAnswer);
            resultsQuizs.push(Result);
            resultsQuizs.extend(restOfResults);

            resultsQuizs = shuffle(resultsQuizs);

            var Answers = {
              results : resultsQuizs,
              correctAnswer : correctAnswer,
              imageURL : lineArray[0]
            }

            var Quiz = {
              answers: Answers
            }
            quizs.push(Quiz);
          //holder.innerHTML += '<p>' + JSON.stringify(restOfResults) + '</p>';
          }
        }

        var Game = {
          quizs : quizs,
          level : parseInt(document.getElementById('txtLevel').value),
          local : false
        }

        var WrapGame = {
          game : Game
        }

        holder.innerHTML += '<p>' + JSON.stringify(WrapGame) + '</p>';

      /*var image = new Image();
      image.src = event.target.result;
      image.width = 250; // a fake resize
      holder.appendChild(image);*/
    };
  reader.onloadend = function(evt) {
    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
      //holder.innerHTML += '<p>Content ' + evt.target.result;
      /*document.getElementById('byte_content').textContent = evt.target.result;
      document.getElementById('byte_range').textContent =
        ['Read bytes: ', start + 1, ' - ', stop + 1,
         ' of ', file.size, ' byte file'].join('');*/
       }
    };
    //var blob = file.slice(0, 30 + 1);
    reader.readAsBinaryString(file);
    //reader.readAsDataURL(file);
  /*}  else {
    holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
    console.log(file);
  }*/
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function generate5Results(correctAnswer){
  var fiveResultsArray = Array();
  for(var cont = 1 ; cont <= 6; cont++){
    if(cont != correctAnswer){
      var Result = {
        resultText : namesGame[getRandomInt(0,namesGame.length-1)],
        resultValue: cont
      }
      fiveResultsArray.push(Result);
    }
  }
  return fiveResultsArray;

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomBetween1and6(){
        var  n = Math.floor(Math.random() * (6 - 1 + 1)) + min;
        if(arguments[0] == n || (arguments.length>1 && arguments[1] == n)){
            if(arguments.length>1){
                return generateRandomBetween1and6(arguments[0], arguments[1]);
            }else{
                return generateRandomBetween1and6(arguments[0]);
            }
        }else{
            return n;
        }
    }

function generateJson(){

}

function readfiles(files) {
    debugger;
    var formData = tests.formdata ? new FormData() : null;
    for (var i = 0; i < files.length; i++) {
      if (tests.formdata) formData.append('file', files[i]);
      previewfile(files[i]);
    }

    // now post a new XHR request
    if (tests.formdata) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/devnull.php');
      xhr.onload = function() {
        progress.value = progress.innerHTML = 100;
      };

      if (tests.progress) {
        xhr.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            var complete = (event.loaded / event.total * 100 | 0);
            progress.value = progress.innerHTML = complete;
          }
        }
      }

      xhr.send(formData);
    }
}

if (tests.dnd) {
  holder.ondragover = function () { this.className = 'hover'; return false; };
  holder.ondragend = function () { this.className = ''; return false; };
  holder.ondrop = function (e) {
    this.className = '';
    e.preventDefault();
    readfiles(e.dataTransfer.files);
  }
} else {
  fileupload.className = 'hidden';
  fileupload.querySelector('input').onchange = function () {
    readfiles(this.files);
  };
}
