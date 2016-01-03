$(document).ready(function(){

	init();

});

function init() {
	getActivities_p()
	.then(populateActivities);
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

function populateActivities(activityList) {
	$("#taskList").empty();
	activityList.forEach(function(act){
		$("#taskList").append('<div style="background-color:' + act.color + '"><p class="name">' + act.name + '</p><p class="desc">' + act.desc + '</p><p onclick="deleteActivity(\'' + act.name + '\')">Delete</p></div>');
		$(".activitySelector").append('<option>' + act.name + '</option>');
	});
	$("#taskList").append('<div style="border: solid black 3px"><p class="name" onclick="createNewActivity()">+</p><p class="desc">Add an activity...</p></div>');
	return activityList;
}

function createNewActivity() {
	var activityName = prompt("Enter the name of your activity");
	if(!activityName)
		return;
	var description = prompt("Enter your activity's description");
	var time = prompt("Enter the number of minutes per week");
	if(isNaN(time))
		return;
	addActivity_p({
		name: activityName,
		desc: description,
		color: getRandomColor(),
		schedule:{
			duration: time
		}
	})
	.then(getActivities_p)
	.then(populateActivities)
}

function addActivity_p(activity){
	return new Promise(function(resolve, reject){
		$.ajax({
			data:activity,
			dataType:"json",
			error:reject,
			method:'POST',
			success:resolve,
			url:'/addActivity'
		});
	});	
}

function deleteActivity(activityName) {
	var query = {name: activityName};
	deleteActivity_p(query)
	.then(getActivities_p)
	.then(populateActivities)
}

function deleteActivity_p(query){
	return new Promise(function(resolve, reject){
		$.ajax({
			data:query,
			dataType:"json",
			error:reject,
			method:'POST',
			success:resolve,
			url:'/deleteActivity'
		});
	});	
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

function getActiveTask_p() {
	return new Promise(function(resolve, reject){
		$.ajax({
			dataType:"json",
			error:reject,
			method:'GET',
			success:resolve,
			url:'/active-task'
		});
	});
}

function getActiveTask() {
	getActiveTask_p()
	.then(t => t[0])
	.then(t => console.log(t))
}

function endActiveTask_p() {
	return new Promise(function(resolve, reject){
		$.ajax({
			dataType:"json",
			error:reject,
			method:'POST',
			success:resolve,
			url:'/end-task'
		});
	});
}

function endActiveTask() {
	endActiveTask_p()
	.then(d => console.log(d));
}

function getSurroundingTasks_p(date) {
	return new Promise(function(resolve, reject){
		$.ajax({
			data:{date:date},
			dataType:"json",
			error:reject,
			method:'POST',
			success:resolve,
			url:'/alg1'
		});
	});
}

function getSurroundingTasks(date) {
	getSurroundingTasks_p(date)
	.then(d => console.log(d));
}