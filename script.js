let map_el = document.getElementById('harta');
let locatii_el = document.getElementById('locatii');

let search_el = document.getElementById('search');
let add_el = document.getElementById('add');
let center_el = document.getElementById('center');

// Generare Harta (locatie default: Madrid)
let map_options_obj = {
	center: {lat: 40.416775, lng: -3.703790},
	zoom: 12,
};	
let map_obj = new google.maps.Map(map_el, map_options_obj);

// obiect care ne ajuta in stabilirea marginilor -- vom chema metoda extend pt fiecare marker adaugat
let bounds_obj = new google.maps.LatLngBounds(); 


// -------- start onclick ---------------------
center_el.onclick = function() {
	geocoder(search_el.value, false)
}


add_el.onclick =  function(ev) {
	geocoder(search_el.value, true)
}

//------------ end onclick -------------------

// Functia geocoder apelata cu param opt=false urmeaza logica de centrare; opt=true logica de adaugare marker + recentrare
function geocoder(address, opt=true) {
	let geocoder_obj = new google.maps.Geocoder();
	geocoder_obj.geocode({address: address}, function(results, status) {
		if (!results || status == 'ZERO_RESULTS') {
			alert('Adresa nu a putut fi gasita!')
		} else {
			let new_lat_val = results[0].geometry.location.lat();
			let new_lng_val = results[0].geometry.location.lng();
			let descr = results[0].formatted_address;
			if (!opt) {
				map_obj.setCenter({lat: new_lat_val, lng: new_lng_val});
				map_obj.setZoom(14);
				return;
			}
			let marker_options_obj = {
				position: {lat: new_lat_val, lng: new_lng_val},
				map: map_obj
			}
			let marker_obj = new google.maps.Marker(marker_options_obj);
			// Infowindow
			let info_opt_obj = { content: `<h3>${descr}</h3>` };
			let info_obj = new google.maps.InfoWindow(info_opt_obj);
			
			marker_obj.addListener('click', function() {
				info_obj.open(map_obj, marker_obj)
			})			
			// Afisare in partea dreapta
			display(descr, new_lat_val, new_lng_val);
			
			// Extindem marginile
			bounds_obj.extend({lat: new_lat_val, lng: new_lng_val});
			map_obj.fitBounds(bounds_obj); // re-centrarea hartii pt a cuprinde toti markerii
			map_obj.setZoom(map_obj.getZoom()-1); // pt a nu avea nici un marker la margine		
		}
	})		
}
	
function display(descr, lat, lng) {
	
	let div_el = document.createElement('div');	
	div_el.classList.add('results');
	
	let ul_el = document.createElement('ul');
	let li_descr_el = document.createElement('li');
	li_descr_el.innerText = descr;
	let li_lat_el = document.createElement('li');
	li_lat_el.innerText = lat;
	let li_lng_el = document.createElement('li');
	li_lng_el.innerText = lng;
	ul_el.appendChild(li_descr_el);
	ul_el.appendChild(li_lat_el);
	ul_el.appendChild(li_lng_el);
	div_el.appendChild(ul_el);
		
	locatii_el.appendChild(div_el);
}
	
	


	