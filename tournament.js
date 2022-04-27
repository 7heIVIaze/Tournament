function typechange(obj) { 
    let selectVal = $(obj).val(); 
    // 현재 id가 tournament인 select창이 선택하고 있는 값을 저장

    if(selectVal == 'single elimination') { // single elimination을 택했을 때 드러냄
        $("#3p_option").removeClass('hide');
        $("#list_single").removeClass('hide');
    }
    else { // 선택 안했다면 3위 결정전과 li태그 하나를 가림
        $("#3p_option").addClass('hide');
        $("#list_single").addClass('hide');
        $("#tournament_third_match").attr("checked", false);
    }

    if(selectVal == 'double elimination') { // double elimination을 택했을 때 드러냄
        $("#list_double").removeClass('hide');
    }
    else { // 선택 안했다면 li 태그 하나를 가림
        $("#list_double").addClass('hide');
    }

    if(selectVal == 'round robin') { // round robin을 택했을 때 드러냄
        $("#round_robin_iteration").removeClass('hide');
        $("#list_rr").removeClass('hide');
    }
    else {
        $("#round_robin_iteration").addClass('hide');
        $("#list_rr").addClass('hide');
    }
}

function participant(obj) {
    let selectVal = $(obj).val();

    if(selectVal == 'names') {
        $("#participants_row").removeClass('hide');
    }
    else {
        $("#participants_row").addClass('hide');
    }

    if(selectVal == 'size') {
        $("#bracket_size_row").removeClass('hide');
        $("#bracket_size").focus();
    }
    else {
        $("#bracket_size_row").addClass('hide');
    }
}

function build_tournament() {
    var type = $("#tournament_type").val();
    
    var name = $("#tournament_name").val();
    document.getElementById("name").innerHTML ='<div class="form-group"> <input type="reset" value="재생성" onclick="location.reload()"></div>' +"<h1 style=\"text-align: flex\">"+ name +"</h1>" ;
    if(type == 'round robin') {
        round_robin();
    }
    else if(type == 'double elimination') {
        dueltournament();
    }

    else {
        tournament();
    }
}

function round_robin() {
    let team_id = new Array();
    var text = '<table border="1" style="font-weight: center;">';
    let result = document.getElementById("round_robin_result");
    
    var checkbox = $("#randomize_seed").is(':checked');
    if($("#bracket_size").val() == 'names') {
        let txtarea = document.getElementById("tournament_participant");
        let lines = txtarea.value.split("\n");
        let numteam = lines.length;
        let round = $("#tournament_rr").val();
        
        text = text + "<tr>";
        if(checkbox) {
            shuffle(lines);
        }
        for(let i = 0; i<numteam; i++) {
            team_id[i] = i;
        }
        
        for(let i = 0; i<(numteam-1)*round; i++) {
            text = text +'<td colspan = ' +  numteam/2 + '>' + (i+1) + "일차 </td> </tr> <tr>";
            for(let j = 0; j<numteam/2; j++) {
                text = text +'<td>'+ lines[team_id[j]] + " : " + lines[team_id[numteam-j-1]]+"</td>";
            }
            for(let j = 0; j<lines.length-1;j++){
                team_id[j] = (team_id[j] + 1) % (numteam - 1);
            }
            text = text + '</tr>';
        }
    }
    
    if($("#bracket_size").val() == 'size') {
        let length = $("#bracket_size_num").val();
        let round = $("#tournament_rr").val();
        let team = new Array();
        for(let i=0; i<length; i++) {
            team_id[i] = i; // 팀 인덱스
            team[i] = (i+1) + '팀'; // 팀 숫자
        }
        text = text + "<tr>";
        for(let i = 0; i<(length - 1)*round; i++) {
            text = text + '<td colspan = ' + length/2+'>' + (i+1) + "일차 </td> </tr> <tr>";
            for(let j = 0; j<length/2; j++) {
                text = text + '<td>' + team[team_id[j]] + " : " + team[team_id[length-j-1]] + '</td>';
            }
            for(let j = 0; j<length-1; j++) {
                team_id[j] = (team_id[j] + 1) % (length - 1);
            }
            text = text + '</tr>';
        } 
    }
    $("#round_robin_result").removeClass('hide');
    result.innerHTML = text;
}

function tournament() {
    var checkbox = $("#randomize_seed").is(':checked');
    var third = $("#tournament_thrid").is(':checked');
    let result = document.getElementById("bracket");
    let j = 1;
    $("#bracket").removeClass('hide');
    $("#single_elimination").removeClass('hide');
    
    if(!third) {
        $("#thirdhead").addClass('hide');
        $("#thirdplayer1").addClass('hide');
        $("#thirdplayer2").addClass('hide');
    }

    if($("#bracket_size").val() == 'names') {
        let txtarea = document.getElementById("tournament_participant");
        let lines = txtarea.value.split("\n");
        var length = lines.length;
        

        if(length<=4) { //만약 인원 수가 4명 이하일 경우엔 4명으로 맞춰줌
            for(let i = 0; i<4; i++) {
                if(!lines[i]) { // 브래킷에 인원이 안 맞는 경우 맞춰줌
                    lines[i] = 'bye';
                }
            }
            if(checkbox) {
                shuffle(lines);
            }
    
            length = 4;
    
        }
        else if(length<=8) { //만약 인원 수가 8명 이하일 경우엔 8명으로 맞춰줌
            for(let i = 0; i<8; i++) {
                if(!lines[i]) { // 브래킷에 인원이 안 맞는 경우 맞춰줌
                    lines[i] = 'bye';
                }
            }
            
            if(checkbox) {
                shuffle(lines);
            }
    
            length = 8;
            
        }
        else if(length<=16) { //만약 인원 수가 16명 이하일 경우엔 16명으로 맞춰줌
            for(let i = 0; i<16; i++) {
                if(!lines[i]) { // 브래킷에 인원이 안 맞는 경우 맞춰줌
                    lines[i] = 'bye';
                }
            }

            length = 16
        }
        else {
            alert("16명 이하로 입력해주십시오.");
            location.reload();
        }
        
        for(let i = 0; i<length/2; i++) {
            $("#r"+ length +"player"+j).val(lines[i]);
            j++;
            $("#r"+ length +"player"+j).val(lines[length-i-1]);
            j++;
        } // 해당하는 브래킷에 값을 넣음

    }
    
    if($("#bracket_size").val() == 'size') {
        let length = $("#bracket_size_num").val();
        var lines = new Array();

        for(let i = 0; i<length; i++) {
            lines[i] = i + 1;
        }

        if(length<=4) { //만약 인원 수가 4명 이하일 경우엔 4명으로 맞춰줌
            for(let i = 0; i<4; i++) {
                if(!lines[i]) { // 브래킷에 인원이 안 맞는 경우 맞춰줌
                    lines[i] = 'bye';
                }
            }
            if(checkbox) {
                shuffle(lines);
            }
    
            length = 4;
    
        }
        else if(length<=8) { //만약 인원 수가 8명 이하일 경우엔 8명으로 맞춰줌
            for(let i = 0; i<8; i++) {
                if(!lines[i]) { // 브래킷에 인원이 안 맞는 경우 맞춰줌
                    lines[i] = 'bye';
                }
            }
            
            if(checkbox) {
                shuffle(lines);
            }
    
            length = 8;
            
        }
        else if(length<=16) { //만약 인원 수가 16명 이하일 경우엔 16명으로 맞춰줌
            for(let i = 0; i<16; i++) {
                if(!lines[i]) { // 브래킷에 인원이 안 맞는 경우 맞춰줌
                    lines[i] = 'bye';
                }
            }

            length = 16
        }
        
        for(let i = 0; i<length/2; i++) {
            $("#r"+ length +"player"+j).val(lines[i]);
            j++;
            $("#r"+ length +"player"+j).val(lines[length-i-1]);
            j++;
        } // 해당하는 브래킷에 값을 넣음
    }
}

function dueltournament() {
    var checkbox = $("#randomize_seed").is(':checked');
    var third = $("#tournament_thrid").is(':checked');
    let result = document.getElementById("bracket");
    let j = 1;
    $("#bracket").removeClass('hide');
    $("#double_elimination").removeClass('hide');
    

    if($("#bracket_size").val() == 'names') {
        let txtarea = document.getElementById("tournament_participant");
        let lines = txtarea.value.split("\n");
        var length = lines.length;
        

        if(length<=4) { //만약 인원 수가 4명 이하일 경우엔 4명으로 맞춰줌
            for(let i = 0; i<4; i++) {
                if(!lines[i]) { // 브래킷에 인원이 안 맞는 경우 맞춰줌
                    lines[i] = 'bye';
                }
            }
            if(checkbox) {
                shuffle(lines);
            }
    
            length = 4;
    
        }
        else if(length<=8) { //만약 인원 수가 8명 이하일 경우엔 8명으로 맞춰줌
            for(let i = 0; i<8; i++) {
                if(!lines[i]) { // 브래킷에 인원이 안 맞는 경우 맞춰줌
                    lines[i] = 'bye';
                }
            }
            
            if(checkbox) {
                shuffle(lines);
            }
    
            length = 8;
            
        }
        else {
            alert("16명 이하로 입력해주십시오.");
            location.reload();
        }
        
        for(let i = 0; i<length/2; i++) {
            $("#dr"+ length +"player"+j).val(lines[i]);
            j++;
            $("#dr"+ length +"player"+j).val(lines[length-i-1]);
            j++;
        } // 해당하는 브래킷에 값을 넣음

    }
    
    if($("#bracket_size").val() == 'size') {
        let length = $("#bracket_size_num").val();
        var lines = new Array();

        for(let i = 0; i<length; i++) {
            lines[i] = i + 1;
        }

        if(length<=4) { //만약 인원 수가 4명 이하일 경우엔 4명으로 맞춰줌
            for(let i = 0; i<4; i++) {
                if(!lines[i]) { // 브래킷에 인원이 안 맞는 경우 맞춰줌
                    lines[i] = 'bye';
                }
            }
            if(checkbox) {
                shuffle(lines);
            }
    
            length = 4;
    
        }
        else if(length<=8) { //만약 인원 수가 8명 이하일 경우엔 8명으로 맞춰줌
            for(let i = 0; i<8; i++) {
                if(!lines[i]) { // 브래킷에 인원이 안 맞는 경우 맞춰줌
                    lines[i] = 'bye';
                }
            }
            
            if(checkbox) {
                shuffle(lines);
            }
    
            length = 8;
            
        }
        
        for(let i = 0; i<length/2; i++) {
            $("#dr"+ length +"player"+j).val(lines[i]);
            j++;
            $("#dr"+ length +"player"+j).val(lines[length-i-1]);
            j++;
        } // 해당하는 브래킷에 값을 넣음
    }
}

function advance( winner, loser, place ){
	place.value = winner.value;
}

function retreat( winner, loser, place ){
	place.value = loser.value;
}

function victory(obj) {
    alert(obj.val()+"님이 우승하셨습니다!");
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}
