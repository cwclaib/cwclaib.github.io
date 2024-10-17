// Generates a table from a JSON file, data.json, of scorigami scores
// Notes:
// * If duplicate scores are present, only the *last* score that appears in
//   the list is used (sort the list by date if you want this to be the earliest
//   game to have that score, either manually or using JS, though you will need
//   to be sure to have a standard date format in that case)
// * Table is only spans from the minimum to maximum score present in the data

TABLE_ID = "scorigami-table"

function isInt(value) {
	return !isNaN(value)
		&& parseInt(Number(value)) == value
		&& !isNaN(parseInt(value, 10));
}

function getTableEntryId(rowId, columnId) {
	return TABLE_ID + "_" + rowId + "_" + columnId;
}

function getScores(games) {
	let scores = [];
	for (const value of Object.values(games)) {
		let s1 = value["NCSU Score"];
		let s2 = value["Opp Score"];
		if (isInt(s1) && isInt(s2)) {
			scores.push(s1);
			scores.push(s2);
		}
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
	let i = 0; 
	let minScore = Math.min(...scores);
	let maxScore = Math.max(...scores);
	let impossibleScore = [ [0,1], [1,2], [1,3], [1,4], [1,5], [1,7] ];
	for (let row = minScore; row <= maxScore; row++) {
		for (let col = minScore; col <= maxScore; col++) {
			let bottomHalf = col < row;
			let id = getTableEntryId(row, col);
			let elem = document.getElementById(id);
			elem.classList.add(bottomHalf ? "black" : "white");
			if ( i < 6 ) {
				console.log("hello");
				if ( row === impossibleScore[i][0]) {
					console.log("hey");
					console.log(row)
					console.log(col)
					if ( col === impossibleScore[i][1] ) {
						console.log("bazinga");
						console.log(i)
						elem.classList.add("black");
						i += 1;
						console.log("done");
						console.log(i);
					}
				}					
			}
			else if (row === col) {
				elem.classList.add("orange");
			}
		}
	}
}

function populateTable(table, games) {
	for (const value of Object.values(games)) {
		// Skips over non-numbers
		if (!isInt(value["NCSU Score"]) || !isInt(value["Opp Score"])) {
			continue;
		}

		let row = Math.min(value["NCSU Score"], value["Opp Score"]);
		let col = Math.max(value["NCSU Score"], value["Opp Score"]);
		let id = getTableEntryId(row, col);
		let elem = document.getElementById(id);
		elem.classList.remove("white");
		elem.classList.remove("orange");
		elem.classList.add("green");
		elem.title = col + "-" + row + ": " + value["Date"] + " - vs " + value["Opponent"] + " (" + value["Result"] + ")";
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
