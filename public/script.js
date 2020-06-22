console.log("Loading shorter client...");

let table = document.getElementById("table");

function deleteEntry(id) {
    $.ajax({
        url: "/api/delete",
        method: "GET",
        data: {id},
        success: (data) => {
            
            $("#table > tbody").html("")
            for (const row of data) {
                $("#table > tbody:last-child").append(`<tr>
                <th><a href="/${row.title}">${row.title}</a></th>
                <th>${row.url}</th>
                <th><a onclick="return deleteEntry('${row._id}')" href="#">Delete</a></th></tr>`)
            }
            
            
        }
    })
}

function submit() {    
    $.ajax({
        url: "/api/create",
        method: "GET",
        data: {url: document.querySelector("#url").value, title: document.querySelector("#title").value},
        success: (data) => {
            
            
            $("#table > tbody:last-child").append(`<tr>
            <th><a href="/${data.entry.title}">${data.entry.title}</a></th>
            <th>${data.entry.url}</th>
            <th><a onclick="return deleteEntry('${data.entry._id}')" href="#">Delete</a></th></tr>`)
            
            
        }
    })
}