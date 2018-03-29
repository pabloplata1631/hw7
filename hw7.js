$(function(){

    // Initialize Firebase
      var config = {
          apiKey: "AIzaSyDXLNdTzO7HXLy17LsC-9x45Er_hyh80S8",
          authDomain: "train-schedule-e4574.firebaseapp.com",
          databaseURL: "https://train-schedule-e4574.firebaseio.com",
          projectId: "train-schedule-e4574",
          storageBucket: "train-schedule-e4574.appspot.com",
          messagingSenderId: "1064809053893"
      };
  
        firebase.initializeApp(config);
  //VARSSSS/////////
        var database = firebase.database();
  
        var nextArrival = "";
        var difference = "-";


  
      database.ref().on('child_added',function(snapshot){
          var tr = $('<tr>')
          $('#schedule').append(tr);///Remember add snapshot////
          tr.append('<td id = "train">' + snapshot.val().trainName +'</td>');
          tr.append('<td id = "destination">' + snapshot.val().destination +'</td>');
          tr.append('<td id = "startTime">' + snapshot.val().startTime +'</td>');
          tr.append('<td id = "frequency">' + snapshot.val().frequency +'</td>');
          // tr.append('<td>' + snapshot.val().trainArrivals[0] +'</td>');
  
          var nextTrain = snapshot.val().trainArrivals;
  
          console.log(nextTrain);
  
          for(var i = 0; i < nextTrain.length; i++) {
              if(snapshot.val().trainArrivals[i] > (searchTime + 1)) {
                  if(nextArrival = "") {
                      nextArrival = "-";
                  } else {
                      nextArrival = snapshot.val().trainArrivals[i];
                      difference = nextArrival.diff(searchTime, 'minutes');
                  }
                  console.log('Next Arrival', nextArrival)
                  
                  break;		
              } 
          }
          tr.append('<td id = "nextArrival">' + nextArrival +'</td>');
          tr.append('<td id = "difference">' + difference +'</td>');
          
  
          function waitTime(){
              console.log('ST: ', searchTime);
              console.log('NT: ',nextArrival);
  
              if(nextArrival == "") {
                  difference == "-";
              } else {
                  // difference = moment(nextArrival, 'HH:mm').fromNow();
                  difference = nextArrival.diff(searchTime, 'minutes');
                  console.log(difference);
                  }	
              }
  
              waitTime();
              nextArrival = ""
          
          
          
          
                  
      });
  
  
        var trainName = "";
        var destination = "";
        var startTime;
        var trainTime;
        var trips = 0;
        var	frequency = 0;
      var trainArrivals = []
      
      $('#newTrain').click(function(){
          trainName = $('#trainName-input').val().trim();
              console.log('Train Name: ', trainName);
              $('#trainName-input').val("");
          destination = $('#destination-input').val().trim();
              console.log('Destination: ', destination);
              $('#destination-input').val("");
          startTime = momemt($('#startTime-input').val(), "HH:mm").subtract(10,"years").format("x");
              console.log('Start Time: ', startTime);
              $('#startTime-input').val("");
          trips = $('#trips-input').val();
              console.log('Trips: ', trips);
              $('#trips-input').val("");
          frequency = $('#frequency-input').val();
              console.log('Frequency: ', frequency);
              $('#frequency-input').val("");
  
  
          function trainTimes() {
              var trainAr = moment(startTime, "HH:mm", true).creationData();
              var trainArrival = trainAr.input;
              trainArrivals.push(trainArrival);
  
              
              for(var i = 2; i <= trips; i++) {
                  var nextTrainTime = trainArrivals[trainArrivals.length-1];
                  var nextTime = moment(nextTrainTime, 'HH:mm').add(frequency, 'minutes').format('HH:mm');
                  trainArrivals.push(nextTime);
                  console.log('Train Times: ', trainArrivals);
              }
  
          }
  
          trainTimes();
  
  
          database.ref().push({
              trainName: trainName,
              destination: destination,
              startTime: startTime,
              trips: trips,
              frequency: frequency,
              trainArrivals: trainArrivals
          })
  
          trainArrivals = [];
      
      })
  
      var time;
      var searchTime;
  
      function currentTime() {
          var sec = 1;	
          time = moment().format('HH:mm:ss');
          searchTime = moment().format('HH:mm');
              $('#currentTime').html(time);
  
              t = setTimeout(function() {
                  currentTime();
              }, sec * 1000);	
      }
      currentTime(); 
  
  
  // Click '+' to Open Add Train and "x" to Close window
  
      $('#add').click(function(){
          if($('#newTrainSchedule').attr('data-status') === 'hide') {
              $('#newTrainSchedule').attr('data-status', 'show').css({'visibility': 'visible', 'height': '480px'});
              $('#symbol').removeClass('fa fa-plus').addClass('fa fa-close');
          } else {
              $('#newTrainSchedule').attr('data-status', 'hide').css({'visibility': 'hidden', 'height': '0px'});
              $('#symbol').removeClass('fa fa-close').addClass('fa fa-plus');
          }
      });
  
  });
  