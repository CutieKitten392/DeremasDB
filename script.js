// 設定済みのアイドルデータ行
var row = null;

// タイマーID変数
var timer_insert = 0;
var timer_update = 0;
var timer_login = 0;
var timer_user = 0;
var timer_delete = 0;
var timer_option = 0;

// 画像URL
var URL = 'http://125.6.169.35/idolmaster/image_sp/card/';


//--------------------------//
// ページトップへスクロール //
//--------------------------//
function gotop() {
	$('html,body').animate({ scrollTop: 0 }, 'fast');
}

//--------------------------------------------------------------------//
// アイドル検索フォームデータ送信                                     //
//--------------------------------------------------------------------//
// 検索フォームに入力されたデータを送信し、検索結果をページに読み込む //
//--------------------------------------------------------------------//
function submitIdolSearchForm() {
	// 検索ボタンを使用不可にする
	$("#search-decide")[0].disabled = "true";
	// 処理中メッセージ表示
	$("#count")[0].innerHTML = "処理中...";
	
	// JSONからデータを絞り込む
	var opt = {};
	opt.type = $('#type')[0].value;
	opt.rare = $('#rare')[0].value;
	opt.cost = $('#cost')[0].value;
	opt.name = $('#name')[0].value;
	opt.select = $('#select')[0].value;
	opt.sort = $('#sort')[0].value;
	opt.sort2 = $('#sort2')[0].value;
	opt.limit = $('#limit')[0].value;
	$.getJSON("idoldata.json", function(data) {
		var result = new Array();
		$.each(data.data, function(index, val) {
			
			if(opt.type != "%" && opt.type != val.type) {
				return true;
			}
			if(opt.rare != "%" && opt.rare !== val.rare) {
				return true;
			}
			if(opt.cost != "%" && opt.cost != val.cost) {
				return true;
			}
			if(opt.name != "" && val.name.indexOf(opt.name) != -1) {
				return true;
			}
			if(opt.name != "" && val.rubi.indexOf(opt.name) != -1) {
				return true;
			}
			
			result.push(val);
		});
		
		// HTML形成
		var elm = "";
		elm += '<div id="count" class="panel-heading" style="padding:5px">';
		elm += '検索結果 ' + result.length + '件';
		elm += '</div>';
		elm += '<div class="panel-body">';
		elm += '<div class="table-responsive">';
		elm += '<table id="table" border=1 class="table table-condensed table-bordered" cellpadding=2 cellspacing=0 width=100%>';
		elm += '<tr class="bg-primary">';
		var column = ['タイプ', 'レア度', 'アイドル名', 'コスト', '攻', '守', '最大攻', '最大守', '特技名', '特技効果', '追加日'];
		$.each(column, function(index, val) {
			elm += '<th>' + val + '</th>';
		});
		elm += '</tr>';
		$.each(result, function(index, val) {
			if(opt.limit == index) {
				return false;
			}
			var className;
			switch(val.type) {
				case 'ｷｭｰﾄ'  : className = 'cute'; break;
				case 'ｸｰﾙ'   : className = 'cool'; break;
				case 'ﾊﾟｯｼｮﾝ': className = 'passion'; break;
			}
			if(val.cost == 999) {
				className = 'trainer';
			}
			var atk_rate = Math.round( val.max_atk / val.cost , 1 );
			var def_rate = Math.round( val.max_def / val.cost , 1 );
			elm += '<tr class="' + className + '" onclick="selectIdol(this)">';
			elm += "<td hidden>" + val.no + "</td>";
			elm += "<td hidden>" + val.id + "</td>";
			elm += "<td>" + val.type + "</td>";
			elm += "<td>" + val.rare + "</td>";
			elm += "<td><a href='#' onclick='imgDisplay(this); return false;'>" + val.name + "</a></td>";
			elm += "<td>" + val.cost + "</td>";
			elm += "<td>" + val.atk + "</td>";
			elm += "<td>" + val.def + "</td>";
			elm += "<td>" + val.max_atk + "</td>";
			elm += "<td>" + val.max_def + "</td>";
			elm += "<td hidden>" + val.atk_rate + "</td>";
			elm += "<td hidden>" + val.def_rate + "</td>";
			elm += "<td>" + val.skill_name + "</td>";
			elm += "<td>" + val.skill_effect + "</td>";
			elm += "<td hidden align=center>";
			elm += "<div class='btn-group btn-group-xs'>";
			elm += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>";
			elm += "選択<span class='caret'></span>";
			elm += "</button>";
			elm += "<ul class='dropdown-menu' role='menu'>";
			elm += "<li role='presentation'><a role='menuitem' tabindex='-1' href='#' size='large' hash='l/" + val.hash + "' exp='jpg' onclick='return imgDisplay(this);'>大サイズ</a></li>";
			elm += "<li role='presentation'><a role='menuitem' tabindex='-1' href='#' size='middle' hash='ls/" + val.hash + "' exp='jpg' onclick='return imgDisplay(this);'>中サイズ</a></li>";
			elm += "<li role='presentation'><a role='menuitem' tabindex='-1' href='#' size='small' hash='xs/" + val.hash + "' exp='jpg' onclick='return imgDisplay(this);'>小サイズ</a></li>";
			if(val.rare == 'SR' || val.rare == 'SR+') {
				elm += "<li role='presentation'><a role='menuitem' tabindex='-1' href='#' size='quest' hash='quest/" + val.hash + "' exp='jpg' onclick='return imgDisplay(this);'>お仕事</a></li>";
				elm += "<li role='presentation'><a role='menuitem' tabindex='-1' href='#' size='large' hash='l_noframe/" + val.hash + "' exp='jpg' onclick='return imgDisplay(this);'>枠なし</a></li>";
			} else {
				elm += "<li role='presentation'><a role='menuitem' tabindex='-1' href='#' size='quest' hash='quest/" + val.hash + "' exp='png' onclick='return imgDisplay(this);'>お仕事</a></li>";
			}
			elm += "</ul>";
			elm += "</div>";
			elm += "<td hidden>" + val.max_lv + "</td><td hidden>" + val.max_love + "</td>";
			elm += "<td hidden>" + val.skill_id + "</td><td hidden>" + val.hash + "</td>";
			elm += "<td>" + val.date + "</td></tr>";
		});
		elm += '</table>';
		elm += '</div>';
		elm += '</div>';
		
		// 生成した要素を表示
		$("#tableArea").html(elm);
		// 検索ボタンを使用可能にする
		$("#search-decide")[0].disabled = "";

	});
	
	return false;
}

//------------------------------//
// アイドル検索フォームリセット //
//------------------------------//
// 検索フォームの内容を初期化   //
//------------------------------//
function resetIdolSearchForm() {
	$("#type")[0].selectedIndex = 0;
	$("#rare")[0].selectedIndex = 0;
	$("#cost")[0].selectedIndex = 0;
	$("#name")[0].value = "";
	$("#sort")[0].selectedIndex = 0;
	$("#sort2")[0].selectedIndex = 0;
}

//--------------------------------------------------------------------//
// プロフィール検索フォーム送信                                       //
//--------------------------------------------------------------------//
// 検索フォームに入力されたデータを送信し、検索結果をページに読み込む //
//--------------------------------------------------------------------//
function submitProfileSearchForm() {
	// 検索ボタンを使用不可にする
	$("#search-decide")[0].disabled = "true";
	// 処理中メッセージ表示
	$("#count")[0].innerHTML = "処理中...";
	// ページ再読み込み
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'pdbm_connect',
			p_name: $("#p_name")[0].value,
			p_type: $("#p_type")[0].value,
			age1: $("#age1")[0].value,
			age2: $("#age2")[0].value,
			tall1: $("#tall1")[0].value,
			tall2: $("#tall2")[0].value,
			weight1: $("#weight1")[0].value,
			weight2: $("#weight2")[0].value,
			bust1: $("#bust1")[0].value,
			bust2: $("#bust2")[0].value,
			west1: $("#west1")[0].value,
			west2: $("#west2")[0].value,
			hip1: $("#hip1")[0].value,
			hip2: $("#hip2")[0].value,
			month1: $("#month1")[0].value,
			month2: $("#month2")[0].value,
			day1: $("#day1")[0].value,
			day2: $("#day2")[0].value,
			star: $("#star")[0].value,
			blood: $("#blood")[0].value,
			hand: $("#hand")[0].value,
			from: $("#from")[0].value,
			p_sort: $("#p_sort")[0].value,
			p_sort2:$("#p_sort2")[0].value
		},
		success: function(data) {
			// 抽出したHTMLを読み込み
			$('div#tableArea').html(data);
			// 検索ボタンを使用可能にする
			$("#search-decide")[0].disabled = "";
		}
	});
	return false;
}

//----------------------------------//
// プロフィール検索フォームリセット //
//----------------------------------//
// 検索フォームの内容を初期化       //
//----------------------------------//
function resetProfileSearchForm() {
	$('#p_name')[0].value = '';
	$('#p_type')[0].selectedIndex = 0;
	$('#age1')[0].value = '';
	$('#age2')[0].value = '';
	$('#tall1')[0].value = '';
	$('#tall2')[0].value = '';
	$('#weight1')[0].value = '';
	$('#weight2')[0].value = '';
	$('#bust1')[0].value = '';
	$('#bust2')[0].value = '';
	$('#west1')[0].value = '';
	$('#west2')[0].value = '';
	$('#hip1')[0].value = '';
	$('#hip2')[0].value = '';
	$('#month1')[0].value = '';
	$('#month2')[0].value = '';
	$('#day1')[0].value = '';
	$('#day2')[0].value = '';
	$('#star')[0].selectedIndex = 0;
	$('#blood')[0].selectedIndex = 0;
	$('#hand')[0].selectedIndex = 0;
	$('#from')[0].value = '';
	$('#p_sort')[0].selectedIndex = 0;
	$('#p_sort2')[0].selectedIndex = 0;
}

//----------------------------------------------------//
// 画像表示                                           //
//----------------------------------------------------//
// 背景を暗くしつつ、指定された画像を徐々に表示させる //
//----------------------------------------------------//
// elm : 画像表示するアイドルのデータ行要素           //
//----------------------------------------------------//
function imgDisplay(elm) {
	$('div#image ul.nav').children('li').removeClass("active");
	$('li#img-tab-default').addClass("active");
	$('div#image div.tab-content').children('div').removeClass("active in");
	$('div#image-large').addClass("active in");
	$('img#large')[0].style.display = "none";
	$('img#large')[0].style.width = "auto";
	$('img#noframe')[0].style.display = "none";
	$('img#noframe')[0].style.width = "auto";
	$('img#sign_p')[0].style.display = "none";
	$('img#sign_p')[0].style.width = "auto";
	$('img#sign_b')[0].style.display = "none";
	$('img#sign_b')[0].style.width = "auto";
	var url = 'http://125.6.169.35/idolmaster/image_sp/card';
	var row = $(elm).parent().parent();
	var rare = row.children("td")[3].innerText;
	var hash = row.children("td")[18].innerText;
	$('img#large').attr("src", url + "/l/" + hash + ".jpg");
	$('img#middle').attr("src", url + "/ls/" + hash + ".jpg");
	$('img#small').attr("src", url + "/xs/" + hash + ".jpg");
	if(rare === "SR" || rare === "SR+") {
		$('img#quest').attr("src", url + "/quest/" + hash + ".jpg");
		$('img#noframe').attr("src", url + "/l_noframe/" + hash + ".jpg");
		$('img#sign_p').attr("src", url + "_sign_p/l/" + hash + ".jpg");
		$('img#sign_b').attr("src", url + "_sign_b/l/" + hash + ".jpg");
		$('img#sign_p')[0].style.display = "block";
		$('img#sign_p')[0].style.width = "auto";
	} else {
		$('img#quest').attr("src", url + "/quest/" + hash + ".png");
		$('img#noframe').attr("src", "");
		$('img#sign_p').attr("src", "");
		$('img#sign_b').attr("src", "");
		$('img#large')[0].style.display = "block";
		$('img#large')[0].style.width = "auto";
	}
	$('img#large')[0].onload = function() {
		$('#image').modal({backdrop:"true"});
	};
	return false;
}

//----------------------------------------------------//
// SR画像切り替え                                     //
//----------------------------------------------------//
// SR以上の画像を枠あり／なしに切り替える             //
//----------------------------------------------------//
function imgChange() {
	if( $('img#noframe').attr("src") === "" ) {
		return;
	}
	var orig, desc;
	if( $('img#sign_p')[0].style.display === "block" ) {
		orig = "img#sign_p";
		desc = "img#sign_b";
	} else if ( $('img#sign_b')[0].style.display === "block" ) {
		orig = "img#sign_b";
		desc = "img#large";
	} else if ( $('img#large')[0].style.display === "block" ) {
		orig = "img#large";
		desc = "img#noframe";
	} else if ( $('img#noframe')[0].style.display === "block" ) {
		orig = "img#noframe";
		desc = "img#sign_p";
	}
	var width = $(orig).width();
	$(orig).animate({
		width: "0px"
	}, 200, function() {
		$(orig)[0].style.display = "none";
		$(desc)[0].style.width = "0";
		$(desc)[0].style.display = "block";
		$(desc).animate({
			width: width + "px"
		}, 200);
	});
}

//---------------------------------------------//
// 画像URLからハッシュ値を抽出                 //
//---------------------------------------------//
// 入力された画像のURLからハッシュ値を抽出     //
//---------------------------------------------//
// form : フォームのタイプ（i：追加  u：編集） //
//---------------------------------------------//
function getHash(form) {
	// エラーを非表示
	switch(form) {
		case 'i':
			clearTimeout(timer_insert);
			timer_insert = 0;
			$('#insert-error').hide();
			$('#calc-error').hide();
			break;
		case 'u':
			clearTimeout(timer_update);
			timer_update = 0;
			$('#update-error1').hide();
			$('#update-error2').hide();
			$('#update-error3').hide();
			$('#calc-error2').hide();
			break;
	}
	// 抽出処理
	var url = $('#'+form+'_hash')[0].value;
	url = url.substring( url.indexOf('card_sign_p%2F') );
	url = url.substring( url.indexOf('card_sign_b%2F') );
	url = url.substring( url.indexOf('card%2F') );
	url = url.replace('card_sign_p%2F','')
	url = url.replace('card_sign_b%2F','')
	url = url.replace('card%2F','')
	url = url.substring( 0, url.indexOf('.jpg') );
	url = url.replace('l%2F','');
	url = url.replace('ls%2F','');
	url = url.replace('xs%2F','');
	url = url.replace('s%2F','');
	url = url.replace('m%2F','');
	url = url.replace('m2%2F','');
	// フォームに抽出したハッシュ値を反映
	$('#'+form+'_hash')[0].value = url;
}

function openForm(id) {
	var array = ["search-form", "insert-form", "update-form"];
	for(var i=0; i<array.length; i++) {
		if(array[i] != id) {
			$("#" + array[i]).collapse("hide");
		}
	}
	$("#" + id).collapse("show");
}