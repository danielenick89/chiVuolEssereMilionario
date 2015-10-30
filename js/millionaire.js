/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Millionaire = (function() {
    
    var main,recap,question,sigla,logo,qdm;
    
    var SoundManager = (function() {
        
        var sounds = {
            'correct': "sounds/correct.mp3",
            'wrong': "sounds/wrong.mp3",
            'accendiamo': "sounds/accendiamo.mp3",
            "background": "sounds/background.mp3",
            "transition": "sounds/transition.mp3",
            "intro": "sounds/intro.mp3",
            "waiting": "sounds/waiting.mp3",
            "wins": "sounds/wins_everything.mp3",
            "dio": "sounds/dio_benedica.mp3",
            "standby":"sounds/standby.mp3"
        };
        
        var audio = new Audio();
        
        
        var play = function(key,callback) {
            if(sounds[key]) {
                audio.src = sounds[key];
                audio.loop = false
                audio.onended = callback;
                audio.play();
            }
        }
        var loop = function(key,callback) {
            if(sounds[key]) {
                audio.src = sounds[key];
                audio.loop = true
                audio.onended = callback;
                audio.play();
            }
        }
        
        return {
            play:play,
            loop:loop
        };
    })();
    
    var MainManager = function(container) {
        
        var getLastVideoSourceId = function(callback) {
            MediaStreamTrack.getSources(function(sourceInfos) {
                var audioSource = null;
                var videoSource = null;

                for (var i = 0; i != sourceInfos.length; ++i) {
                    var sourceInfo = sourceInfos[i];
                    if (sourceInfo.kind === 'audio') {
                            audioSource = sourceInfo.id;
                    } else if (sourceInfo.kind === 'video') {
                            videoSource = sourceInfo.id;
                            break;
                    } else {
                            console.log('Some other kind of source: ', sourceInfo);
                    }
                }

                //callback(videoSource);

                //bypass to be removed
                var videoSources = sourceInfos.filter(function(e) { return e.kind == 'video'; } );

                callback(videoSources[0].id);
            });
        }
        
        var video;
        
        var loadCamera = function() {
            video = document.createElement('video');
            video.autoplay = true;
            video.className = 'camera'
            video.style.display = cameraEnabled ? '' : 'none';
            
            container.appendChild(video);
            
            navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;

        
        
            if (navigator.getUserMedia) {
                getLastVideoSourceId(function(lastSourceId) {
                    navigator.getUserMedia({audio: false, video: {optional: [{sourceId: lastSourceId}]}}, function(stream) {
                        stream = stream;
                        video.src = window.URL.createObjectURL(stream);
                        video.oncanplay;
                    }, function(err) {
                        console.log("err: " + err);
                        
                    });
                });
            } else {
                  console.log('Cannot access webcam.');
            }
            
        }
        
        var cameraEnabled = false;
        var toggleCamera = function() {
            cameraEnabled = ! cameraEnabled;
            video.style.display = cameraEnabled ? '' : 'none';
            return cameraEnabled;
        }
        
        loadCamera();
        
        return {
            toggleCamera: toggleCamera
        };
    }
    
    var RecapManager = function(container) {
        return {};
    }
    
    var QuestionManager = function(container) {
        
        
        var highlighted = -1;
        var showIndex = 0;
        var question = null;
        
        
        container.innerHTML = "";
        
        var QuestionBox = function() {
            var qc = document.createElement('div');
            qc.className = "question-container";
            
            container.appendChild(qc);
            
            var setQuestionText = function(text) {
                qc.innerText = text;
            }
            
            return {
                setQuestionText:setQuestionText
            };
        };
        
        var AnswerBox = function(index) {
            var answerLabel  = ["A","B", "C", "D"];
            var ac = document.createElement('div');
            ac.className = "answer-container answer-container-"+index;
            container.appendChild(ac);
            
            var setAnswerText = function(text) {
                ac.innerHTML = "<span class=\"answer-label\">" + answerLabel[index] + ":</span> " + text;
            }
            
            var highlight = function() {
                ac.className += " highlighted";
            }
            
            var deHighlight = function() {
                ac.className = ac.className.replace("highlighted","");
            }
            
            var right = function() {
                ac.className = ac.className.replace("highlighted","correct");
            }
            
            var wrong = function() {
                ac.className = ac.className.replace("highlighted","wrong");
            }
            
            var reset = function() {
                ac.className = "answer-container answer-container-"+index;
                ac.innerHTML = "";
            }
            
            return {
                setAnswerText:setAnswerText,
                highlight:highlight,
                wrong:wrong,
                right:right,
                reset:reset,
                deHighlight:deHighlight
            };
        }
        
        
        
        //methods
        
        var reset = function() {
            for(var i=0; i<answerBoxes.length; i++) {
                answerBoxes[i].reset();
            }
            
            highlighted = -1;
            showIndex = 0;
        }
        
        var loadQuestion = function(q) {
            reset();
            question = q;
            questionBox.setQuestionText(question.question);
        }
        
        var showNext = function() {
            if(showIndex == 4) return;
            answerBoxes[showIndex].setAnswerText(question.options[showIndex]);
            showIndex++;
        }
        
        var accendi = function(i) {
            if(highlighted == i) {
                highlighted = -1;
                answerBoxes[i].deHighlight();
                SoundManager.loop('background');
            } else {
                highlighted = i;
                answerBoxes[i].highlight();
                SoundManager.play('accendiamo',function() {
                    SoundManager.loop('waiting');
                });
            }
        }
        
        
        var wrong = function() {
            if(highlighted != null) {
                answerBoxes[highlighted].wrong();
                SoundManager.play('wrong',function() {
                    SoundManager.loop('background');
                });
            }
        }
        
        var right = function(callback) {
            if(highlighted != null) {
                answerBoxes[highlighted].right();
                SoundManager.play('correct',callback);
            }
        }
        
        var show = function() {
            container.style.display = '';
        }
        
        var hide = function() {
            container.style.display = 'none';
        }
        
        
        
        
        var questionBox = QuestionBox();
        
        var answerBoxes = [0,1,2,3].map(function(i) { return AnswerBox(i); })
        
        
        
        
        
        return {
            loadQuestion:loadQuestion,
            accendi:accendi,
            wrong:wrong,
            right:right,
            showNext:showNext,
            show:show,
            hide:hide
        };
    }
    
    var SiglaManager = function(container) {
        return {};
    }
    
    var LogoManager  = function(container) {
        
        var show = function() {
            container.style.display = '';
        }
        
        var hide = function() {
            container.style.display = 'none';
        }
        
        hide();
        
        return {
            show:show,
            hide:hide
        }
    }
    
    var GameManager = function() {
        
    }
    
    var QuestionsDataManager  = function(questions) {
        
        var current = -1;
        
        var nextQuestion = function() {
            if(questions[current+1]) {
                return questions[current++];
            } else {
                return false;
            }
        }
        
        var nextQuestion = function() {
            if(questions[current+1]) {
                return questions[++current];
            } else {
                return false;
            }
        }
        
        var isLastQuestion = function() {
            if(questions[current+1]) {
                return false;
            } else {
                return true;
            }
        }
        
        var getCurrentIndex = function(current) {
            return current;
        }
        
        return {
            isLastQuestion:isLastQuestion,
            nextQuestion:nextQuestion,
            getCurrentIndex:getCurrentIndex
        };
    }
    
    
    
    
    var init = function(questions, mainContainer, recapContainer, questionContainer, siglaContainer, logoContainer) {
        
        main = MainManager(mainContainer);
        recap = RecapManager(recapContainer);
        question = QuestionManager(questionContainer);
        sigla = SiglaManager(siglaContainer);
        logo = LogoManager(logoContainer);
        
        qdm = QuestionsDataManager(questions);
    }
    
    var standBy = false;
    var next = function() {
        question.hide();
        if(qdm.isLastQuestion()) {
            SoundManager.play('wins',function() {
                SoundManager.loop('dio');
            });
            return;
        }
        
        if(standBy) {
            
            question.show();
            standBy = false;
            SoundManager.play('transition',function() {
                SoundManager.loop('background');
            });
            question.loadQuestion(qdm.nextQuestion());
            
        } else {
            standBy = true;
            SoundManager.loop('standby');
        }
    }
    
    var right = function() {
        question.right(function() {
            next()
        })
    }
    var wrong = function() {
        question.wrong()
    }
    
    var showNext = function() {
        question.showNext();
    }
    
    var toggleCamera = function() {
        main.toggleCamera() ? logo.show() : logo.hide();
        
    }
    
    var keyDispatcher = function(e) {
        console.log(e.which);
        
        switch(e.which) {
            case 65: question.accendi(0); break; //a
            case 66: question.accendi(1); break; //b
            case 67: question.accendi(2); break; //c
            case 68: question.accendi(3); break; //d
                
            case 89: right(); break; //y
            case 78: wrong(); break; //n
            
            case 39: next(); break; //freccia destra
            
            case 40: showNext(); break; //freccia giù
                
            case 70: toggleCamera(); break; //f
        }
        
    }
    
    document.body.onkeyup = keyDispatcher;
    
    
    return {
        init:init,
        next:next
    };
})();