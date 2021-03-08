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
    
        // db.ref("/Chatrooms/" + myThreadId).on("value", function(snap) {
        //   console.log(myThreadId)
        //   console.log("this chatroom value event: " + snap.key)
        //   //If both logged on and one instance does not have the others screen name provide that and start
         
        // });

    db.ref("/Chatrooms").on("child_changed", function(snap,snapKey) {
      console.log(snap.val())
      if (((snap.val().participant1UserId) == myUserId) || ((snap.val().participant2UserId) == myUserId)) {
            if (((snap.val().participant1) !== "") && ((snap.val().participant2) !=="")) {
              console.log("chatroom child changed event")
              console.log(snap.val().participant1)
              console.log(snap.val().participant2)

                if (myScreenName === (snap.val().participant1)) {
                  otherParticipantName = snap.val().participant2
                }
                else if (myScreenName === (snap.val().participant2)) {
                  otherParticipantName = snap.val().participant1
                }
                let displayOtherParticipantTxt = "Your Five-Minute Chat buddy is " + otherParticipantName
                // console.log(displayOtherParticipantTxt)
                $("#chattersInfoLine").text(displayOtherParticipantTxt)

                  let newMessageObj = {
                    participantName: "Five-Minute Chat",
                    message: "Start chatting!",
                    messageTime: firebase.database.ServerValue.TIMESTAMP,
                    gifUrl: "./assets/dog.gif",
                    chatroomId: myUserId
                  }
              db.ref("/messages").push(newMessageObj)
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
                chatroomId: myUserId
              }
            db.ref("/messages").push(newMessageObj)
            // db.ref("/Chatrooms/" + myThreadId).update({participants: 2})

          }
          
        }
      }

    });

    //my room (mythreadid) messages
    db.ref("/messages").on("child_added", function(snap) {
      if (myThreadId !== "") {
        let dbChatroomId = snap.val().chatroomId
          // only use it if it is a message from our chatroom, since all messages are together
          if (myThreadId === dbChatroomId) {
            let strSenderName = snap.val().participantName
            let strMessage = snap.val().message
            let strUrl = snap.val().gifUrl
            let dateVal = snapshot.val().messageTime
            let msgTimeStamp = moment(dateVal).format("hh:mma")

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
                                        "<p class='card-text'>" + strMessage + "</p>" +
                                        "</div>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>"
              )
            }
            else {}

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

  function getGif(strTopic, placeholder) {
    
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=dSe8JxZC5c32HRcUeWDIT7n5R8PYUmTF&q="+ 
      strTopic +"&rating=g&limit=1&offset=" + (placeholder);
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
          console.log(response)
          //   console.log(response.data.length);
          let ary = response.data
        
          for (let i = 0; i < ary.length; i++) {
              const element = ary[i];
                  
                  let gifUrl = element.images.downsized_medium.url     // add gif url as id to animate it later
                  // cardDiv.html("<img id='" + gifUrl + "' src='" + imageUrl + "' class='card-img-top'>")
                  // let cardBodyDiv = $("<div class='card-body p-0'>")
                  // let cardText = $("<p class='text-center my-1'><b>" + element.title + "</b></p><p class='text-center my-0'>Rating: " + element.rating + "</p>")
                  // cardBodyDiv.append(cardText)
                  // let likeButton = $("<button class='btn btn-info btn-sm like my-1'><span class='fa fa-heart' aria-hidden='true'></span></button>")
                  // likeButton.attr("data-title", element.title)
                  // likeButton.attr("data-url",element.images.downsized_medium.url)
                  // cardBodyDiv.append(likeButton)
                  // // cardDiv.append(imgHolder)
                  // cardDiv.append(cardBodyDiv)
                  // let gifDiv = $("#" + columnId)
                  // gifDiv.append(cardDiv)
          }
        });
    };


  //word api setup ***********************************************************



  //Timers **********************************************************************

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

              let newMessageObj = {
                participantName: "Five-Minute Chat",
                message: "Both participants are almost ready",
                messageTime: firebase.database.ServerValue.TIMESTAMP,
                gifUrl: "./assets/dog.gif",
                chatroomId: myUserId
              }
            db.ref("/messages").push(newMessageObj)
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

        //START TIMER

      }
      else {
        //alert usert that the input field was left blank
      }
  });

