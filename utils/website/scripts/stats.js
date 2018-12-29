$(document).ready(function() {
  setInterval(() => {
    var jsonurl = "/overview"
    $.ajax({
        url: jsonurl,
        type:"get",
        success: function(data){
          document.getElementById("servers").innerHTML = data.serverCount;
          document.getElementById("users").innerHTML = data.userCount;
          document.getElementById("avg_commands").innerHTML = data.avgCommands;
          document.getElementById("uptime").innerHTML = data.uptime;
          document.getElementById("ram_usage").innerHTML = data.memoryUsage;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){}
     });
   }, 1000);
});
