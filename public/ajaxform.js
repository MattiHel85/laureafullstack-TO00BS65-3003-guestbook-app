window.onload = () =>{
      
    var sendButton = document.getElementById("submitAjax");
    sendButton.addEventListener("click", function(){
      
      var username = document.getElementById("username").value;
      var country = document.getElementById("country").value;
      var message = document.getElementById("message").value;
      
      console.log(username);

      // We create AJAX object which is waiting response
      var xmlhttp = new XMLHttpRequest();

      // Send the AJAX request, type is POST
      xmlhttp.open("POST","/ajaxmessage", true);
      // We create AJAX parameters and the data fields
      xmlhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xmlhttp.send("username: " + username + " country: " + country + " message: " + message);
      
    });
  };