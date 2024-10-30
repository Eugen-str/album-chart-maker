const ITEMS_MENU = 0;
const OPTIONS_MENU = 1;

let width = 3, height = 3;
let current_menu = ITEMS_MENU;

let limit = 6;

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

    content += `
    <input id="searched-artist" type="text" placeholder="artist name"><br>
    or<br>
    <input id="searched-album" type="text" placeholder="album title"><br>
    <button onclick="show_releases()">search</button><br>`;

    content += `<div id="release-preview-grid"></div>`

    document.getElementById("menu-content").innerHTML = content;
}

function show_options_menu(){
    let content = "";

    content += `
    width:<input id="width-input" type="number" min="1" max="15" value="${width}"><br>
    height:<input id="height-input" type="number" min="1" max="15" value="${height}">
    `;

    document.getElementById("menu-content").innerHTML = content;

    document.getElementById("width-input").addEventListener("change", (event) => {
        width = parseInt(event.target.value);
        make_empty_chart();
    });

    document.getElementById("height-input").addEventListener("change", (event) => {
        height = parseInt(event.target.value);
        make_empty_chart();
    });
}

function show_albums(data){
    let release_grid_width = document.getElementById("release-preview-grid").clientWidth;
    let num_in_row = 3;
    let size = `${release_grid_width / num_in_row - 3}`;
    
    let content = "";
    let style = `"draggable="true" ondragstart="drag(event)" width="${size}" height="${size}"`;

    let i = 0;
    let curr_row = "";
    data.forEach(album => {
        if (i % num_in_row == 0 && i != 0){
            content += `<div class="row" style="width:100%;">${curr_row}</div>`;
            curr_row = "";
        }
        curr_row += `<div class="release-preview" style="width:${size}px; height:${size}px;"><img ${style} id="${album.name}" src="${album.image[2]["#text"]}"></div>`;
        i += 1;
    });
    content += `<div class="row" style="width:100%;">${curr_row}</div>`;
    curr_row = "";

    document.getElementById("release-preview-grid").innerHTML = content;
}

async function show_releases(){
    let input_field;

    let data;
    if(document.getElementById("searched-album").value != ''){
        input_field = document.getElementById("searched-album").value;

        let temp = await fetch_album_data(input_field);
        data = temp.results.albummatches.album;
    } else if(document.getElementById("searched-artist").value != ''){
        input_field = document.getElementById("searched-artist").value;

        let temp = await fetch_artist_data(input_field);
        console.log(data);
        data = temp.topalbums.album;
    }
    
    show_albums(data)
}

function show_menu(){
    switch(current_menu){
        case ITEMS_MENU:
            show_items_menu();
            break;
        case OPTIONS_MENU:
            show_options_menu();
            break;
    }
}

make_empty_chart();
show_menu();

document.getElementById("add-items-tab").addEventListener("click", () => {
    current_menu = ITEMS_MENU;
    show_menu();
});

document.getElementById("options-tab").addEventListener("click", () => {
    current_menu = OPTIONS_MENU;
    show_menu();
});

///// --------- LASTFM DATA FETCHING

const artist_method = 'artist.getTopAlbums';
const album_method = 'album.search';
async function fetch_artist_data(input){
    let url = `https://lastfm-proxy.onrender.com/api/lastfm?method=${artist_method}&input=${input}&limit=${limit}`;
    return await fetch_data(url);
}

async function fetch_album_data(input){
    let url = `https://lastfm-proxy.onrender.com/api/lastfm?method=${album_method}&input=${input}&limit=${limit}`;
    return await fetch_data(url);
}

async function fetch_data(url){
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);
    
    return data;
}