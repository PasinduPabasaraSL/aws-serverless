// Add your API endpoint here
var API_ENDPOINT = "https://fe5t4bkob0.execute-api.ap-southeast-1.amazonaws.com/prod";

document.getElementById("savestudent").onclick = function(){
    var inputData = {
        "studentid": $('#studentid').val(),
        "name": $('#name').val(),
        "class": $('#class').val(),
        "age": $('#age').val()
    };
    $.ajax({
        url: API_ENDPOINT,
        type: 'POST',
        data:  JSON.stringify(inputData),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            document.getElementById("studentSaved").innerHTML = "Student Data Saved!";
            alert("Student Data Saved!");
            $('#studentid').val('');
            $('#name').val('');
            $('#class').val('');
            $('#age').val('');
        },
        error: function (error) {
            console.log(error);
        }
    });
}

document.getElementById("getstudents").onclick = function(){  
    $.ajax({
        url: API_ENDPOINT,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            console.log("Raw API Response:", response);

            var students;
            if (response.body) {
                try {
                    students = JSON.parse(response.body);
                } catch (err) {
                    console.error("Error parsing body JSON:", err);
                    students = [];
                }
            } else if (response.students) {
                students = response.students;
            } else if (Array.isArray(response)) {
                students = response;
            } else {
                students = [];
            }

            students.sort((a, b) => Number(a.studentid) - Number(b.studentid));

            $('#studentTable tr').slice(1).remove();
            jQuery.each(students, function(i, data) {          
                $("#studentTable").append("<tr> \
                    <td>" + data['studentid'] + "</td> \
                    <td>" + data['name'] + "</td> \
                    <td>" + data['class'] + "</td> \
                    <td>" + data['age'] + "</td> \
                </tr>");
            });
        },
        error: function (error) {
            console.log("Error retrieving students:", error);
        }
    });
};
