var person = {
	name: 'Elson',
	age: 21
}

function updatePerson (obj) {
//	obj = {
//		name: 'john'
//	}
	obj.name = 'john';
}

updatePerson (person);
console.log(person);

var grades = [15,88];

function addGrads (gradesArr) {
	debugger;
	gradesArr.push(123);
	debugger;
}

addGrads(grades);


grades[0] = 432
console.log(grades);