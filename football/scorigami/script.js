let input = document.getElementById('file-input')
let table = document.getElementById('csv-table')

input.addEventListener('change',(event) => {
	const file = event.target.files[0]
	
	var el =  Papa.parse(file,{
		header: true,
		complete:(results) => {
			console.log(results)
			
			table.innerHTML = ""
			
			const headers = results.meta.fields
			const thead = document.createElement('thead')
			const tr = document.createElement('tr')
			headers.forEach((header) => {
				const th = document.createElement('th')
				th.textContent = header
				tr.appendChild(th)
			})
			thead.appendChild(tr)
			table.appendChild(thead)
			
			const tbody = document.createElement('tbody')
			results.data.forEach((row) => {
				const tr = document.createElement('tr')
				headers.forEach((header) => {
						const td = document.createElement('td')
						td.textContent = row[header]
						tr.appendChild(td)
				})
				tbody.appendChild(tr)
			})
			table.appendChild(tbody)
		}
	})
})

