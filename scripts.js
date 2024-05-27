 var pages_loaded = 0;
  var streams_loaded = 0;
  var streams_loaded_post_filter = 0;
  var maximum_pages = 25;
  var maximum_streams_per_page = 20;
  
  const urlParams = new URLSearchParams(location.hash);
  var table = document.getElementById("streams");
  
  var access_token = urlParams.get('#access_token');
  
  //table.innerHTML = "";
  document.getElementById("access_token").innerHTML = "access_token: " + access_token;
  document.getElementById("maximum_pages").innerHTML = "maximum_pages: " + maximum_pages;
  document.getElementById("maximum_streams_per_page").innerHTML = "maximum_streams_per_page: " + maximum_streams_per_page;
  
  function getStarWarsPlanets(progress, cursor, game_id, access_token, planets = []) {
   //default
    var url = `https://api.twitch.tv/helix/streams?first=${maximum_streams_per_page}&game_id=${game_id}&type=live`;
    
    if (game_id == -1)
    {
      
         if (cursor){
        url = `https://api.twitch.tv/helix/streams?first=${maximum_streams_per_page}&type=live&after=${cursor}`;
          }
          else
         {
          url = `https://api.twitch.tv/helix/streams?first=${maximum_streams_per_page}&type=live`
         }
    }
    else
    {
      if (cursor){
url = `https://api.twitch.tv/helix/streams?first=${maximum_streams_per_page}&game_id=${game_id}&type=live&after=${cursor}`;
}
    }


    
  return new Promise((resolve, reject) => fetch(url, {
method: "GET",
headers: {"Content-type": "application/x-www-form-urlencoded;charset=UTF-8;", "Authorization": "Bearer " + access_token, "Client-Id": "9w7l1oen3pmdj1ezkloj0irud7me3p"}
//headers: {"Content-type": "application/x-www-form-urlencoded;charset=UTF-8;", "Authorization": "Bearer eet4p9xb1qy0n2vxwtzm5x1q6p8edi", "Client-Id": "9w7l1oen3pmdj1ezkloj0irud7me3p"}
})
    .then(response => {
        if (response.status !== 200)  {
          throw `${response.status}: ${response.statusText}`;
        }
        response.json().then(data => {
          streams_loaded += data.data.length;
          planets = planets.concat(data);
          pages_loaded = planets.length;

          if(data.pagination.cursor && pages_loaded < maximum_pages) {
            progress && progress(planets);
            getStarWarsPlanets(progress, data.pagination.cursor, game_id, access_token, planets).then(resolve).catch(reject)
          } else {
            resolve(planets);
          }
        }).catch(reject);
    }).catch(reject));
}
function set_game_id(){
  var e = document.getElementById("games");
var game_id = e.value;
document.getElementById("game_id").innerHTML = "game_id: " + game_id;
}
function progressCallback(planets) {
  // render progress
  console.log(`${pages_loaded} pages loaded; ${streams_loaded} streams loaded;`);
}




  


function search(){
  var table = document.getElementById("streams");
  table.innerHTML = "<tr><th>user_name</th><th>game_name</th><th>tags</th><th>viewer_count</th><th>thumbnail_url</th><th>Thumbnail</th></tr>";

pages_loaded = 0;
streams_loaded = 0;
  streams_loaded_post_filter = 0;
var e = document.getElementById("games");
var game_id = e.value;
document.getElementById("pagination").innerHTML = "";
var access_token = document.getElementById("access_token").innerHTML.replace("access_token: ", "");
getStarWarsPlanets(progressCallback, null, game_id, access_token)
  .then(planets => {
    // all planets have been loaded
var popped = false;
    //remove last page if it had no results
    if (planets[planets.length - 1].data.length == 0){
planets.pop();
popped=true;
    }
    addToTable(planets);
    if(popped)
    {
      var ul = document.getElementById("pagination");
    var li = document.createElement("li");
li.appendChild(document.createTextNode("null"));
ul.appendChild(li);

    }
    console.log(`${pages_loaded} pages loaded; ${streams_loaded} streams loaded;`);
     document.getElementById("pages_loaded").innerHTML = `pages_loaded: ${pages_loaded}`;
  document.getElementById("streams_loaded").innerHTML = "streams_loaded: " + streams_loaded;
    document.getElementById("streams_loaded_post_filter").innerHTML = "streams_loaded_post_filter: " + streams_loaded_post_filter;
  })
  .catch(console.error);

 
}

function addToTable(streams)
  {
var tags = document.getElementById("tags").value.split(",");;
for (page of streams)
  {
    if (page.data.length > 0){
var ul = document.getElementById("pagination");
    var li = document.createElement("li");
li.appendChild(document.createTextNode(page.pagination.cursor));
ul.appendChild(li);

    for (const product of page.data) {
  var addStream = true;


for(tag of tags)
{
if(product.tags === null || !product.tags.includes(tag) && tag != "")
{
addStream = false;
}
}
  
if (addStream)
{
  streams_loaded_post_filter += 1;
var row = table.insertRow(-1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2); //tags
        var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
                        var cell6 = row.insertCell(5);
      cell1.innerHTML = product.user_name;
      cell2.innerHTML = product.game_name;
            cell3.innerHTML = product.tags;
          cell4.innerHTML = product.viewer_count;
    cell5.innerHTML = "<a href=" + product.thumbnail_url.replace("{width}","512").replace("{height}","512") + ">Thumbnail</a>";
    cell5.className = "myDIV";
        cell6.innerHTML = "<img width=100 height=100 src=" + product.thumbnail_url.replace("{width}","512").replace("{height}","512") + ">";
}
      
    }
  }

  }
  }

