// Generates a table from a JSON file, data.json, of scorigami scores
// Notes:
// * If duplicate scores are present, only the *last* score that appears in
//   the list is used (sort the list by date if you want this to be the earliest
//   game to have that score, either manually or using JS, though you will need
//   to be sure to have a standard date format in that case)
// * Table is only spans from the minimum to maximum score present in the data

TABLE_ID = "scorigami-table"

function getTableEntryId(rowId, columnId) {
	return TABLE_ID + "_" + rowId + "_" + columnId;
}

function getScores(games) {
	let scores = [];
	for (const value of Object.values(games)) {
		scores.push(value["NCSU Score"]);
		scores.push(value["Opp Score"]);
	}
	return scores;
}

function addRowEntry(row, text, type, id) {
	let elem = document.createElement(type);
	elem.id = id
	let textNode = document.createTextNode(text);
	elem.appendChild(textNode);
	row.appendChild(elem);
}

function createRow(table, data, header, rowId, isHeader=false) {
	let row = table.insertRow();
	for (const i in data) {
		let d = data[i];
		let h = header[i];
		let id = getTableEntryId(rowId, h);
		addRowEntry(row, d, isHeader ? "th" : "td", id);
	}
}

function createEmptyTable(table, scores) {
	let minScore = Math.min(...scores);
	let maxScore = Math.max(...scores);

	let headerData = [""]; // Starts with empty data for left score column
	for (let score = minScore; score <= maxScore; score++) {
		headerData.push(score);
	}

	// Creates headers
	createRow(table, headerData, headerData, "header", true);

	// Creates rows
	for (let score = minScore; score <= maxScore; score++) {
		let rowData = [score]; // Starts with score column
		for (let col = minScore; col <= maxScore; col++) {
			rowData.push("");
		}
		createRow(table, rowData, headerData, score);
	}
}

function setDefaultColors(table, scores) {
	let minScore = Math.min(...scores);
	let maxScore = Math.max(...scores);
	for (let row = minScore; row <= maxScore; row++) {
		for (let col = minScore; col <= maxScore; col++) {
			let bottomHalf = col < row;
			let id = getTableEntryId(row, col);
			let elem = document.getElementById(id);
			elem.classList.add(bottomHalf ? "black" : "white");
		}
	}
}

function populateTable(table, games) {
	for (const value of Object.values(games)) {
		let row = Math.min(value["NCSU Score"], value["Opp Score"]);
		let col = Math.max(value["NCSU Score"], value["Opp Score"]);
		let id = getTableEntryId(row, col);
		let elem = document.getElementById(id);
		elem.classList.remove("white");
		elem.classList.add("green");
		elem.title = value["Date"] + " - vs " + value["Opponent"];
	}
}

function loadJsonCallback(data) {
	let table = document.getElementById("scorigami-table");
	let scores = getScores(data["games"]);
	createEmptyTable(table, scores);
	setDefaultColors(table, scores);
	populateTable(table, data["games"]);
}

fetch("data.json")
	.then((response) => response.json())
	.then((json) => loadJsonCallback(json));