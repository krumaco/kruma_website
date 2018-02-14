const APIkey = '544b40c1e7e083343eb0dd6cd5519aca';
var favs = ['cad', 'usd', 'eur', 'gbp', 'mxn'];

$(document).ready(function(){
	loadData();
	$('.more-curr-btn').click(function(){
		moreCurr(event);
	});
	convertCurr();
	formatValue($('#fromcount'));
});

function loadData(){
	$.getJSON('js/currlist.json', function(result){
		createDropdown(result);
	});
}

$('#fromcount').on('keyup',function(){
	convertCurr();
	formatValue(this);	
});

function createDropdown(data){

	var fromDD = document.getElementById('currchangefrom');
	var toDD = document.getElementById('currchangeto');

	 for( var i = 0; i< data.length; i++){
	 	var li = document.createElement('li');
	 	if(favs.includes(data[i].code.toLowerCase())){
	 		li.classList.add('fav');
	 	}
	 	var newimage = new Image();   
		newimage.src = 'http://www.countryflags.io/' + data[i].code.slice(0, -1).toLowerCase() + '/flat/64.png';
		var code = document.createElement('span');
		code.innerText = data[i].code.toUpperCase();
		var fulldescr = document.createElement('span');
		fulldescr.classList.add('fulldescr');
		fulldescr.innerText = data[i].name;
		li.appendChild(newimage);
		li.appendChild(code);		
		li.appendChild(fulldescr);
		if(data[i].code == 'USD' || data[i].code == 'CAD'){
			li.classList.add('selected');
		}
		var cloned = li.cloneNode(true);
		fromDD.appendChild(li);
		toDD.appendChild(cloned);
	 }	 
}


function formatValue(input){

	var selection = window.getSelection().toString();
	var $this = $( input );
	var input = $this.val();
	var input = input.replace(/[\D\s\._\-]+/g, "");
	input = input ? parseInt( input, 10 ) : 0;

	$this.val( function() {
		return ( input === 0 ) ? "" : input.toLocaleString( "en-US" );
	} );
}

$('.init').each(function(){
	$(this).on('click', function(){
		if($(this).siblings('.curr-drop').hasClass('opened')){
			$(this).siblings('.curr-drop').removeClass('opened');
		}
		else{
			$('.curr-drop.opened').removeClass('opened');
			$(this).siblings('.curr-drop').addClass('opened');
		}
	});
});


$('.sel-wrap').each(function(){
	var $drop = $(this);

	$(this).on("click", "li", function() {

		var allOptions = $drop.find('li');
		var litext = $(this).text();
		var neighbour = $drop.parent().parent().find('.curr-drop:not(.opened)').parent();
		var neighbouroptions = $(neighbour).find('li');
		var neighbourSelected = $(neighbour).children('.init').text().trim().substring(0,3);
		var neighbourNew = $(neighbour).find('li:contains('+litext +')');

	    allOptions.removeClass('selected');
	    neighbouroptions.removeClass('selected');

	    $(this).addClass('selected');
	    $(this).parent().find('li:contains('+neighbourSelected +')').addClass('selected');
	    $(neighbour).find('li:contains('+neighbourSelected +')').addClass('selected');
		neighbourNew.addClass('selected');

	    $drop.children('.init').html($(this).html());
	    $('.curr-drop.opened').removeClass('opened');
	    $drop.find('input').val('');
	    //allOptions.show();
	    convertCurr();
	});	
});

$('.curr-drop input').on('keyup', function(){
	var filter = this.value.toUpperCase();
	var options = $(this).parent().find('li'); 
	var optionsFullList = $(this).siblings('ul').hasClass('full'); 
	if(filter === '' && !optionsFullList ){
		for(var j = 0; j< options.length; j++){
			
			if($(options[j]).hasClass('fav') && !$(options[j]).hasClass('selected')){
				$(options[j]).show();
			}
			else{
				$(options[j]).hide();
			}
		}
	}
	else{
	    for (var i = 0; i < options.length; i++) {
	        if (options[i].innerHTML.toUpperCase().indexOf(filter) > -1 ) {
	        	if(!$(options[i]).hasClass('selected')){
	            	$(options[i]).show();
	        	}
	        } else {
	            $(options[i]).hide();
	        }
	    }
	}
});


function moreCurr(e){
	$(e.target).siblings('ul').addClass('full');
	$(e.target).hide();
	$(e.target).siblings('ul').children('li:not(.selected)').show();
}

function unformatVal(input){
			
	var arr = $(input).val().split(',');
	var res='';
	for (var i = 0; i < arr.length; i++) {
			// arr[i] = arr[i].replace(/[($)\s\._\-]+/g, '');
			res += arr[i];
	};
	return res;
}


function convertCurr(){
	var from = $('.init')[0].innerText.trim();
	var to = $('.init')[1].innerText.trim();
	var amount = unformatVal($('#fromcount'));
	var res=0;
	if(amount === ''){
		$('#tocount').val(0); 
	}
	else{
	    $.ajax({
		    url: 'http://apilayer.net/api/convert' + '?access_key=' + APIkey +'&from=' + from + '&to=' + to + '&amount=' + amount,   
		    dataType: 'jsonp',
		    success: function(json) {
				var res = json.result.toFixed(2);   
		        $('#tocount').val(res);  
		        //formatValue($('#tocount'));  
				$('#exchrate').text((amount/res).toFixed(5));   
			}
		});
		// $('#tocount').val(amount/1.2);
	}
}