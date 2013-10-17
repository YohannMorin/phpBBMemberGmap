var user_position;
var map_user_id = 'null';
var mapCenter = new google.maps.LatLng(46.63, 5.22);
var users_map;
var users_position = [];
var activeInfo;
$('#carto-menu').hide();
$(document).ready(function (){
	if (forum_userid != 'null') {
		$.get("./users_map.php",
			null,
			function(data){
				if(data != "KO"){
					users_map = $.parseJSON(data);
					showMap(users_map);
					if (locate_userid != '') {
					 if (users_position[locate_userid]) {
       				goTo(users_position[locate_userid], 8);
    				  openInfo(users_position[locate_userid].userMarker);
           }
          }
				}
			});
	}
		/**
	*	Fonction de connexion
	*/
/**
	*	Fonction de carto
	*/
		$("#boutonCenter").click(function(){
				goTo(user_position, 9);
		});

		$("#boutonCenterGeo").click(function(){
				codeAddress();
		});
		
		$("#boutonRaz").click(function(){
				goTo(mapCenter, 6);
		});

		$("#boutonSelectMember").click(function(){
		    var select_value = $('#memberSel option:selected').val();
		    if (users_position[select_value]) {
  				goTo(users_position[select_value], 8);
  				openInfo(users_position[select_value].userMarker);
        }
		});

		$("#boutonLocate").click(function(){
				navigator.geolocation.getCurrentPosition(
					function(position){
						user_position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
						map.panTo(user_position);
						$.get("./update_loc.php",{ "userid":map_user_id ,"lat":position.coords.latitude,"long":position.coords.longitude});
						location.reload();
					}, 
					function(err) {
						if(err.code == 1) {
							alert("Error: Access is denied!");
						}else if( err.code == 2) {
							alert("Error: Position is unavailable!");
						} else {alert("Error: Timeout");}
					},
					{timeout:3000}    
				);
		});

		
});

function openInfo(userMarker) {
  if (activeInfo) {
    activeInfo.close();
  }
  userMarker.info.open(map, userMarker);
  activeInfo = userMarker.info;
}

function codeAddress() {
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      map.setZoom(9);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function goTo(position, zoom) {
	map.panTo(position);
  map.setZoom(zoom);
}

function showMap(users) {
	map = new google.maps.Map(document.getElementById("map-canvas"), {
    zoom: 6,
		center: mapCenter,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	$.each(users,function(index,element){
	 if (element) {
			var adresse = element.user_from;
			var lat_attendee = element.pf_latitude;
			var long_attendee = element.pf_longitude;
			var id = element.user_id;
			var user_icon = template_path+'/imageset/motorcycle.png';
			if (forum_userid==id) {
				if (lat_attendee === '' || long_attendee === '') {
										lat_attendee = 46.98;
										long_attendee  = 3.15;
										$.get("./update_loc.php",{ "userid":id ,"lat":lat_attendee,"long":long_attendee});
				} 
				 user_position = new google.maps.LatLng(lat_attendee, long_attendee);
				 map_user_id = element.userid; 
	 			 user_icon = template_path+'/imageset/my_motorcycle.png';
			}
			var member_position = new google.maps.LatLng(lat_attendee, long_attendee);
		  $("#memberSel").append('<option value='+id+'>'+element.username+'</option>');
				var marker = new google.maps.Marker({
					map: map, 
					position: member_position,
					icon: user_icon,
					title: element.username,
					draggable: (forum_userid==id)}); 
			var msgInfo = '<div id="pagecontent"><table class="tablebg"><tbody><tr><td>';
      if (element.user_avatar != '') {
        if (element.user_avatar.indexOf("/") > 0) {
          msgInfo = msgInfo+'<img src="./images/avatars/gallery/'+element.user_avatar+'"/>';
        } else {                     
          msgInfo = msgInfo+'<img src="./download/file.php?avatar='+element.user_avatar+'"/>';
        }
      }
      msgInfo = msgInfo+'</td><td><b class="gen" style="color: #'+element.user_colour+'">'+element.username+'</b><br/>'+element.user_from+'<br/><a href="memberlist.php?mode=viewprofile&u='+id+'">Profil complet</a></td></tr></tbody></table></div>';
			marker.info = new google.maps.InfoWindow({
        content: msgInfo
      });
      google.maps.event.addListener(marker, 'click', function() {
        map.setZoom(9);
        map.setCenter(marker.getPosition());
        if (activeInfo) {
          activeInfo.close();
        }
        marker.info.open(map, marker);
        activeInfo = marker.info;
      });
      member_position.userMarker = marker;
      users_position[id] = member_position;
			if (forum_userid==id) {
				google.maps.event.addListener(marker, 'dragend', function() {
						var lat = marker.getPosition().lat();
						var lng  = marker.getPosition().lng();
						user_position = new google.maps.LatLng(lat, lng);
						$.get("./update_loc.php",{ "userid":id ,"lat":lat,"long":lng});
				});
				map.panTo(user_position);
			}
   }
});
}