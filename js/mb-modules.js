// JavaScript Document

/*======================================================
モーダルウィンド表示 PC、SP共通
======================================================*/
//$(window).load(function() {
$(function() {
	
	function Modal() {
		this.initialize();
	};
	
	Modal.prototype.initialize = function() {
		this._ua = window.navigator.userAgent;
		this.device = $("#modal-module").data("device");
		this.env = $("#modal-module").data("env");
		this.today = new Date();
				
		//this.prefix = "https://www.modern-blue.com/mb/elements/banner/";
		//this.prefix = "./";
		
		this.el = $('body');
		
		this.$close = $("#overlay, .close");
		//this.$parents = this.$el.parents("ul");
		this.$window = $(window);
		
		this.prefix = this.checkEnv(this.env);
		this.handleEvents();
	};
	
	Modal.prototype.handleEvents = function() {
		var self = this;
		//$(document).on("click", "#overlay, .close", function() {//読み込み後生成された要素
		$(document).on("click", ".close", function() {//読み込み後生成された要素
			self.hide();
			return false;
		});
		
		this.$window.on("load resize", function() {
			self.resize();
		});
	};
	
	Modal.prototype.checkEnv = function(env) {
		if (env == "local") {
			return "./";
		} else {
			return "https://www.modern-blue.com/mb/elements/btmbnr/";
		}
	};
	
	Modal.prototype.hide = function() {
		//console.log("hide!!");
		$('#overlay, #modalWindow').fadeOut();
	};
	
	/*Modal.prototype.fixPos = function() {
		var w = $(window).width();
		var h = $(window).height();
		
		var cw = $('#modalWindow').outerWidth();
		var ch = $('#modalWindow').outerHeight();
		
		$('#modalWindow').css({
			'left': ((w - cw) / 2) + 'px',
			'top': ((h - ch) / 2) + 'px'
		});
		
	};*/
	
	Modal.prototype.resize = function() {
		/*var w = this.$window.width();
		if(w < 640){
			this.$container.css({"width": "320","height":"213"});
		}else{
			this.$container.css({"width": "750","height":"500"});
		}*/
		
		/*modal.fixPos();*/
		//console.log("resize!!");
	};
	
	Modal.prototype.exe = function(data) {
		//console.log(data);
		csvObj = $.csv.toObjects(data);
		console.log(csvObj);//あとで消す
		
		$(csvObj).each(function(i) {// START
			var _self = this;
			
			if (modal._checkRows(_self)) {// フラグ、表示期間を判断し
				
				/*modal.end = _self.end;*/
				
				modal._setStyle(modal.device);
				modal._setOverlay(_self);
				
				// CSVループを抜ける
				return false;
			} else {
				//console.log("false..");
			}
		});// FIN...
	};
	
	Modal.prototype._checkRows = function(row) {// ループ内で呼び出し
		start = new Date(row.start);
		end = new Date(row.end);
		today = new Date(this.today);
		
		if ((row.flag && row.flag == 1) && (start && end) && (start < today && today < end)) {
			return true;
		} else {
			return false;
		}
	};
	
	Modal.prototype._checkCookies = function(row) {
		//console.log('クッキーをチェック');
		
		//if (!modal._getCookieExistence()) {
		if (modal._getCookieExistence()) {
			//console.log("not exist.");
			modal._setCookie();
			
			$("#contArea img").attr("src", modal.prefix + "image/" + row.name + "_" + modal.device + ".jpg");
			$('#overlay').fadeIn(500, "linear", function(){
				/*modal.fixPos();*/
				$('#contArea').fadeIn(500, "linear", /*modal.fixPos*/);
			});
			
			// 画像および文字のコンテンツ処理
			/*$(function(){
				modal._setLeadTxt(row.text);
				modal._setDataCounter();
			});*/
		}
	};
	
	Modal.prototype._setCookie = function() {
		$.cookie('modal', 'event', {expires: 1, path: '/'});
		
		//return true;
	};
	
	Modal.prototype._getCookieExistence = function() {
		return $.cookie("modal");
	};
	
	Modal.prototype._setStyle = function(device) {
		//console.log(device);
		var inlineStyle = `<style>
#overlay {
	position: fixed;
	display: none;
	width: 100%;
	bottom: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 990100;
}
`;

if (device == 'pc') {
	inlineStyle += `
#contArea {
	position: relative;
	width: 1000px;
	margin: 0 auto;
	padding: 10px 0;
}
#contArea img {
	vertical-align: bottom;
}
#contArea .close {
	position: absolute;
	display: block;
	background: #000;
	top: 20px;
	right: -20px;
	height: 40px;
	width: 40px;
	border-radius: 50%;
	color: #fff;
	font-size: 28px;
	line-height: 30px;
	text-align: center;
	cursor: pointer;
}
#contArea .close::after {
	content: "x";
	position: absolute;
	display: block;
	top: 0;
	left: 0;
	width: 100%;
	line-height: 36px;
	text-align: center;
}
#contArea a {
	display: block;
}
`;
} else if (device == 'sp') {
	inlineStyle += `
#contArea {
	position: relative;
	width: 100%;
	margin: 0 auto;
	padding: 0;
}
#contArea img {
	width: 100%;
	vertical-align: bottom;
}
#contArea .close {
	position: absolute;
	display: block;
	background: #000;
	top: 30px;
	right: 17px;
	height: 40px;
	width: 40px;
	border-radius: 50%;
	color: #fff;
	font-size: 28px;
	line-height: 30px;
	text-align: center;
	cursor: pointer;
}
#contArea .close::after {
	content: "x";
	position: absolute;
	display: block;
	top: 0;
	left: 0;
	width: 100%;
	line-height: 36px;
	text-align: center;
}
#contArea a {
	display: block;
}
`;

}

inlineStyle += `</style>`;
		
		$('head').append(inlineStyle);
	};
	
	Modal.prototype._checkUrl = function(url) {
		if (url.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/) == null) {
			return false;
		} else {
			return true;
		}
		
	}
	
	Modal.prototype._setOverlay = function(row) {
		
		//modal._checkUrl(row.link);
		
		var htmlTag = $(`<div id="overlay">
			<div id="contArea">
				<a href="${row.link}" target="_blank">
					<img src="https://placehold.jp/ffffff/ffffff/1x1.jpg?css=%7B%22opacity%22%3A%22%20.1%22%7D">
				</a>
				<span class="close"></span>
			</div>
		</div>`);
		
		// モーダル表示要素タグの設置
		$("body").append(htmlTag);
		
		// タグ設置完了後
		htmlTag.ready(function(){
			//console.log("ready..");
			
			var result = modal._checkCookies(row);
			//console.log(result);
		});
	};

	// インスタンス
	var modal = new Modal();
	
	// 
	(function() {
		$.ajax({
			url: modal.prefix + 'csv/btmbnr_list.csv',
			//type: 'POST',
			data: {
				//'userid': $('#userid').val(),
				//'passward': $('#passward').val()
			}
		})
		.done(function(data) {
			modal.exe(data);
			//console.log(data);
		})
		.fail(function() {
			//console.log(data);
		})
		.always(function() {
			//console.log("always");
		});
	})();

});

