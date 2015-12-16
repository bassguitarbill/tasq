function getRandomColor() {
	var hue = Math.floor(Math.random()*360);
	var sat = Math.floor(Math.random()*80) + 20;
	var ltn = Math.floor(Math.random()*20) + 60;
	return "hsl(" + hue + ", " + sat + "%, " + ltn + "%)";
}