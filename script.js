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


//-------------------------//
// ページ遷移              //
//-------------------------//
// 通常のページ遷移を行う  //
//-------------------------//
// url : 遷移先ページのURL //
//-------------------------//
function jump(url) {
	location.href = url;
}

//----------------------------------------------------------------------------------------//
// 要ログインページ遷移                                                                   //
//----------------------------------------------------------------------------------------//
// ページ遷移の前にユーザー認証し、ログインしていなければ遷移せずにログインフォームを表示 //
//----------------------------------------------------------------------------------------//
// url : 遷移先ページのURL                                                                //
//----------------------------------------------------------------------------------------//
function secureJump(url) {
	// ログインしていなければ遷移せずにログインフォームを表示
	if( getLog() ) {
		jump(url);
	} else {
		$('#loginModal').modal({backdrop:"static"});
	}			
}

//------------------------------------------------------//
// 要管理者権限ページ遷移                               //
//------------------------------------------------------//
// ページ遷移の前に管理者認証し、結果に応じた遷移を行う //
//------------------------------------------------------//
// url1 : 管理者権限がある場合の遷移先                  //
// url2 : 管理者権限がない場合の遷移先                  //
//------------------------------------------------------//
function authJump(url1, url2) {
	// 管理者認証を行う
	if( getAuth() ) {
		jump(url1);
	} else {
		jump(url2);
	}
}

//--------------------------------------------------------------//
// ログインフォームに入力されたデータを送信し、ユーザー認証する //
//--------------------------------------------------------------//
function login() {
	// エラーを非表示
	clearTimeout(timer_login);
	timer_login = 0;
	$("#login-error1").hide();
	$("#login-error2").hide();
	$("#login-error3").hide();
	// データを送信
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'login',
			user: $('#user')[0].value,
			password: $('#password')[0].value
		},
		async: false,
		success: function(data) {
			switch(data) {
				// ユーザー名とパスワードが一致
				case '3':
					$('#login-message').html('ログインしました。');
					$('#login-button').html('<button type="button" class="btn btn-default" onclick="jump(' + "'index.php'" + ')">戻る</button>');
					return false;
				// ユーザー名だけが一致
				case '2':
					$("#login-error").fadeIn(200);
					timer_login = setTimeout( "$('#login-error').fadeOut(200)", 2000 );
					return false;
				// パスワードだけが一致
				case '1':
					$("#login-error").fadeIn(200);
					timer_login = setTimeout( "$('#login-error').fadeOut(200)", 2000 );
					return false;
				// ユーザー名とパスワードが一致しない
				case '0':
					$("#login-error").fadeIn(200);
					timer_login = setTimeout( "$('#login-error').fadeOut(200)", 2000 );
					return false;
			}
		}
	});
	return false;
}

//------------------------------------------------------------//
// ログアウト                                                 //
//------------------------------------------------------------//
// データを送信し、セッション変数の値を破棄してログアウトする //
//------------------------------------------------------------//
function logout() {
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'logout'
		},
		async: false,
		success: function(data) {
			$('#login-message').html('ログアウトしました。');
			$('#login-button').html('<button type="button" class="btn btn-default" onclick="jump(' + "'index.php'" + ')">戻る</button>');
		}
	});
}

//----------------------------------------//
// ログイン状態取得                       //
//----------------------------------------//
// 戻り値：true（ログインしている場合）   //
//         false（ログインしていない場合）//
//----------------------------------------//
function getLog() {
	var result;
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'printLog'
		},
		async: false,
		success: function(data) {
			if(data == 'LOGOUT')	result = true;
			else					result = false;
		}
	});
	return result;
}

//--------------------------------------//
// 管理者権限取得                       //
//--------------------------------------//
// 戻り値：true（管理者権限がある場合） //
//         false（管理者権限がない場合）//
//--------------------------------------//
function getAuth() {
	if( getLog() ) {
		var result;
		$.ajax({
			type: 'POST',
			url: 'function.php',
			data: {
				function: 'getAuth'
			},
			async: false,
			success: function(data) {
				if(data == '1')	result = true;
				else			result = false;
			}
		});
		return result;
	}
	return false;
}

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
	/*
	// データを送信
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'idbm_connect',
			type: $("#type")[0].value,
			rare: $("#rare")[0].value,
			cost: $("#cost")[0].value,
			name: $("#name")[0].value,
			select: $("#select")[0].value,
			sort: $("#sort")[0].value,
			sort2: $("#sort2")[0].value,
			limit: $("#limit")[0].value
		},
		success: function(data) {
			// 取得したデータを表示
			$("#tableArea").html(data);
			// 検索ボタンを使用可能にする
			$("#search-decide")[0].disabled = "";
		}
	});
	*/
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
	var result = new Array();
	$.getJSON("idoldata.json", function(data) {
		console.log(data);
		$.each(data.data, function(index, val) {
			result.push(val);
		});
	});
	console.log(result);
	
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
		return opt.limit != index;
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
	
	return false;
}

//------------------------------------------------------------------------------//
// アイドル追加フォームデータ送信                                               //
//------------------------------------------------------------------------------//
// 追加フォームに入力されたデータを送信し、確認フォームに処理内容を読み込み表示 //
//------------------------------------------------------------------------------//
function submitIdolInsertForm() {
	// 最大攻撃値・最大守備値が空欄の場合、自動的に最大値を計算
	if( $("#i_max_atk")[0].value == "" && $("#i_max_def")[0].value == "" ) {
		
	}
	// エラーを非表示
	clearTimeout(timer_insert);
	timer_insert = 0;
	$("#insert-error").hide();
	$("#calc-error1").hide();
	// 入力項目のチェック
	var flg = true;
	flg &= $("#i_name")[0].value != "";
	flg &= $("#i_cost")[0].value != "";
	flg &= $("#i_atk")[0].value != "";
	flg &= $("#i_def")[0].value != "";
	flg &= $("#i_max_atk")[0].value != "";
	flg &= $("#i_max_def")[0].value != "";
	flg &= $("#i_max_lv")[0].value != "";
	flg &= $("#i_max_love")[0].value != "";
	flg &= $("#i_hash")[0].value != "";
	flg &= $("#i_date")[0].value != "" && $("#i_date")[0].value.length == 10;
	if( flg == false ) {
		$("#insert-error").fadeIn(200);
		timer_insert = setTimeout( "$('#insert-error').fadeOut(200)", 2000 );
		return false;
	}
	// データを送信
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'dataPrint',
			mode: "insert",
			type: $("#i_type")[0].value,
			rare: $("#i_rare")[0].value,
			title: $("#i_title")[0].value,
			name: $("#i_name")[0].value,
			plus: $("#i_plus")[0].checked,
			invite: $("#i_invite")[0].checked,
			trainer: $("#i_trainer")[0].checked,
			cost: $("#i_cost")[0].value,
			atk: $("#i_atk")[0].value,
			def: $("#i_def")[0].value,
			max_atk: $("#i_max_atk")[0].value,
			max_def: $("#i_max_def")[0].value,
			max_lv: $("#i_max_lv")[0].value,
			max_love: $("#i_max_love")[0].value,
			skill_name: $("#i_skill_name")[0].value,
			skill_effect1: $("#i_skill_effect1")[0].value,
			skill_effect2: $("#i_skill_effect2")[0].value,
			skill_effect3: $("#i_skill_effect3")[0].value,
			skill_effect4: $("#i_skill_effect4")[0].value,
			skill_effect5: $("#i_skill_effect5")[0].value,
			hash: $("#i_hash")[0].value,
			date: $("#i_date")[0].value
		},
		async: false,
		success: function(data) {
			// 抽出したHTMLを読み込み
			$('#submit-load').html(data);
			// 確認フォームを表示
			// setCenter('#submitForm');
			// $('#shadow').fadeIn(200);
			// $('#submitForm').fadeIn(200);
			$('#submitForm').modal({backdrop:"static"});
		}
	});
	return false;
}

//------------------------------------------------------------------------------//
// アイドル編集フォームデータ送信                                               //
//------------------------------------------------------------------------------//
// 編集フォームに入力されたデータを送信し、確認フォームに処理内容を読み込み表示 //
//------------------------------------------------------------------------------//
function submitIdolUpdateForm() {
	// エラーを非表示
	clearTimeout(timer_update);
	timer_update = 0;
	$("#update-error1").hide();
	$("#update-error2").hide();
	$("#update-error3").hide();
	$("#calc-error2").hide();
	// 選択アイドルのチェック
	if( row == null ) {
		$("#update-error1").fadeIn(200);
		timer_update = setTimeout( "$('#update-error1').fadeOut(200)", 2000 );
		return false;
	}
	// 入力必須項目のチェック
	var flg = true;
	if(	$("#u_no")[0].value == "" || $("#u_id1")[0].value == "" || $("#u_id2")[0].value == "" || $("#u_id3")[0].value == "" || $("#u_id4")[0].value == "" || $("#u_name")[0].value == "" || $("#u_cost")[0].value == "" || $("#u_atk")[0].value == "" || $("#u_def")[0].value == "" || $("#u_max_atk")[0].value == "" || $("#u_max_def")[0].value == "" || $("#u_max_lv")[0].value == "" || $("#u_max_love")[0].value == "" || $("#u_hash")[0].value == "" ) {
		$("#update-error2").fadeIn(200);
		timer_update = setTimeout( "$('#update-error2').fadeOut(200)", 2000 );
		return false;
	}
	// 変更箇所のチェック
	flg = false;
	var id = row.cells[1].firstChild.data;
	var name = row.cells[4].firstChild.innerText;
	flg |= $("#u_no")[0].value != row.cells[0].firstChild.data;
	flg |= $("#u_id1")[0].value != id.substring(0,1);
	flg |= $("#u_id2")[0].value != id.substring(1,2);
	flg |= $("#u_id3")[0].value != new Number(id.substring(2,5));
	flg |= $("#u_id4")[0].value != new Number(id.substring(5,7));
	flg |= $("#u_type")[0].value != row.cells[2].firstChild.data;
	flg |= $("#u_rare")[0].value != row.cells[3].firstChild.data.replace("+","");
	flg |= $("#u_title")[0].value != name.substring( name.indexOf("[")+1, name.indexOf("]") );
	flg |= $("#u_name")[0].value != name.substring( name.indexOf("]")+1 ).replace("+","");
	flg |= $("#u_plus")[0].checked != name.indexOf("+") > 0;
	flg |= $("#u_cost")[0].value != row.cells[5].firstChild.data;
	flg |= $("#u_atk")[0].value != row.cells[6].firstChild.data;
	flg |= $("#u_def")[0].value != row.cells[7].firstChild.data;
	flg |= $("#u_max_atk")[0].value != row.cells[8].firstChild.data;
	flg |= $("#u_max_def")[0].value != row.cells[9].firstChild.data;
	flg |= $("#u_max_lv")[0].value != row.cells[15].firstChild.data;
	flg |= $("#u_max_love")[0].value != row.cells[16].firstChild.data;
	if( row.cells[12].firstChild != null ) {
		flg |= $("#u_skill_name")[0].value != row.cells[12].firstChild.data;
		flg |= $("#u_skill_effect1")[0].value != row.cells[17].firstChild.data.slice(-5,-4);
		flg |= $("#u_skill_effect2")[0].value != row.cells[17].firstChild.data.slice(-6,-5);
		flg |= $("#u_skill_effect3")[0].value != row.cells[17].firstChild.data.slice(-4,-3);
		flg |= $("#u_skill_effect4")[0].value != row.cells[17].firstChild.data.slice(-3,-1);
		flg |= $("#u_skill_effect5")[0].value != row.cells[17].firstChild.data.slice(-1);
	}
	flg |= $("#u_hash")[0].value != row.cells[18].firstChild.data;
	flg |= $("#u_date")[0].value != row.cells[19].firstChild.data;
	if( flg == false ) {
		$("#update-error3").fadeIn(200);
		timer_update = setTimeout( "$('#update-error3').fadeOut(200)", 2000 );
		return false;
	}
	// データを送信
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'dataPrint',
			mode: "update",
			idol: $("#u_idol")[0].innerHTML,
			no: $("#u_no")[0].value,
			id1: $("#u_id1")[0].value,
			id2: $("#u_id2")[0].value,
			id3: $("#u_id3")[0].value,
			id4: $("#u_id4")[0].value,
			type: $("#u_type")[0].value,
			rare: $("#u_rare")[0].value,
			title: $("#u_title")[0].value,
			name: $("#u_name")[0].value,
			plus: $("#u_plus")[0].checked,
			cost: $("#u_cost")[0].value,
			atk: $("#u_atk")[0].value,
			def: $("#u_def")[0].value,
			max_atk: $("#u_max_atk")[0].value,
			max_def: $("#u_max_def")[0].value,
			max_lv: $("#u_max_lv")[0].value,
			max_love: $("#u_max_love")[0].value,
			skill_name: $("#u_skill_name")[0].value,
			skill_effect1: $("#u_skill_effect1")[0].value,
			skill_effect2: $("#u_skill_effect2")[0].value,
			skill_effect3: $("#u_skill_effect3")[0].value,
			skill_effect4: $("#u_skill_effect4")[0].value,
			skill_effect5: $("#u_skill_effect5")[0].value,
			hash: $("#u_hash")[0].value,
			date: $("#u_date")[0].value
		},
		async: false,
		success: function(data) {
			// 抽出したHTMLを読み込み
			$('#submit-load').html(data);
			// 確認フォームを表示
			//setCenter('#submitForm');
			//$('#shadow').fadeIn(200);
			//$('#submitForm').fadeIn(200);
			$('#submitForm').modal({backdrop:"static"});
		}
	});
	return false;
}

//----------------------------------------------------------------------//
// アイドル削除フォームデータ送信                                       //
//----------------------------------------------------------------------//
// 削除するアイドルの名前を送信し、確認フォームに処理内容を読み込み表示 //
//----------------------------------------------------------------------//
function submitIdolDeleteForm() {
	// エラーを非表示
	clearTimeout(timer_update);
	timer_update = 0;
	$("#update-error1").hide();
	$("#update-error2").hide();
	$("#update-error3").hide();
	$("#calc-error2").hide();
	// 選択アイドルのチェック
	if( row == null ) {
		$('#update-error1').fadeIn(200);
		timer_update = setTimeout( "$('#update-error1').fadeOut(200)", 2000 );
		return false;
	}
	// データを送信
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'dataPrint',
			mode: 'delete',
			idol: $('#u_idol')[0].innerHTML
		},
		async: false,
		success: function(data) {
			// 抽出したHTMLを読み込み
			$('#submit-load').html(data);
			// 確認フォームを表示
			//setCenter('#submitForm');
			//$('#shadow').fadeIn(200);
			//$('#submitForm').fadeIn(200);
			$('#submitForm').modal({backdrop:"static"});
		}
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

//------------------------------//
// アイドル追加フォームリセット //
//------------------------------//
// 検索フォームの内容を初期化   //
//------------------------------//
function resetIdolInsertForm() {
	$("#i_type")[0].selectedIndex = 0;
	$("#i_rare")[0].selectedIndex = 0;
	$("#i_title")[0].value = "";
	$("#i_name")[0].value = "";
	$("#i_plus")[0].checked = false;
	$("#i_invite")[0].checked = false;
	$("#i_trainer")[0].checked = false;
	$("#i_cost")[0].value = "";
	$("#i_atk")[0].value = "";
	$("#i_def")[0].value = "";
	$("#i_max_atk")[0].value = "";
	$("#i_max_def")[0].value = "";
	$("#i_max_lv")[0].value = "";
	$("#i_max_love")[0].value = "";
	$("#i_skill_name")[0].value = "";
	$("#i_skill_effect1")[0].selectedIndex = 0;
	$("#i_skill_effect2")[0].selectedIndex = 0;
	$("#i_skill_effect3")[0].selectedIndex = 0;
	$("#i_skill_effect4")[0].selectedIndex = 0;
	$("#i_skill_effect5")[0].selectedIndex = 0;
	$("#i_hash")[0].value = "";
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	month = month < 10 ? "0" + month : month;
	var date = now.getDate();
	date = date < 10 ? "0" + date : date;
	$("#i_date")[0].value = year + "-" + month + "-" + date;
	setMax('i');
}

//------------------------------//
// アイドル編集フォームリセット //
//------------------------------//
// 検索フォームの内容を初期化   //
//------------------------------//
function resetIdolUpdateForm() {
	// アイドルが選択されていればフォームに現在のステータスを格納
	// 選択されていなければフォームを初期化
	if( row == null ) {
		$("#u_idol")[0].innerHTML = "なし";
		$("#u_no")[0].value = "";
		$("#u_id1")[0].value = "";
		$("#u_id2")[0].value = "";
		$("#u_id3")[0].value = "";
		$("#u_id4")[0].value = "";
		$("#u_type")[0].selectedIndex = 0;
		$("#u_rare")[0].selectedIndex = 0;
		$("#u_title")[0].value = "";
		$("#u_name")[0].value = "";
		$("#u_plus")[0].checked = false;
		$("#u_cost")[0].value = "";
		$("#u_atk")[0].value = "";
		$("#u_def")[0].value = "";
		$("#u_max_atk")[0].value = "";
		$("#u_max_def")[0].value = "";
		$("#u_max_lv")[0].value = "";
		$("#u_max_love")[0].value = "";
		$("#u_skill_name")[0].value = "";
		$("#u_skill_effect1")[0].selectedIndex = "";
		$("#u_skill_effect2")[0].selectedIndex = "";
		$("#u_skill_effect3")[0].selectedIndex = "";
		$("#u_skill_effect4")[0].selectedIndex = "";
		$("#u_skill_effect5")[0].selectedIndex = "";
		$("#u_hash")[0].value = "";
		$("#u_date")[0].value = "";
	} else {
		// 行に格納されているデータを編集フォームに設定
		var id = row.cells[1].firstChild.data;
		var name = row.cells[4].firstChild.innerText;
		$("#u_idol")[0].innerHTML = row.cells[4].firstChild.innerText;
		$("#u_no")[0].value = row.cells[0].firstChild.data;
		$("#u_id1")[0].value = id.substring(0,1);
		$("#u_id2")[0].value = id.substring(1,2);
		$("#u_id3")[0].value = new Number(id.substring(2,5));
		$("#u_id4")[0].value = new Number(id.substring(5,7));
		for( var i=0; i<$("#u_type")[0].options.length; i++ )
			if( $("#u_type")[0].options[i].value == row.cells[2].firstChild.data )
				$("#u_type")[0].selectedIndex = i;
		for( var i=0; i<$("#u_rare")[0].options.length; i++ )
			if( $("#u_rare")[0].options[i].value == row.cells[3].firstChild.data.replace("+","") )
				$("#u_rare")[0].selectedIndex = i;
		$("#u_title")[0].value = name.substring( name.indexOf("[")+1, name.indexOf("]") );
		$("#u_name")[0].value = name.substring( name.indexOf("]")+1 ).replace("+","");
		$("#u_plus")[0].checked = name.indexOf("+") > 0;
		$("#u_cost")[0].value = row.cells[5].firstChild.data;
		$("#u_atk")[0].value = row.cells[6].firstChild.data;
		$("#u_def")[0].value = row.cells[7].firstChild.data;
		$("#u_max_atk")[0].value = row.cells[8].firstChild.data;
		$("#u_max_def")[0].value = row.cells[9].firstChild.data;
		$("#u_max_lv")[0].value = row.cells[15].firstChild.data;
		$("#u_max_love")[0].value = row.cells[16].firstChild.data;
		if( row.cells[12].firstChild != null ) {
			$("#u_skill_name")[0].value = row.cells[12].firstChild.data;
			for( var i=0; i<$("#u_skill_effect1")[0].options.length; i++ )
				if( $("#u_skill_effect1")[0].options[i].value == row.cells[17].firstChild.data.slice(-5,-4) )
					$("#u_skill_effect1")[0].selectedIndex = i;
			for( var i=0; i<$("#u_skill_effect2")[0].options.length; i++ )
				if( $("#u_skill_effect2")[0].options[i].value == row.cells[17].firstChild.data.slice(-6,-5) )
					$("#u_skill_effect2")[0].selectedIndex = i;
			for( var i=0; i<$("#u_skill_effect3")[0].options.length; i++ )
				if( $("#u_skill_effect3")[0].options[i].value == row.cells[17].firstChild.data.slice(-4,-3) )
					$("#u_skill_effect3")[0].selectedIndex = i;
			for( var i=0; i<$("#u_skill_effect4")[0].options.length; i++ )
				if( $("#u_skill_effect4")[0].options[i].value == row.cells[17].firstChild.data.slice(-3,-1) )
					$("#u_skill_effect4")[0].selectedIndex = i;
			for( var i=0; i<$("#u_skill_effect5")[0].options.length; i++ )
				if( $("#u_skill_effect5")[0].options[i].value == row.cells[17].firstChild.data.slice(-1) )
					$("#u_skill_effect5")[0].selectedIndex = i;
		}
		$("#u_hash")[0].value = row.cells[18].firstChild.data;
		$("#u_date")[0].value = row.cells[19].firstChild.data;
	}
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

//------------------------------------------------------------------------------//
// プロフィール追加フォーム送信                                                 //
//------------------------------------------------------------------------------//
// 追加フォームに入力されたデータを送信し、確認フォームに処理内容を読み込み表示 //
//------------------------------------------------------------------------------//
function submitProfileInsertForm() {
	// エラーを非表示
	$('#insert-error').hide();
	clearTimeout(timer_insert);
	timer_insert = 0;
	// 入力項目のチェック
	if(	$('#i_name')[0].value == '' || $('#i_rubi')[0].value == '' || $('#i_age')[0].value == '' || $('#i_tall')[0].value == '' || $('#i_weight')[0].value == '' || $('#i_bust')[0].value == '' || $('#i_west')[0].value == '' || $('#i_hip')[0].value == '' || $('#i_month')[0].value == '' || $('#i_day')[0].value == '' || $('#i_star')[0].value == '' || $('#i_from')[0].value == '' || $('#i_hobby')[0].value == '' ) {
		$('#insert-error').fadeIn(200);
		timer_insert = setTimeout("$('#insert-error').fadeOut(200)",2000);	
		return false;
	}
	// データを送信
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'dataPrint',
			mode: 'p_insert',
			type: $('#i_type')[0].value,
			rare: $('#i_rare')[0].value,
			trainer: $('#i_trainer')[0].checked,
			name: $('#i_name')[0].value,
			rubi: $('#i_rubi')[0].value,
			age: $('#i_age')[0].value,
			tall: $('#i_tall')[0].value,
			weight: $('#i_weight')[0].value,
			bust: $('#i_bust')[0].value,
			west: $('#i_west')[0].value,
			hip: $('#i_hip')[0].value,
			month: $('#i_month')[0].value,
			day: $('#i_day')[0].value,
			star: $('#i_star')[0].value,
			blood: $('#i_blood')[0].value,
			hand: $('#i_hand')[0].value,
			from: $('#i_from')[0].value,
			hobby: $('#i_hobby')[0].value
		},
		async: false,
		success: function(data) {
			// 抽出したHTMLを読み込み
			$('#submit-load').html(data);
			// 確認フォームを表示
			setCenter('#submitForm');
			$('#shadow').fadeIn(200);
			$('#submitForm').fadeIn(200);
		}
	});
	return false;
}

//------------------------------------------------------------------------------//
// プロフィール編集フォーム送信                                                 //
//------------------------------------------------------------------------------//
// 編集フォームに入力されたデータを送信し、確認フォームに処理内容を読み込み表示 //
//------------------------------------------------------------------------------//
function submitProfileUpdateForm() {
	// エラーを非表示
	clearTimeout(timer_update);
	timer_update = 0;
	$("#update-error1").hide();
	$("#update-error2").hide();
	$("#update-error3").hide();
	// 選択アイドルのチェック
	if( row == null ) {
		$("#update-error1").fadeIn(200);
		timer_update = setTimeout( "$('#update-error1').fadeOut(200)", 2000 );
		return false;
	}
	// 入力必須項目のチェック
	var flg = true;
	if(	$("#u_id")[0].value == "" || $("#u_name")[0].value == "" || $("#u_rubi")[0].value == "" || $("#u_age")[0].value == "" || $("#u_tall")[0].value == "" || $("#u_weight")[0].value == "" || $("#u_bust")[0].value == "" || $("#u_west")[0].value == "" || $("#u_hip")[0].value == "" || $("#u_month")[0].value == "" || $("#u_day")[0].value == "" || $("#u_star")[0].value == "" || $("#u_from")[0].value == "" || $("#u_hobby")[0].value == "" ) {
		$("#update-error2").fadeIn(200);
		timer_update = setTimeout( "$('#update-error2').fadeOut(200)", 2000 );
		return false;
	}
	// 変更箇所をチェック
	var flg = false;
	flg += $('#u_id')[0].value != row.cells[0].firstChild.data;
	flg += $('#u_type')[0].value != row.id;
	flg += $('#u_name')[0].value != row.cells[1].firstChild.data;
	flg += $('#u_rubi')[0].value != row.cells[2].firstChild.data;
	flg += $('#u_age')[0].value != row.cells[3].firstChild.data;
	flg += $('#u_tall')[0].value != row.cells[4].firstChild.data;
	flg += $('#u_weight')[0].value != row.cells[5].firstChild.data;
	var size = row.cells[6].firstChild.data.split('-');
	flg += $('#u_bust')[0].value != size[0];
	flg += $('#u_west')[0].value != size[1];
	flg += $('#u_hip')[0].value != size[2];
	var birthday = row.cells[7].firstChild.data;
	flg += $('#u_month')[0].value != birthday.substring( 0, birthday.indexOf('月') );
	flg += $('#u_day')[0].value != birthday.substring( birthday.indexOf('月')+1, birthday.indexOf('日') );
	flg += $('#u_star')[0].value != row.cells[8].firstChild.data;
	flg += $('#u_blood')[0].value != row.cells[9].firstChild.data;
	flg += $('#u_hand')[0].value != row.cells[10].firstChild.data;
	flg += $('#u_from')[0].value != row.cells[11].firstChild.data;
	flg += $('#u_hobby')[0].value != row.cells[12].firstChild.data;
	if( flg == false ) {
		$("#update-error3").fadeIn(200);
		timer_update = setTimeout( "$('#update-error3').fadeOut(200)", 2000 );
		return false;
	}
	// データを送信
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'dataPrint',
			mode: 'p_update',
			idol: $('#u_idol')[0].innerHTML,
			id: $('#u_id')[0].value,
			type: $('#u_type')[0].value,
			name: $('#u_name')[0].value,
			rubi: $('#u_rubi')[0].value,
			age: $('#u_age')[0].value,
			tall: $('#u_tall')[0].value,
			weight: $('#u_weight')[0].value,
			bust: $('#u_bust')[0].value,
			west: $('#u_west')[0].value,
			hip: $('#u_hip')[0].value,
			month: $('#u_month')[0].value,
			day: $('#u_day')[0].value,
			star: $('#u_star')[0].value,
			blood: $('#u_blood')[0].value,
			hand: $('#u_hand')[0].value,
			from: $('#u_from')[0].value,
			hobby: $('#u_hobby')[0].value,
		},
		async: false,
		success: function(data) {
			// 抽出したHTMLを読み込み
			$('#submit-load').html(data);
			// 確認フォームを表示
			setCenter('#submitForm');
			$('#shadow').fadeIn(200);
			$('#submitForm').fadeIn(200);
		}
	});
	return false;
}

//----------------------------------------------------------------------//
// プロフィール削除フォーム送信                                         //
//----------------------------------------------------------------------//
// 削除するアイドルの名前を送信し、確認フォームに処理内容を読み込み表示 //
//----------------------------------------------------------------------//
function submitProfileDeleteForm() {
	// エラーを非表示
	clearTimeout(timer_update);
	timer_update = 0;
	$('#update-error1').hide();
	$('#update-error2').hide();
	$("#update-error3").hide();
	// 選択アイドルのチェック
	if( row == null ) {
		$('#update-error1').fadeIn(200);
		timer_update = setTimeout( "$('#update-error1').fadeOut(200)", 2000 );
		return false;
	}
	// データを送信してページ読み込み
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'dataPrint',
			mode: 'p_delete',
			idol: $('#u_idol')[0].innerHTML
		},
		async: false,
		success: function(data) {
			// 抽出したHTMLを読み込み
			$('#submit-load').html(data);
			// 確認フォームを表示
			setCenter('#submitForm');
			$('#shadow').fadeIn(200);
			$('#submitForm').fadeIn(200);
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

//----------------------------------//
// プロフィール編集フォームリセット //
//----------------------------------//
// 編集フォームの内容を初期化       //
//----------------------------------//
function resetProfileUpdateForm() {
	// アイドルが選択されていればフォームに現在のステータスを格納
	// 選択されていなければフォームを初期化
	if( row == null ) {
		$("#u_idol")[0].innerHTML = "なし";
		$("#u_id")[0].value = "";
		$("#u_name")[0].value = "";
		$("#u_type")[0].selectedIndex = 0;
		$("#u_rubi")[0].value = "";
		$("#u_age")[0].value = "";
		$("#u_tall")[0].value = "";
		$("#u_weight")[0].value = "";
		$("#u_bust")[0].value = "";
		$("#u_west")[0].value = "";
		$("#u_hip")[0].value = "";
		$("#u_month")[0].value = "";
		$("#u_day")[0].value = "";
		$("#u_star")[0].value = "";
		$("#u_blood")[0].selectedIndex = 0;
		$("#u_hand")[0].selectedIndex = 0;
		$("#u_from")[0].value = "";
		$("#u_hobby")[0].value = "";
	} else {
		// 行に格納されているデータを編集フォームに設定
		$("#u_idol")[0].innerHTML = row.cells[1].firstChild.data;
		$("#u_id")[0].value = row.cells[0].firstChild.data;
		$("#u_name")[0].value = row.cells[1].firstChild.data;
		for( var i=0; i<$("#u_type")[0].options.length; i++ ) {
			if( $("#u_type")[0].options[i].value == row.id )
				$("#u_type")[0].selectedIndex = i;
		}
		$("#u_rubi")[0].value = row.cells[2].firstChild.data;
		$("#u_age")[0].value = row.cells[3].firstChild.data;
		$("#u_tall")[0].value = row.cells[4].firstChild.data;
		$("#u_weight")[0].value = row.cells[5].firstChild.data;
		var size = row.cells[6].firstChild.data.split('-');
		$("#u_bust")[0].value = size[0];
		$("#u_west")[0].value = size[1];
		$("#u_hip")[0].value = size[2];
		var birthday = row.cells[7].firstChild.data;
		$("#u_month")[0].value = birthday.substring( 0, birthday.indexOf('月') );
		$("#u_day")[0].value = birthday.substring( birthday.indexOf('月')+1, birthday.indexOf('日') );
		$("#u_star")[0].value = row.cells[8].firstChild.data;
		for( var i=0; i<$("#u_blood")[0].options.length; i++ ) {
			if( $("#u_blood")[0].options[i].value == row.cells[9].firstChild.data )
				$("#u_blood")[0].selectedIndex = i;
		}
		for( var i=0; i<$("#u_hand")[0].options.length; i++ ) {
			if( $("#u_hand")[0].options[i].value == row.cells[10].firstChild.data )
				$("#u_hand")[0].selectedIndex = i;
		}
		$("#u_from")[0].value = row.cells[11].firstChild.data;
		$("#u_hobby")[0].value = row.cells[12].firstChild.data;
	}
}

//------------------------------------------//
// 確認フォームデータ送信                   //
//------------------------------------------//
// 処理内容を送信し、処理結果を読み込み表示 //
//------------------------------------------//
function submitQueryForm() {
	// データを送信
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'resultPrint',
			query: $('#query')[0].value
		},
		async : false,
		success: function(data) {
			// 抽出したHTMLを読み込み
			$('#result-load').html(data);
			// 結果フォームをセンタリング
			// setCenter('#resultForm');
			// 確認フォームを非表示
			// $('#submitForm').fadeOut(200);
			$('#submitForm').modal('hide');
			// 結果フォームを表示
			// $('#resultForm').fadeIn(200);
			$('#resultForm').modal({backdrop:"static"});
		}
	});
	// データ一覧を再読み込みし、編集フォームをリセット
	removeData();
	if( $('#query')[0].value.indexOf('STATUS') > 0 ) {
		submitIdolSearchForm();
		resetIdolUpdateForm();
	}
	if( $('#query')[0].value.indexOf('PROFILE') > 0 ) {
		submitProfileSearchForm();
		resetProfileUpdateForm();
	}
	return false;
}

//--------------------------------------------------------------------//
// 最大レベル・最大親愛度自動設定                                     //
//--------------------------------------------------------------------//
// レア度と親愛度が変更される度に最大レベルと最大親愛度を自動入力する //
//--------------------------------------------------------------------//
// mode : フォームのタイプ（i：追加　u：編集）                        //
//--------------------------------------------------------------------//
function setMax(mode) {
	// 編集モードの場合、アイドルが選択されていなければ処理を中断
	if( mode == 'u' && row == null )
		return;
	// レア度別に一般的な最大レベル・最大親愛度を設定
	switch( $("#"+mode+"_rare")[0].value ) {
		// ノーマルの場合
		case "N" :
			if( !$("#"+mode+"_plus")[0].checked ) {
				$("#"+mode+"_max_lv")[0].value = "20";
				$("#"+mode+"_max_love")[0].value = "20";
			} else {
				$("#"+mode+"_max_lv")[0].value = "30";
				$("#"+mode+"_max_love")[0].value = "100";
			}
			break;
		// レアの場合
		case "R" :
			if( !$("#"+mode+"_plus")[0].checked ) {
				$("#"+mode+"_max_lv")[0].value = "40";
				$("#"+mode+"_max_love")[0].value = "30";
			} else {
				$("#"+mode+"_max_lv")[0].value = "50";
				$("#"+mode+"_max_love")[0].value = "150";
			}
			break;
		// Ｓレアの場合
		case "SR":
			if( !$("#"+mode+"_plus")[0].checked ) {
				$("#"+mode+"_max_lv")[0].value = "60";
				$("#"+mode+"_max_love")[0].value = "40";
			} else {
				$("#"+mode+"_max_lv")[0].value = "70";
				$("#"+mode+"_max_love")[0].value = "300";
			}
			break;
	}
}

//----------------------------------//
// アイドルデータ選択               //
//----------------------------------//
// クリックされた行を選択状態にする //
//----------------------------------//
// row : 行要素                     //
//----------------------------------//
function selectIdol(row) {
	// 選択済みの行を選択した場合は選択解除して中断
	if( row.className.indexOf("selected") >= 0 ) {
		$(row).removeClass('selected');
		return;
	}
	// 選択済みの行の選択を解除
	$(row).parent().children('.selected').removeClass('selected');
	// 選択された行にselectedクラスを追加
	$(row).addClass('selected');
}

//--------------------------------------//
// 編集対象アイドル設定                 //
//--------------------------------------//
// 現在選択されている行を変数に格納する //
//--------------------------------------//
function setData() {
	// 行が選択されていなければ中断
	if( $('.selected').length == 0 )
		return;
	// 現在選択されている行を格納
	row = $('.selected')[0];
	// フォームを有効化
	$('#update-form input, #update-form select').removeAttr("disabled");
	// フォームの内容をリセット
	resetIdolUpdateForm();
}

//--------------------------------------//
// 編集対象アイドル解除                 //
//--------------------------------------//
// 現在変数に格納されている行を破棄する //
//--------------------------------------//
function removeData() {
	// 選択中のアイドルを解除
	row = null;
	// フォームを無効化
	$('#update-form input, #update-form select').attr("disabled", "disabled");
	// フォームの内容をリセット
	resetIdolUpdateForm();
}

//----------------------------------------------------------------------------------------//
// アイドル登録フォーム送信                                                               //
//----------------------------------------------------------------------------------------//
// フォームに入力されているデータを送信し、検索結果が格納されたセレクトボックスを読み込む //
//----------------------------------------------------------------------------------------//
function submitIdolAdmitForm() {
	// 検索ボタンを使用不可にする
	$("#checker-search")[0].disable = "true";
	// データを送信してページ読み込み
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'selectableIdol',
			type : $("#ch_type")[0].value,
			rare : $("#ch_rare")[0].value,
			cost : $("#ch_cost")[0].value,
			name : $("#ch_name")[0].value
		},
		success: function(data) {
			// 抽出したHTMLを読み込み
			$('#ch_idol').html(data);
		},
		async: false
	});
	// 検索ボタンを使用可にする
	$("#checker-search")[0].disable = "";
	return false;
}

//------------------------------//
// アイドル登録フォームリセット //
//------------------------------//
// フォームの内容を初期化       //
//------------------------------//
function resetIdolAdmitForm() {
	// フォームの内容を初期化
	$("#ch_type")[0].selectedIndex = 0;
	$("#ch_rare")[0].selectedIndex = 0;
	$("#ch_cost")[0].selectedIndex = 0;
	$("#ch_name")[0].value = "";
	// 初期化された状態で再検索
	submitIdolAdmitForm();
}

//----------------------------------------------------------//
// アイドル登録                                             //
//----------------------------------------------------------//
// 選択されているアイドルを送信し、バックメンバーに登録する //
//----------------------------------------------------------//
function admitMember() {
	// 選択されているアイドルをメンバーに登録する
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'admitIdol',
			id: $('#ch_idol')[0].value
		},
		async: false
	});
	// メンバーを再表示
	usersIdol();
	return false;
}

//----------------------------------------------------//
// アイドル削除                                       //
//----------------------------------------------------//
// 選択されているデータを送信し、メンバーから削除する //
//----------------------------------------------------//
function removeMember() {
	// アイドルが選択されていない場合は処理を中断
	if( $('.selected')[0] == null )	return;
	// 選択されているアイドルをメンバーから削除する
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'removeIdol',
			no: $('.selected')[0].cells[0].firstChild.data
		},
		async: false
	});
	// メンバーを再表示
	usersIdol();
	return false;
}

//----------------------------------------------------------------------------------------------------//
// 登録済みアイドル一覧表示                                                                           //
//----------------------------------------------------------------------------------------------------//
// フロントメンバー、攻コス比順バックメンバー、守コス比順バックメンバー、予想発揮値をそれぞれ読み込む //
//----------------------------------------------------------------------------------------------------//
function usersIdol() {
	// フロントメンバーを表示
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'usersIdol(front)'
		},
		async: false,
		success: function(data) {
			$('#front-load').html(data);
		}
	});
	// 攻コス比順バックメンバーを表示
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'usersIdol(back)',
			order: 'ATK'
		},
		async: false,
		success: function(data) {
			$('#back-load-atk').html(data);
		}
	});
	// 守コス比順バックメンバーを表示
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'usersIdol(back)',
			order: 'DEF'
		},
		async: false,
		success: function(data) {
			$('#back-load-def').html(data);
		}
	});
	// 総発揮値計算
	calcActualPower();
}

//------------------------------------------------------------//
// フロントメンバー追加                                       //
//------------------------------------------------------------//
// 選択されたデータをバックメンバーからフロントメンバーへ移動 //
//------------------------------------------------------------//
function addFront() {
	// アイドルが選択されていない場合は処理を中断
	if( $('.selected')[0] == null )	return;
	// 選択されているアイドルをフロントメンバーに追加
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'addFront',
			no: $('.selected')[0].cells[0].firstChild.data
		},
		async: false
	});
	// メンバーを再表示
	usersIdol();
}

//------------------------------------------------------------//
// フロントメンバー解除                                       //
//------------------------------------------------------------//
// 選択されたデータをフロントメンバーからバックメンバーへ移動 //
//------------------------------------------------------------//
function removeFront() {
	// アイドルが選択されていない場合は処理を中断
	if( $('.selected')[0] == null )	return;
	// 選択されているアイドルをフロントメンバーから解除
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'removeFront',
			no: $('.selected')[0].cells[0].firstChild.data
		},
		async: false
	});
	// メンバーを再表示
	usersIdol();
}

//--------------------------------------------------//
// フロントメンバー位置交換                         //
//--------------------------------------------------//
// 選択されたフロントメンバーを一段上と位置交換する //
//--------------------------------------------------//
function swapFront() {
	// アイドルが選択されていない場合は処理を中断
	if( $('.selected')[0] == null )	return;
	// 選択されているフロントメンバーを一段上に移動
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'swapFront',
			no: $('.selected')[0].cells[0].firstChild.data
		},
		async: false
	});
	// メンバーを再表示
	usersIdol();
}

//--------------------------------------------//
// コスト情報設定                             //
//--------------------------------------------//
// 入力されたデータを送信し、コストに設定する //
//--------------------------------------------//
function setCost() {
	// エラーを非表示
	clearTimeout(timer_option);
	timer_option = 0;
	$('#option-error1').hide();
	$('#option-error2').hide();
	// 入力項目のチェック
	if( !$('#atk_cost')[0].value.match(/^-?[0-9]+$/) || !$('#def_cost')[0].value.match(/^-?[0-9]+$/) ) {
		$('#option-error1').fadeIn(200);
		timer_option = setTimeout("$('#option-error1').fadeOut(200);",2000);
		return false;
	}
	// 入力されている数値をコストに設定
	$.ajax({
		type: 'POST',
		url: 'function.php',
		async: false,
		data: {
			function: 'updateUserData',
			column: 'atk_cost',
			value: $('#atk_cost')[0].value
		},
	});
	$.ajax({
		type: 'POST',
		url: 'function.php',
		async: false,
		data: {
			function: 'updateUserData',
			column: 'def_cost',
			value: $('#def_cost')[0].value
		},
	});
	// メンバーを再表示
	usersIdol();
	// 設定の完了メッセージを表示
	$('#option-error2').fadeIn(200);
	timer_option = setTimeout("$('#option-error2').fadeOut(200);",2000);
	return false;
}

//--------------------------------------------//
// 発揮値合計表示                             //
//--------------------------------------------//
// 表に表示されている発揮値を合計した値を表示 //
//--------------------------------------------//
function calcActualPower() {
	// 変数を宣言
	var atk = 0, def = 0;
	// フロントメンバーの発揮値を加算
	var table = $('table#front')[0];
	for(var i=1; i<table.rows.length; i++) {
		atk += new Number(table.rows[i].cells[6].firstChild.data);
		def += new Number(table.rows[i].cells[7].firstChild.data);
	}
	// バックメンバーの発揮値を加算
	if( $('#order')[0].value == "ATK" )		table = $('table#back')[0];
	else									table = $('table#back')[1];
	for(var i=1; i<table.rows.length; i++) {
		atk += new Number(table.rows[i].cells[6].firstChild.data);
		def += new Number(table.rows[i].cells[7].firstChild.data);
	}
	// ページに表示
	$('span#actual_atk')[0].innerHTML = atk;
	$('span#actual_def')[0].innerHTML = def;
	// アイドルの選別
	sortOutIdol();
}

//--------------------------------------------------------------------//
// アイドル選別                                                       //
//--------------------------------------------------------------------//
// コスト不足でバトルに参加できていないアイドルのデータ行を灰色で表示 //
//--------------------------------------------------------------------//
function sortOutIdol() {
	// 攻守共に発揮値が０のフロントメンバーのIDを変更
	var table = $('table#front')[0];
	for(var i=1; i<table.rows.length; i++) {
		if( table.rows[i].cells[6].firstChild.data == "0" &&
			table.rows[i].cells[7].firstChild.data == "0"	 )
			table.rows[i].id = "out";
	}
	// 攻守共に発揮値が０の攻コス比順バックメンバーのNOを格納
	var nos = new Array();
	table = $('table#back')[0];
	for(var i=1; i<table.rows.length; i++) {
		if( table.rows[i].cells[6].firstChild.data == "0" &&
			table.rows[i].cells[7].firstChild.data == "0"	 )
			nos.push( table.rows[i].cells[0].firstChild.data );
	}
	// 配列に格納されたNOのバックメンバーが守コス比順でも攻守共に発揮値が０ならIDを変更し、更にNOを格納
	var nos2 = new Array();
	table = $('table#back')[1];
	for(var n=0; n<nos.length; n++) {
		for(var i=1; i<table.rows.length; i++) {
			if( nos[n] == table.rows[i].cells[0].firstChild.data &&
				table.rows[i].cells[6].firstChild.data == "0" &&
				table.rows[i].cells[7].firstChild.data == "0"	 ) {
				table.rows[i].id = "out";
				nos2.push( table.rows[i].cells[0].firstChild.data );
			}
		}
	}
	// 更に格納されたNOのバックメンバーのIDを変更
	table = $('table#back')[0];
	for(var n=0; n<nos2.length; n++) {
		for(var i=1; i<table.rows.length; i++) {
			if( nos2[n] == table.rows[i].cells[0].firstChild.data )
				table.rows[i].id = "out";
		}
	}
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

//------------------------------------------------------------------//
// ユーザー登録フォーム送信                                         //
//------------------------------------------------------------------//
// フォームに入力されたデータを送信し、ユーザー登録とログインをする //
//------------------------------------------------------------------//
function addUserFormSubmit() {
	// エラーを非表示
	clearTimeout(timer_user);
	timer_user = 0;
	$("#add-error1").hide();
	$("#add-error2").hide();
	// 入力項目のチェック
	var ul = $('#a_user')[0].value.length;
	var pl = $('#a_password')[0].value.length;
	if( !(4 <= ul && ul <= 12 && 6 <= pl && pl <= 20) ) {
		$("#add-error1").fadeIn(200);
		timer_user = setTimeout( "$('#add-error1').fadeOut(200)", 2000 );
		return false;
	}
	// フォーム内のデータを送信
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'addUser',
			user: $('#a_user')[0].value,
			password: $('#a_password')[0].value
		},
		async: false,
		success: function(data) {
			if(data == 'TRUE') {
				// ユーザーの登録に成功した場合、テキストを表示
				var text = '<div id="span">ユーザーの登録が完了しました。</div>';
				text += '<button type="button" onclick="jump(' + "'index.php'" + ')">戻る</button>';
				$('#user-load').html(text);
			} else if(data == 'FALSE') {
				// ユーザーの登録に失敗した場合、エラーを表示
				$("#add-error2").fadeIn(200);
				timer_user = setTimeout( "$('#add-error2').fadeOut(200)", 2000 );
			}
		}
	});
	return false;
}

//----------------------------------------------------------------//
// ユーザー削除フォーム送信                                       //
//----------------------------------------------------------------//
// フォームに入力されたデータを送信し、認証後にユーザーを削除する //
//----------------------------------------------------------------//
function deleteUserFormSubmit() {
	// エラーを非表示
	clearTimeout(timer_delete);
	timer_delete = 0;
	$('#delete-error').hide();
	$('#delete-error2').hide();
	// パスワードが入力されていることを確認
	if( $('#d_password')[0].value == '' || $('#d_password2')[0].value == '' ) {
		$('#delete-error2').fadeIn(200);
		timer_delete = setTimeout( "$('#delete-error2').fadeOut(200)", 2000 );
		return false;
	}
	// 入力されたパスワード同士が一致していることを確認
	if( !($('#d_password')[0].value == $('#d_password2')[0].value) ) {
		$('#delete-error').fadeIn(200);
		timer_delete = setTimeout( "$('#delete-error').fadeOut(200)", 2000 );
		return false;
	}
	// データを送信
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'deleteUser',
			password: $('#d_password')[0].value
		},
		async: false,
		success: function(data) {
			if(data == 'TRUE') {
				// ユーザーの削除に成功した場合
				var text = '<div id="span">ユーザーの削除が完了しました。</div>';
				text += '<button type="button" onclick="jump(' + "'index.php'" + ')">戻る</button>';
				$('#delete-load').html(text);
			} else if(data == 'FALSE') {
				// ユーザーの削除に失敗した場合
				$('#delete-error').fadeIn(200);
				timer_delete = setTimeout( "$('#delete-error').fadeOut(200)", 2000 );
			}
		}
	});
	return false;
}

//--------------------------------------------------------------------//
// 最大値計算                                                         //
//--------------------------------------------------------------------//
// 入力された特訓前の初期値を基に、特訓前もしくは特訓後の最大値を算出 //
//--------------------------------------------------------------------//
// form : フォームのタイプ（i：追加　u：編集）                        //
//--------------------------------------------------------------------//
function calcMax(form) {
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
	// 入力された数値・計算式を取得
	try {
		var atk = eval($('#'+form+'_atk')[0].value);
		var def = eval($('#'+form+'_def')[0].value);
		if(atk == undefined || def == undefined)
			throw null;
	}
	// 異常な値が入力された場合
	catch(e) {
		switch(form) {
			case 'i':
				$('#calc-error').fadeIn(200);
				timer_insert = setTimeout( "$('#calc-error').fadeOut(200)", 2000 );
				break;
			case 'u':
				$('#calc-error2').fadeIn(200);
				timer_update = setTimeout( "$('#calc-error2').fadeOut(200)", 2000 );
				break;
		}
		return false;
	}
	// ＋にチェックがされているか取得
	var ch = $('#'+form+'_plus')[0].checked;
	// 特訓前か特訓後か分岐
	if(ch) {
		// 特訓後の最大値を計算
		var add = Math.round(atk*1.2+Math.round(atk*2.625)*0.2)%2;
		var matk = Math.round(atk*3.975)+add;
		add = Math.round(def*1.2+Math.round(def*2.625)*0.2)%2;
		var mdef = Math.round(def*3.975)+add;
		// 特訓前の初期値を特訓後の初期値に変換
		atk *= 1.2;
		def *= 1.2;
	} else {
		// 特訓前の最大値を計算
		var matk = Math.round(atk*2.625);
		var mdef = Math.round(def*2.625);
	}
	// フォームに計算結果を反映
	$('#'+form+'_atk')[0].value = atk;
	$('#'+form+'_def')[0].value = def;
	$('#'+form+'_max_atk')[0].value = matk;
	$('#'+form+'_max_def')[0].value = mdef;
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

//---------------------------------------//
// ウィンドウのセンタリング              //
//---------------------------------------//
// 要素のサイズを基に位置をセンタリング  //
//---------------------------------------//
// elm : センタリングする要素のidやclass //
//---------------------------------------//
function setCenter(elm) {
	var width = 0 - ($(elm).width() / 2);
	var height = 0 - ($(elm).height() / 2);
	$(elm)[0].style.marginTop = height;
	$(elm)[0].style.marginLeft = width;
}

//----------------------------------------//
// セッション格納                         //
//----------------------------------------//
// opt : セッションに格納するキーと値の組 //
//----------------------------------------//
function setSession( opts ) {
	// optからキーと値の配列をそれぞれ生成
	var keys = [], values = [];
	for( var key in opts ) {
		keys.push( key );
		values.push( opts[key] );
	}
	// 生成された配列をPHPに送信してセッションに登録
	$.ajax({
		type: 'POST',
		url: 'function.php',
		data: {
			function: 'setSession',
			keys: keys,
			values: values
		},
		async: false,
		success: function(data) {
			
		}
	});
}

//---------------------------------------------//
// EnterキーでチェックボックスのON/OFF切り替え //
//---------------------------------------------//
function checkEnter(event) {
	if(event.keyCode == 13) {
		//event.srcElement.checked = !event.srcElement.checked;
		$(event.srcElement).click();
		return false;
	}
	return true;
}

//----------------------------------------------------------------------------//
// フォーカスアウト時にテキストフィールドの計算式を実行し、結果を値に設定する //
//----------------------------------------------------------------------------//
function onBlurFormat(elm) {
	var value = eval(elm.value);
	if(value != undefined) {
		elm.value = Math.round(value);
	}
}

//------------------------//
// 半角→全角変換         //
//------------------------//
// str : 変換対象の文字列 //
//------------------------//
function convert(str) {
	var array = [
		[
			"ｳﾞ", 
			"ｶﾞ", "ｷﾞ", "ｸﾞ", "ｹﾞ", "ｺﾞ", 
			"ｻﾞ", "ｼﾞ", "ｽﾞ", "ｾﾞ", "ｿﾞ", 
			"ﾀﾞ", "ﾁﾞ", "ﾂﾞ", "ﾃﾞ", "ﾄﾞ", 
			"ﾊﾞ", "ﾋﾞ", "ﾌﾞ", "ﾍﾞ", "ﾎﾞ",
			"ﾊﾟ", "ﾋﾟ", "ﾌﾟ", "ﾍﾟ", "ﾎﾟ",
			"ｱ", "ｲ", "ｳ", "ｴ", "ｵ",
			"ｶ", "ｷ", "ｸ", "ｹ", "ｺ",
			"ｻ", "ｼ", "ｽ", "ｾ", "ｿ",
			"ﾀ", "ﾁ", "ﾂ", "ﾃ", "ﾄ",
			"ﾅ", "ﾆ", "ﾇ", "ﾈ", "ﾉ",
			"ﾊ", "ﾋ", "ﾌ", "ﾍ", "ﾎ",
			"ﾏ", "ﾐ", "ﾑ", "ﾒ", "ﾓ",
			"ﾔ", "ﾕ", "ﾖ",
			"ﾗ", "ﾘ", "ﾙ", "ﾚ", "ﾛ",
			"ﾜ", "ｦ", "ﾝ",
			"ｧ", "ｨ", "ｩ", "ｪ", "ｫ", "ｯ", "ｬ", "ｭ", "ｮ",
			"･", "ｰ", "+", "!", "?", "[", "]"
		],
		[
			"ヴ", 
			"ガ", "ギ", "グ", "ゲ", "ゴ", 
			"ザ", "ジ", "ズ", "ゼ", "ゾ", 
			"ダ", "ヂ", "ヅ", "デ", "ド", 
			"バ", "ビ", "ブ", "ベ", "ボ",
			"パ", "ピ", "プ", "ペ", "ポ",
			"ア", "イ", "ウ", "エ", "オ",
			"カ", "キ", "ク", "ケ", "コ",
			"サ", "シ", "ス", "セ", "ソ",
			"タ", "チ", "ツ", "テ", "ト",
			"ナ", "ニ", "ヌ", "ネ", "ノ",
			"ハ", "ヒ", "フ", "ヘ", "ホ",
			"マ", "ミ", "ム", "メ", "モ",
			"ヤ", "ユ", "ヨ",
			"ラ", "リ", "ル", "レ", "ロ",
			"ワ", "ヲ", "ン",
			"ァ", "ィ", "ゥ", "ェ", "ォ", "ッ", "ャ", "ュ", "ョ",
			"・", "ー", "＋", "！", "？", "［", "］"
		]
	];
	var length = array[0].length;
	for(var i=0; i<length; i++) {
		while(str.indexOf(array[0][i]) != -1)
			str = str.replace(array[0][i], array[1][i]);
	}
	return str;
}

//----------//
// ツイート //
//----------//
function tweet() {
	// 行が選択されていなければ警告を表示
	if( $('.selected')[0] == null )	{
		alert('データが選択されていません');
		return;
	}
	
	// 選択中データ取得
	var data = $('.selected')[0];
	var param = {}; 
	param.name = data.cells[4].firstChild.innerText;
	param.rare = data.cells[3].firstChild.data;
	param.cost = data.cells[5].firstChild.data;
	param.atk = data.cells[8].firstChild.data;
	param.def = data.cells[9].firstChild.data;
	param.s_name = data.cells[12].firstChild.data;
	if(data.cells[13].firstChild != null) {
		param.s_effect = effectToShort(data.cells[13].firstChild.data);
	} else {
		param.s_effect = "なし";
	}
	if(param.rare === "SR" || param.rare === "SR+") {
		param.image = 'http://125.6.169.35/idolmaster/image_sp/card_sign_p/l/' + data.cells[18].firstChild.data + '.jpg';
	} else {
		param.image = 'http://125.6.169.35/idolmaster/image_sp/card/l/' + data.cells[18].firstChild.data + '.jpg';
	}
	
	// 確認ダイアログ表示
	if ( !confirm(param.name + " をツイートしますか？") ) {
		return;
	}
	
	// ツイート用PHPにPOST
	$.ajax({
		type: 'POST',
		url: 'http://localhost/api/tweet.php',
		async: false,
		data: {
			data: param
		},
		success: function(data) {
			console.log(data);
			if(data === "200") {
				alert("ツイートが完了しました");
			} else {
				alert("ツイートに失敗しました");
			}
		}
	});
}

//------------------//
// 画像ダウンロード //
//------------------//
function download() {
	if (!confirm("検索結果の画像データを一括ダウンロードしますか？")) {
		return;
	}
	var func = function() {
		// ダウンローダー表示
		var row = $('#tableArea tr');
		var count = 0;
		var max_count = (row.length-1) * 3;
		$('#dw-max-count')[0].innerText = max_count;
		$('#dw-message')[0].innerText = '圧縮ファイル作成中...';
		$('div#downloader').fadeIn(500);
		// zip生成
		var zip = new JSZip();
		// フォルダ作成
		var folder = ['大サイズ', '中サイズ', '小サイズ'];
		for(var i=0; i<folder.length; i++) {
			zip.folder(folder[i]);
		}
		// 表示されているデータ件数分ループ
		
		for(var i=1; i<row.length; i++) {
			// 列からデータを取得
			var name = row[i].cells[4].innerText;
			var hash = row[i].cells[18].innerText;
			var src = [
				URL + 'l/' + hash + '.jpg',
				URL + 'ls/' + hash + '.jpg',
				URL + 'xs/' + hash + '.jpg'
			];
			// 画像をPHP経由でbase64エンコードした後、zipに追加
			for(var j=0; j<src.length; j++) {
				$.ajax({
					type: 'POST',
					url: 'http://localhost/api/image.php',
					async: true,
					data: {
						name: folder[j] + '/' + name,
						image: src[j]
					},
					success: function(data) {
						var json = JSON.parse(data);
						if(json.data === "") {
							console.error(json.name + ":failed.");
							$.ajax(this);
							return;
						}
						zip.file(json.name + '.jpg', json.data, {base64:true});
						console.debug(json.name + ":succeed.");
						$('#dw-count')[0].innerText = ++count;
						console.debug(parseFloat(count) / max_count);
						$('#dw-progress-inner')[0].style.width = (270 * (parseFloat(count) / max_count)) + 'px';
					}
				});
			}
		}
		// zipダウンロード
		var timer_id = setInterval(function() {
			if(count == max_count) {
				console.debug(zip);
				var content = zip.generate({type:'blob'});
				$('#dw-message')[0].innerText = '圧縮ファイル作成完了';
				console.debug("generated.");
				saveAs(content, 'images.zip');
				$('div#downloader').fadeOut(500);
				clearInterval(timer_id);
			}
		}, 500);
	};
	// 非同期化
	var fetch = function() {
		return new Promise(function(resolve) {
			resolve();
		});
	};
	fetch().then(func);
}

//------------------------//
// 特技効果文字列短縮     //
//------------------------//
// str : 短縮対象の文字列 //
//------------------------//
function effectToShort(text) {
	var params = new Array();
	params[0] = { before:"ｷｭｰﾄ", after:"Cu" };
	params[1] = { before:"ｸｰﾙ", after:"Co" };
	params[2] = { before:"ﾊﾟｯｼｮﾝ", after:"Pa" };
	params[3] = { before:"ﾀｲﾌﾟ", after:"" };
	params[4] = { before:"ﾒﾝﾊﾞｰ", after:"" };
	params[5] = { before:"ﾒﾝﾊﾞｰ", after:"" };
	params[6] = { before:"及び", after:"･" };
	params[7] = { before:"ﾗﾝﾀﾞﾑで", after:"" };
	params[8] = { before:"全", after:"全ﾀｲﾌﾟ" };
	
	for(var i=0; i<params.length; i++) {
		text = text.replace(params[i].before, params[i].after);
	}
	
	return text;
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
