const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ77Ih8-pz10Wty_e9FmiwJ95Zafv_025G_ZSfiQ-0IFjP3kAZ4rZHVEiY4DU49CNUiZMlyJSZ9O7rq/pub?gid=1191433987&single=true&output=csv"

let results;

const csvData = Papa.parse, (url, {
	dyanmicTypig: true,
	download: true,
	header: true,
	comments: "*=",
	complete: function(data) {
        result = data.data
	}
});

