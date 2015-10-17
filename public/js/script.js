$(document).ready(function(){

	getActivities()

});

function getActivities(){
	$.get('/activities', function(data){
		console.log(data);
		data.forEach(function(act){
			$("body").append('<div style="background-color:' + act.color + '"><p class="name">' + act.name + '</p><p class="desc">' + act.desc + '</p></div>');
		});
	});
}