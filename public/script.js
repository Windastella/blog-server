
// AJAX server communication
jQuery.support.cors = true;

function postAjax(url, data, successcallback){
	$.ajax({
		async:true,
		success:successcallback,
		url:url,
		crossDomain: true,
		data:JSON.stringify(data),
		dataType:"json",
		method:"POST",
		processData:true,
		contentType: "application/json; charset=utf-8",
		accepts:"json"
	});
}

var cb = function(data, status, xhr){
	console.log(data);
	$('#return').val(JSON.stringify(data));
}
	
$(document).ready(function(){
	
	$('form').on('submit',function(e){
		console.log($('#json').val());
		postAjax('http://localhost/getpost', $('#json').val(), cb);
		return false;
	});
	
});