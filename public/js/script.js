$(document).ready(function(){

	init();

});

function init() {
	getActivities_p()
	.then(addActivities);
}

function getActivities_p() {
	return new Promise(function(resolve, reject){
		$.ajax({
			dataType:"json",
			error:reject,
			method:'GET',
			success:resolve,
			url:'/activities'
		});
	});
}

function addActivities(activityList) {
	activityList.forEach(function(act){
		$("#taskList").append('<div style="background-color:' + act.color + '"><p class="name">' + act.name + '</p><p class="desc">' + act.desc + '</p></div>');
		$(".activitySelector").append('<option>' + act.name + '</option>');
	});
	return activityList;
}

function addTask() {
	addTask_p()
	.then(d => console.log(d))
	.catch(e => console.err(e))
}

function addTask_p() {
	var task = {
		activity: $('#newActivitySelector>option:selected').text(),
		start: new Date(),
		goal: $('#newActivity>.goal').val()
	}
	return new Promise(function(resolve, reject){
		$.ajax({
			data:task,
			dataType:"json",
			error:reject,
			method:'POST',
			success:resolve,
			url:'/log'
		});
	});
}