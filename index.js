const ITEMS_MENU = 0;
const OPTIONS_MENU = 1;

let width = 3, height = 3;
let current_menu = ITEMS_MENU;

function allow_drop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    let img = document.getElementById(data);
    img.width = ev.target.clientWidth;
    img.height = ev.target.clientHeight;
    ev.target.appendChild(img);
}

function make_empty_chart(){
    let chart_div = document.getElementById("chart");
    let right_side_div = document.getElementById("right-side");

    let dim = Math.min(right_side_div.clientHeight, right_side_div.clientWidth) / Math.max(width, height);
    let slot_width = dim, slot_height = dim;
    let padding = 10;

    let style = `width: ${slot_width}px; height: ${slot_height}px; margin-left: ${padding / 2}px; margin-right: ${padding / 2};`;
    let drop_code = `ondrop="drop(event)" ondragover="allow_drop(event)"`;

    let content = "";
    for(let y = 0; y < height; y++){
        content += `<div class="row" style="padding-top: ${padding / 2}px; padding-bottom: ${padding / 2}px;">`;
        for(let x = 0; x < width; x++){
            content += `<div class="album-slot" ${drop_code} style="${style}"></div>`
        }
        content += '</div>'
    }

    chart_div.innerHTML = content;
}

function show_items_menu(){
    let content = "";

    content += `release name: <input id="searched-name" type="text"> <button onclick="show_releases()">search</button>`;

    content += `<div id="release-preview-grid"></div>`

    document.getElementById("menu-content").innerHTML = content;
}

function show_releases(){
    let content = "";

    content += `<div id="release-preview"><img id="the-cure-1" draggable="true" ondragstart="drag(event)" width="100px" height="100px" src="https://upload.wikimedia.org/wikipedia/en/b/b8/CureDisintegration.jpg"></div>`;
    content += `<div id="release-preview"><img id="the-cure-2" draggable="true" ondragstart="drag(event)" width="100px" height="100px" src="https://upload.wikimedia.org/wikipedia/en/0/07/The_Cure_-_Pornography.jpg"></div>`;

    document.getElementById("release-preview-grid").innerHTML = content;
}

function show_menu(){
    switch(current_menu){
        case ITEMS_MENU:
            show_items_menu();
            break;
        case ITEMS_MENU:
            show_options_menu();
            break;
    }
}

make_empty_chart();
show_menu();
