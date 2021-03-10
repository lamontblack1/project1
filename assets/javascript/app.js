// Your web app's Firebase configuration**************
var firebaseConfig = {
    apiKey: "AIzaSyB1TrIIy62YBgWnmc3roTo8L2IldcUmHBM",
    authDomain: "fiveminutechat-694e9.firebaseapp.com",
    databaseURL: "https://fiveminutechat-694e9-default-rtdb.firebaseio.com",
    projectId: "fiveminutechat-694e9",
    storageBucket: "fiveminutechat-694e9.appspot.com",
    messagingSenderId: "689324897813",
    appId: "1:689324897813:web:a89e80e2244489d409c01c"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
 // assign variable to reference the database
  let db = firebase.database();
  let connectionsListRef = db.ref("/connections");
  // '.info/connected' is a special location provided by Firebase that is updated every time
  // the client's connection state changes.
  // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
  let connectedParticipants= db.ref(".info/connected");

    let myThreadId = ""
    let myScreenName = ""
    let myUserId = Math.floor(Math.random() * 100000);
    let otherParticipantName = ""
    let secondsLeft = 300
    //  Variable that will hold our interval ID when we execute
    //  the "run" function
    var intervalId;
    let timerStarted = false
    let startChatting = false
    
        // db.ref("/Chatrooms/" + myThreadId).on("value", function(snap) {
        //   console.log(myThreadId)
        //   console.log("this chatroom value event: " + snap.key)
        // });

    db.ref("/Chatrooms").on("child_changed", function(snap,snapKey) {
      // console.log(snap.val())
      if (((snap.val().participant1UserId) == myUserId) || ((snap.val().participant2UserId) == myUserId)) {
            if (((snap.val().participant1) !== "") && ((snap.val().participant2) !=="")) {
              // console.log("chatroom child changed event")
              // console.log(snap.val().participant1)
              // console.log(snap.val().participant2)

                if (myScreenName === (snap.val().participant1)) {
                  otherParticipantName = snap.val().participant2
                }
                else if (myScreenName === (snap.val().participant2)) {
                  otherParticipantName = snap.val().participant1
                }
                let displayOtherParticipantTxt = "Your Five-Minute Chat buddy is " + otherParticipantName
                // console.log(displayOtherParticipantTxt)
                $("#chattersInfoLine").text(displayOtherParticipantTxt)
                if (!startChatting) {
                  startChatting = true
                  let newMessageObj = {
                    participantName: "Five-Minute Chat",
                    message: "Start chatting! Enjoy with the random gifs that come with your message!",
                    messageTime: firebase.database.ServerValue.TIMESTAMP,
                    gifUrl: "./assets/dog.gif",
                    chatroomId: myThreadId,
                    searchWord: ""
                  }
                  db.ref("/messages").push(newMessageObj)
                }
                if (!timerStarted) {
                  run()
                  timerStarted = true
                }
            }
      } 
    });

    db.ref("/Chatrooms").on("child_added", function(snap) {
      // console.log(snap.val())
      if (snap.val()) {
        // console.log("thread " + myThreadId)
        let intParticipants = parseInt(snap.val().participants);
        if (myThreadId === "") {
          // console.log(snap.key)
          console.log("how many room part: " + intParticipants)
          //If this "room" has only one participant then make this my room, ergo my thread id
          if (intParticipants === 1) {
            myThreadId = snap.key
            db.ref("/Chatrooms/" + myThreadId).update({participants: 2})
            //handle the child added event if this instance is the 1 participant and has logged in name
            // if ((snap.val().participant1) === myScreenName) {
            //   myThreadId = snap.key
            // }
            //but if 
            if ((snap.val().participant1) !== "") {
                otherParticipantName = snap.val().participant1
                let displayOtherParticipantTxt = "Your Five-Minute Chat buddy is " + otherParticipantName
                // console.log(displayOtherParticipantTxt)
                $("#chattersInfoLine").text(displayOtherParticipantTxt)
                //don't think I need htis
                // let chatRoomObj = {
                //   participants: 2,
                //   participant1: snap.val().participant1,
                //   participant2: myScreenName
                // }
                // db.ref("/Chatrooms/"+ snap.key).set(chatRoomObj)

            }
          }
        }
        // if 2 in chatroom but still waiting for complete information...
       
        if ((intParticipants === 2) && (myThreadId === snap.key) && (otherParticipantName === "")) {
          //If both in chatroom but one hasnt logged name yet..
          if (((snap.val().participant1) === "") || ((snap.val().participant2) ==="")) {
              let newMessageObj = {
                participantName: "Five-Minute Chat",
                message: "Both participants are almost ready",
                messageTime: firebase.database.ServerValue.TIMESTAMP,
                gifUrl: "./assets/dog.gif",
                chatroomId: myThreadId,
                searchWord: ""
              }
            db.ref("/messages").push(newMessageObj)
            // db.ref("/Chatrooms/" + myThreadId).update({participants: 2})

          }
          
        }
      }

    });

    //my room (mythreadid) messages
    db.ref("/messages").on("child_added", function(snap) {
      // console.log(snap.val())
      if (myThreadId !== "") {
        let dbChatroomId = snap.val().chatroomId
          // only use it if it is a message from our chatroom, since all messages are together
          if (myThreadId === dbChatroomId) {
            let strSenderName = snap.val().participantName
            let strMessage = snap.val().message
            let strUrl = snap.val().gifUrl
            let dateVal = snap.val().messageTime
            let msgTimeStamp = moment(dateVal).format("hh:mma")
            let strTopic = snap.val().searchWord
             //slice message so you can isolate word used for gif
             let strMessageToDisplay = strMessage
             if (strTopic !== "") {
                let i = strMessage.indexOf(strTopic)
                if (i > 0) {
                  leftMessage = strMessage.slice(0, i)
                  let rightMessage = strMessage.slice(i + strTopic.length + 1, 2000)
                  strMessageToDisplay = leftMessage + " <b>" + strTopic.toUpperCase() + " </b>" + rightMessage  
                }
             }


            //if it is my message, put on right, their message, put on left
            if (strSenderName == myScreenName) {
              $("#messagesBox").prepend(
                "<div class='row mt-3'><div class='col-5'></div>" +
                "<div class='col-7'>" +
                    "<div class='card my-message-card'>" +
                        "<div class='row no-gutters'>" +
                            "<div class='col-md-3'>" +
                            "<img src='" + strUrl + "' alt=''>" +
                            "</div>" +
                                "<div class='col-md-9'>" +
                                    "<div class='card-body p-2'>" +
                                        "<p class='card-title m-0'>" + strSenderName + "  <small class='text-muted'>" + msgTimeStamp + "</small></p>" +
                                        "<p class='card-text'>" + strMessageToDisplay + "</p>" +
                                        "</div>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>"
              )
            }
            else {
              $("#messagesBox").prepend(
                "<div class='row mt-3'>" +
                    "<div class='col-7'>" +
                        "<div class='card their-message-card'>" +
                            "<div class='row no-gutters'>" +
                                "<div class='col-md-9'>" +
                                    "<div class='card-body p-2'>" +
                                        "<p class='card-title m-0'>" + strSenderName + "  <small class='text-muted'>" + msgTimeStamp + "</small></p>" +
                                        "<p class='card-text'>" + strMessageToDisplay + "</p>" +
                                    "</div>" +
                                "</div>" +
                                "<div class='col-md-3'>" +
                                    "<img src='" + strUrl + "' alt=''>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                    "<div class='col-5'></div>" +
                "</div>"
              )            
            }

          }
      }
    });
    // db.ref("/Chatrooms/"+ myThreadId + "/messages").on("child_added", function(snap) {
    //   console.log(snap.val())
    // });

    connectedParticipants.on("value", function(snap) {
      // If they are connected..
      if (snap.val()) {
        // Add user to the connections list.
        var con = connectionsListRef.push(true);
        // Remove user from the connection list when they disconnect.
        // console.log(connectionsListRef.key)
        // console.log(con.key)
        con.onDisconnect().remove();
        //add a notification that the player disconnected

        //UNDONE make a connection for the chatroom, destroy room upon disconnect, onvalue event for
        // that room to start over for remaining participant
      }
    });

    connectionsListRef.on("value", function(snap) {
      //update the number of connections
      intConnections = snap.numChildren()
      // console.log("connections: " + intConnections)
    });

  //giphy.com api setup*********************************************************8

  function getGifSendMessage(strTopic, strMessage) {
    let placeholder = Math.floor(Math.random() * 100) + 1
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=dSe8JxZC5c32HRcUeWDIT7n5R8PYUmTF&q="+ 
      strTopic +"&rating=g&limit=1&offset=" + (placeholder);
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
          console.log(response)
            console.log(response.data.length);
          let ary = response.data
              const element = ary[0];
              console.log(ary[0])
              let strUrl = element.images.downsized_medium.url  

              let newMessageObj = {
                participantName: myScreenName,
                message: strMessage,
                messageTime: firebase.database.ServerValue.TIMESTAMP,
                gifUrl: strUrl,
                chatroomId: myThreadId,
                searchWord: strTopic
              }
            db.ref("/messages").push(newMessageObj)
        });
    };

    
    //Timers **********************************************************************

    function run() {
      clearInterval(intervalId);
      intervalId = setInterval(decrement, 1000);
    }

    //  The decrement function.
    function decrement() {

      //  Decrease number by one.
      secondsLeft--;
        if (secondsLeft < 61) {
          $("#timerInfoLine").text(secondsLeft + " seconds left to chat!")
        }
      //  Once number hits zero...
      if (secondsLeft === 0) {
        //  ...run the stop function.
        stop();
        //delete the chatroom since the other users time will be up about the same time
        db.ref("Chatrooms/" + myThreadId).remove()
        //  Alert the user that time is up.
        location.reload()
      }
    }

    function stop() {
      clearInterval(intervalId);
    }
    
  //local Events ******************************************************
  $("#btnStart").on("click", function(event) {
    console.log(myScreenName)
    if ((myScreenName === "") && (($("#nameInput").val()) !== "")) {
      myScreenName = $("#nameInput").val().trim()
      
      console.log(myScreenName)
      console.log("start button click thread id: " + myThreadId)
      if (myThreadId === "") {
        let newChatRoomObj = {
          participants: 1,
          participant1UserId: myUserId,
          participant1: myScreenName,
          participant2: "",
          participant2UserId: ""
        };
        myThreadId = db.ref().child("Chatrooms").push().key
              console.log("new room started, key is: " + myThreadId)
              var updates = {};
              updates['/Chatrooms/' + myThreadId] = newChatRoomObj;
              db.ref().update(updates)
              
            //   let newMessageObj = {
            //     participantName: "Five-Minute Chat",
            //     message: "Both participants are almost ready",
            //     messageTime: firebase.database.ServerValue.TIMESTAMP,
            //     gifUrl: "./assets/dog.gif",
            //     chatroomId: myThreadId
            //   }
            // db.ref("/messages").push(newMessageObj)
            //UNDONE alert user waiting for other person to log on
              $("#chattersInfoLine").text("Waiting for your chat buddy to log on")
            }
            else {
              db.ref("/Chatrooms/" + myThreadId).update({
                participant2: myScreenName,
                participant2UserId: myUserId
              });
            }
            
        // database.child("users").child(userId).get().then(function(snapshot) {
          //   if (snapshot.exists()) {
            //     console.log(snapshot.val());
            //   }
            //   else {
              //     console.log("No data available");
              //   }
              // }).catch(function(error) {
                //   console.error(error);
                // });
                
                
                $("#userInfoDiv").empty()
                $("#userInfoDiv").attr("style","display: none;")
                $("#chattersActionDiv").attr("class","row visible")
                $("#myHr").attr("class", "mt-0 mb-0")
                
              }
              else {
                //alert usert that the input field was left blank
              }
  });
            
  $("#btnSend").on("click", function(event) {
      //CHECK TO MAKE SURE IT IS NOT EMPTY
      if (($("#messageInput").val() !== "")) {
        let myMessage = $("#messageInput").val()
        let keyWordArray = getKeyWordArray(myMessage);
          //shuffle the array to randomize it, because need to loop through in case first chosen word is not appropriate
          keyWordArray = shuffleArray(keyWordArray)
          //FIX word API LATER, FOR TIME BEING, CHOOSE FIRST WORD OF SHUFFLED ARRAY
          // let wordToUse = chooseKeyWord(keyWordArray)
          chooseKeyWordAndSendMessage(keyWordArray,myMessage)
          //RESET MESSAGE INPUT
          $("#messageInput").val("")

          // call function which will do fetch, wait for response, then push message
          // getGifSendMessage(wordToUse,myMessage)
      }
  });
  
  //word api setup ***********************************************************
  let letsUseThisWord = ""

  function chooseKeyWordAndSendMessage(ary, msg) {
    console.log(ary)
        if ((ary.length) > 0) {
        let j = ary.length - 1
          const element = ary[j];
        console.log("value in loop number: " + j + "    "+ letsUseThisWord)
  
  
          var queryURL = "https://www.dictionaryapi.com/api/v3/references/sd4/json/" + element +"?key=ad5c6350-dd95-47d6-adbf-12ce92ca73ce";
      
      $.ajax({
          url: queryURL,
          method: "GET"
      }).then(function(response) {
          // console.log(element)
          // console.log(response.length);
          let oneOrTwo = 1
          if (response.length > 1) {oneOrTwo = 2}
        //check first one or two listings for part of speech for this word
          for (let i = 0; i < oneOrTwo; i++) {
            // console.log(response)
            // console.log("headword: " + response[1].hwi.hw)
              const posElement = response[i].fl;
              console.log(response[i])
              // console.log(posElement)
              if ((posElement === "verb") || (posElement === "noun") || (posElement === "adjective")) {
                  // console.log("this is a noun or verb or adj " + true)
                  // console.log("value of letsUseThisword... " + letsUseThisWord)
                  
  
                  if (letsUseThisWord === "") {
                    letsUseThisWord = response[0].hwi.hw
                    // console.log("letsUseThisWord was blank but should now be filled:    " + letsUseThisWord)
                  }
              }
          }
              
              if (letsUseThisWord === "") {
                console.log("this is where it should be false to keep looping the nest")
                ary.pop()
                if (ary.length > 0){
                  chooseKeyWordAndSendMessage(ary,msg)
                }
                else {
                  //if nothing was returned
                  let altArray = ["what", "you know what i mean", "dont know", "funny"]
                  let rnd = Math.floor(Math.random() * altArray.length);
                  letsUseThisWord = altArray[rnd]
                  console.log("random word chosen: " + letsUseThisWord)
                }
              }
  
              console.log("final log of word chosen: " + letsUseThisWord)

              letsUseThisWord = removePunctuation(letsUseThisWord)

              if (letsUseThisWord !== "") {
                              let placeholder = Math.floor(Math.random() * 100) + 1
              var queryURL2 = "https://api.giphy.com/v1/gifs/search?api_key=dSe8JxZC5c32HRcUeWDIT7n5R8PYUmTF&q="+ 
                letsUseThisWord +"&rating=g&limit=1&offset=" + (placeholder);
                console.log("word sent to giphy " + letsUseThisWord)
              
              $.ajax({
                  url: queryURL2,
                  method: "GET"
              }).then(function(giphyResponse) {
                    console.log(giphyResponse.data)
                    
                    let ary = giphyResponse.data
                    console.log(ary.length)
                  var strUrl
                    if ((ary.length) === 0) {strUrl = ["./assets/dog.gif"]}
                    else {
                      const giphyElement = ary[0];
                        strUrl = giphyElement.images.downsized_medium.url  
                    }
                        

                        let newMessageObj = {
                          participantName: myScreenName,
                          message: msg,
                          messageTime: firebase.database.ServerValue.TIMESTAMP,
                          gifUrl: strUrl,
                          chatroomId: myThreadId,
                          searchWord: letsUseThisWord
                        }
                      db.ref("/messages").push(newMessageObj)
                      letsUseThisWord = ""
                  });
              }



      });
    }
  }
  
  
  


function getKeyWordArray(str) {
    //clean string up and turn into an array
    str = str.toLowerCase()
    str = removePunctuation(str)
    let wordsAry = str.split(" ");
    
    //get rid of words 1 and 2 letter words
    for (let i = wordsAry.length-1; i > -1 ; i--) {
        const element = wordsAry[i];
            if (element.length < 3) {wordsAry.splice(i,1)}
    }

    if ((wordsAry.length) > 0) {
        return wordsAry
    }
    else {
        let altArray = ["what", "you know what i mean", "dont know", "funny"]
        return altArray
    }
}


// return true or false if it is an appropriate key word
function getPos(str) {
    var queryURL = "https://www.dictionaryapi.com/api/v3/references/sd4/json/" + str +"?key=ad5c6350-dd95-47d6-adbf-12ce92ca73ce";
    let isGood = false
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response.length);
        let len = response.length
        for (let i = 0; i < response.length; i++) {
            const element = response[i].fl;
            console.log(element)
            if ((element === "verb") || (element === "noun") || (element === "adjective")) {
                isGood = true
                console.log(isGood)
            }
            
        }
    });
    console.log("going to return" + isGood)
    return isGood
};

var punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

function removePunctuation(string) {
    return string
        .split('')
        .filter(function(letter) {
        return punctuation.indexOf(letter) === -1;
        })
        .join('');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}