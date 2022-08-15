//const url = 'http://127.0.0.1:5000/'
const url = 'http://127.0.0.1:5000/'
players = null


document.addEventListener("DOMContentLoaded", function () {
    // code...
    fetch(url, {
        headers: { 'Content-Type': 'application/json' }
    }).then(data => data.json()).then(res => finish(res))
});


function finish(res) {
    let optionList1 = document.getElementById('player_list_1').options;
    let optionList2 = document.getElementById('player_list_2').options;
    res['players_arr'].forEach(option =>
        optionList1.add(
            new Option(option.name, option.id))
    );
    res['players_arr'].forEach(option =>
        optionList2.add(
            new Option(option.name, option.id))
    );
    $('select').selectize({
        sortField: 'text'
    });
}

function set_player(i) {
    player_id = document.getElementById(`player_list_${i}`).value
    player = null
    fetch(url + 'get_player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // this line is important, if this content-type is not set it wont work
        body: `player_id=${player_id}`
    }).then(res => res.json())
        .then(res => set_player_html(res, i));
}

function set_player_html(data, i) {
    try {
        document.getElementsByClassName(`p2`)[0].classList.remove('glow')

        document.getElementsByClassName(`p1`)[0].classList.remove('glow')

    }
    catch (e) {
        console.log(e)
    }
    if (document.getElementById(`p${i}_current`).classList.contains('wipe')) {
        document.getElementById(`p${i}_current`).classList.remove('wipe')
    }
    player_name = JSON.stringify(Object.values(data.name))
    player_rank = JSON.stringify(Object.values(data.rank))
    player_points = JSON.stringify(Object.values(data.points))
    player_id = JSON.stringify(Object.values(data.id))
    player_club = JSON.stringify(Object.values(data.club))

    player_name = player_name.substring(2, player_name.length - 2);
    player_club = player_club.substring(2, player_club.length - 2);
    player_rank = player_rank.substring(1, player_rank.length - 1);
    player_points = player_points.substring(1, player_points.length - 1);
    player_id = player_id.substring(1, player_id.length - 1);

    if (document.getElementById(`p${i == 1 ? 2 : 1}_name`).innerText.includes(player_name)) {
        document.getElementById(`player_list_${i}`).value = "None"
        document.getElementById(`error_message`).innerHTML = `לא ניתן לבחור את אותו שחקן פעמיים<br>אנא בחר שחקן אחר`

        return

    }
    else {
        document.getElementById(`error_message`).innerHTML = ``
    }
    document.getElementById(`p${i}_current`).classList.add('wipe')

    document.getElementById(`profile_div${i}`).innerHTML = `
    <img class="profile" src='/Users/yoni/Desktop/TTTM/players_pics/${player_id}.jpg' onerror="this.onerror=null;this.src='/Users/yoni/Desktop/TTTM/players_pics/Default.png';" />
    <img class="club" src='/Users/yoni/Desktop/TTTM/clubs/${player_club}.png' onerror="this.onerror=null;this.src='/Users/yoni/Desktop/TTTM/clubs/none.png';" />
    <label style="padding-bottom:20px;" id="p${i}_team">${player_club}</label>
    `
    document.getElementById(`p${i}_name`).innerText = ` שם השחקן: ${player_name}`
    document.getElementById(`p${i}_rank`).innerText = `  דירוג נוכחי: ${player_rank}`
    document.getElementById(`p${i}_points`).innerText = ` נקודות: ${player_points}`



}
function move() {
    var i = 0;

    if (i == 0) {
        i = 1;
        var bar_parent = document.getElementById("prog_bar")
        bar_parent.classList.remove('dnone')
        var elem = document.getElementById("myBar");
        var width = 1;
        var id = setInterval(frame, 55);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
            } else {
                width++;
                if (width == 13) {
                    document.getElementById("prog_text").innerHTML += '<span style="padding:6px;">אוסף נתונים</span>'
                }
                if (width == 36) {
                    document.getElementById("prog_text").innerHTML += '<span  style="padding:6px;">מצליב משחקים קודמים</span>'
                }
                if (width == 67) {
                    document.getElementById("prog_text").innerHTML += '<span style="padding:6px;">...עוד קצת</span>'
                }
                elem.style.width = width + "%";
            }
        }

    }

}
function cross_players() {
    p1_id = document.getElementById('player_list_1').value
    p2_id = document.getElementById('player_list_2').value
    vals = {
        "p1_id": p1_id,
        "p2_id": p2_id
    }
    if (p1_id == '' || p2_id == '') {
        document.getElementById(`error_message`).innerHTML = `על מנת להתחיל, יש לבחור שני שחקנים`
        return
    }
    else {
        document.getElementById(`error_message`).innerHTML = ``
    }
    document.getElementById('cross_details').innerHTML = ` <h2 id="history_title"></h2>
    <h3 id="prev_games"></h3>
    <div class="players_history" id="p_h">
    </div>
    <h1 id="winner_title"></h1>`;
    move();

    setTimeout(function () {
        fetch(url + 'predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // this line is important, if this content-type is not set it wont work
            body: JSON.stringify(vals)
        }).then(res => res.json())
            .then(res => set_vs_df(res));
    }, 6000);


}

function set_vs_df(data) {
    document.getElementById("prog_bar").classList.add('dnone')

    p1_prevwins = Object.values(data['p1_prevwins'])[0]
    p2_prevwins = Object.values(data['p2_prevwins'])[0]
    is_p1_win = Object.values(data['is_p1_win'])[0]
    p1_form = Object.values(data['p1_form'])[0]
    p2_form = Object.values(data['p2_form'])[0]
    total_games = p1_prevwins + p2_prevwins
    p1_name = document.getElementById('p1_name').innerText
    p2_name = document.getElementById('p2_name').innerText
    document.getElementById('history_title').innerText = `:היסטוריית המשחקים`
    document.getElementById('prev_games').innerHTML = `משחקים ששוחקו: ${total_games}`
    winner_img = `<img class="winner" src="winner.png" alt="winner"/>`
    document.getElementById(`p_h`).innerHTML = `
    
    
    
    <table class="wipe">
        <thead>
            <tr>
            <th>${p2_name.split(':')[1]}</th>
                <th>${p1_name.split(':')[1]}</th>
                <th>:שם השחקן</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${p2_prevwins}</td>
                <td>${p1_prevwins}</td>
                <td>:נצחונות קודמים</td>
            </tr>
            <tr>
                <td style='color:${set_color(p2_form)};'>${p2_form}</td>
                <td style='color:${set_color(p1_form)};'>${p1_form}</td>
                <td>:נקודות ב14 ימים האחרונים</td>
            </tr>  
            <tr>
                <td>${is_p1_win ? "" : winner_img}</td>
                <td>${is_p1_win ? winner_img : ""}</td>
                <td>:מנצח</td>
            </tr>   
        
        </tbody>
    </table>
    
    
    
    `
    // document.getElementById('p1_prediction').innerHTML = `
    // <h2>${p1_name}</h2>
    // <p>נצחונות קודמים: ${p1_prevwins}</p>
    // `
    // document.getElementById('p2_prediction').innerHTML = `
    // <h2>${p2_name}</h2>
    // <p>נצחונות קודמים: ${p2_prevwins}</p>
    // `
    document.getElementById("prog_text").innerHTML = ''

    winner_str = is_p1_win ? p1_name : p2_name;
    winner_str = winner_str.split(':')[1]
    p_winner = is_p1_win ? 1 : 2;
    document.getElementsByClassName(`p${p_winner}`)[0].classList.add('glow')
    document.getElementById('winner_title').innerHTML = `${winner_str}`
}

function set_color(form) {
    if (form > 0) {
        return '#61ff58'
    }
    else if (form < 0) {
        return '#ff5858'
    }
    else {
        return 'white'
    }

}