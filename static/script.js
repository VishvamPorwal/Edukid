var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var phrases = [
    'I love to sing because it\'s fun',
    'where are you going',
    'can I call you tomorrow',
    'why did you talk while I was talking',
    'she enjoys reading books and playing games',
    'where are you going',
    'have a great day',
    'she sells seashells on the seashore'
];

var picsGallery = picsGallery = [{ img: "https://media.istockphoto.com/photos/red-apple-with-leaf-picture-id683494078?k=6&m=683494078&s=612x612&w=0&h=aVyDhOiTwUZI0NeF_ysdLZkSvDD4JxaJMdWSx2p3pp4=", text: 'apple' },
{ img: "https://www.conservationmagazine.org/wp-content/uploads/2013/04/sterile-banana.jpg", text: 'banana' },
{ img: "https://proto.gr/sites/www.proto.gr/files/styles/colorbox/public/images/fruits/cherries.jpg?itok=mDWbqXnf", text: 'cherry' },
{ img: "https://www.aicr.org/wp-content/uploads/2020/01/shutterstock_533487490-640x462.jpg", text: 'grapes' },
{ img: "https://cdn.shopify.com/s/files/1/1266/9241/articles/10_health_and_wellness_benefits_of_strawberries_Story_Page.jpeg?v=1523561527", text: 'strawberry' },
{ img: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8cGluZWFwcGxlfGVufDB8fDB8&w=1000&q=80", text: 'pineapple' },
{ img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWyuN5NHsHId2zxbDWH3eupjz6xd0h2DarEQ&usqp=CAU", text: 'mango' },
{ img: "https://cdn.shopify.com/s/files/1/0065/1637/5588/products/KiwiFruit.png?v=1594818907", text: 'kiwi' },
{ img: "https://images-na.ssl-images-amazon.com/images/I/5103YnAJEaL._SL1000_.jpg", text: 'papaya' },
{ img: "https://i.pinimg.com/736x/05/79/5a/05795a16b647118ffb6629390e995adb.jpg", text: 'orange' },
{ img: "https://thumbs.dreamstime.com/b/sliced-watermelon-25612609.jpg", text: 'watermelon' },
{ img: "https://www.thermofisher.com/blog/wp-content/uploads/2014/08/tomatoes.jpg", text: 'tomato' },
{ img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZdQp0YVkIHSVzRanla59XC2sWGdNAZrxAdQ&usqp=CAU", text: 'potato' },
{ img: "https://cdn.mos.cms.futurecdn.net/EBEXFvqez44hySrWqNs3CZ.jpg", text: 'cucumber' },
{ img: "https://cdn.shopify.com/s/files/1/1380/2059/products/Carrot-Orange_grande.jpg?v=1598079671", text: 'carrot' },
{ img: "https://d17fnq9dkz9hgj.cloudfront.net/breed-uploads/2018/08/beagle-card-medium.jpg?bust=1535569257", text: 'dog' },
{ img: "https://c.files.bbci.co.uk/12A9B/production/_111434467_gettyimages-1143489763.jpg", text: 'cat' },
{ img: "https://i.pinimg.com/originals/1c/2f/52/1c2f52962906d49ee2c3359a23de64e1.jpg", text: 'lion' },
{ img: "https://bsmedia.business-standard.com/_media/bs/img/article/2018-07/28/full/1532770168-0337.jpg", text: 'tiger' },
{ img: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Cow_female_black_white.jpg", text: 'cow' },
{ img: "https://www.thesprucepets.com/thmb/KYaXBSM013GnZ2jEZJnX4a9oIsU=/3865x2174/smart/filters:no_upscale()/horse-galloping-in-grass-688899769-587673275f9b584db3a44cdf.jpg", text: 'horse' },
{ img: "https://bsmedia.business-standard.com/media-handler.php?mediaPath=https://bsmedia.business-standard.com/_media/bs/img/article/2019-12/23/full/1577083902-3265.jpg&width=1200", text: 'donkey' },
{ img: "https://img.etimg.com/thumb/width-1200,height-900,imgsize-244631,resizemode-1,msid-64790715/news/politics-and-nation/monkey-menace-in-vrindaban.jpg", text: 'monkey' },
{ img: "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/MA_00077427_yjtgnj.jpg", text: 'elephant' }];
var phrasePara = document.querySelector('.phrase');
var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');

var testBtn = document.querySelector('.speech');

function randomPhrase() {
    var rnd = Math.floor(Math.random() * picsGallery.length);
    return rnd;
}

function testSpeech() {
    testBtn.disabled = true;
    testBtn.textContent = 'Test in progress';

    var pics = picsGallery[randomPhrase()];
    var text = pics.text;
    var imgs = pics.img;
    // To ensure case consistency while checking with the returned output text
    text = text.toLowerCase();
    phrasePara.innerHTML = "<img width=\"300px\" height=\"150px\" src='" + imgs + "'>";
    resultPara.textContent = 'Right or wrong?';
    resultPara.style.background = 'rgba(0,0,0,0.2)';
    diagnosticPara.textContent = '...diagnostic messages';

    var grammar = '#JSGF V1.0; grammar phrase; public <imgs> = ' + imgs + ';';
    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function (event) {
        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
        // It has a getter so it can be accessed like an array
        // The first [0] returns the SpeechRecognitionResult at position 0.
        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
        // These also have getters so they can be accessed like arrays.
        // The second [0] returns the SpeechRecognitionAlternative at position 0.
        // We then return the transcript property of the SpeechRecognitionAlternative object 
        var speechResult = event.results[0][0].transcript.toLowerCase();
        diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
        if (speechResult === text) {
            resultPara.textContent = 'I heard the correct phrase!';
            resultPara.style.background = 'lime';
        } else {
            resultPara.textContent = 'That didn\'t sound right.';
            resultPara.style.background = 'red';
        }

        console.log('Confidence: ' + event.results[0][0].confidence);
    }

    recognition.onspeechend = function () {
        recognition.stop();
        testBtn.disabled = false;
        testBtn.textContent = 'Start new test';
    }

    recognition.onerror = function (event) {
        testBtn.disabled = false;
        testBtn.textContent = 'Start new test';
        diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
    }

    recognition.onaudiostart = function (event) {
        //Fired when the user agent has started to capture audio.
        console.log('SpeechRecognition.onaudiostart');
    }

    recognition.onaudioend = function (event) {
        //Fired when the user agent has finished capturing audio.
        console.log('SpeechRecognition.onaudioend');
    }

    recognition.onend = function (event) {
        //Fired when the speech recognition service has disconnected.
        console.log('SpeechRecognition.onend');
    }

    recognition.onnomatch = function (event) {
        //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
        console.log('SpeechRecognition.onnomatch');
    }

    recognition.onsoundstart = function (event) {
        //Fired when any sound — recognisable speech or not — has been detected.
        console.log('SpeechRecognition.onsoundstart');
    }

    recognition.onsoundend = function (event) {
        //Fired when any sound — recognisable speech or not — has stopped being detected.
        console.log('SpeechRecognition.onsoundend');
    }

    recognition.onspeechstart = function (event) {
        //Fired when sound that is recognised by the speech recognition service as speech has been detected.
        console.log('SpeechRecognition.onspeechstart');
    }
    recognition.onstart = function (event) {
        //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
        console.log('SpeechRecognition.onstart');
    }
}

testBtn.addEventListener('click', testSpeech);
