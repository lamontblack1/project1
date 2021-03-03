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
    let otherParticipantName = ""

    
    db.ref("/Chatrooms").on("child_added", function(snap) {
      if (snap.val()) {
        console.log("thread " + myThreadId)
        if (myThreadId === "") {
          console.log(snap.key)
          let intParticipants = parseInt(snap.val().participants);
          console.log("part: " + intParticipants)
          //If this "room" has only one participant then make this my room, ergo my thread id
          if (intParticipants === 1) {
            otherParticipantName = snap.val().participant1
            myThreadId = snap.key
            let newChatRoomObj = {
              participants: 2,
              participant1: otherParticipantName,
              participant2: ""
            }
            let displayOtherParticipant = "Your Five-Minute Chat buddy is " + otherParticipantName
            console.log(displayOtherParticipant)
            db.ref("/Chatrooms/"+ snap.key).set(newChatRoomObj)
            let newMessageObj = {
              participantName: "Five-Minute Chat",
              message: "Both participants are almost ready",
              messageTime: firebase.database.ServerValue.TIMESTAMP
            }
            db.ref("/Chatrooms/"+ snap.key + "/messages").push(newMessageObj)
            // db.ref("/Chatrooms/" + myThreadId).update({participants: 2})
          }
        }
      }
    });

    //my room (mythreadid) messages
    db.ref("/Chatrooms/"+ snap.key + "/messages").on("child_added", function(snap) {

    })

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
      console.log("connections: " + intConnections)
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


  //wordio api setup ***********************************************************



  //Timers **********************************************************************

  //local Events ******************************************************
  $("#btnStart").on("click", function(event) {
    if (myScreenName !== "") {
      myScreenName = $("#nameInput").val()

      if (myThreadId === "") {
        let newChatRoomObj = {
          participants: 1,
          participant1: myScreenName,
          participant2: ""
        }
        let con = db.ref("/Chatrooms").push(newChatRoomObj)
        myThreadId = con.key
        console.log("new room started, key is: " + myThreadId)
        //UNDONE alert user waiting for other person to log on
      }
      else {
        db.ref("/Chatrooms/" + myThreadId).update({participant2: myScreenName})
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


      $("#nameStartDiv").empty()

    }
    else {
      //alert usert that the input field was left blank
    }
  })

