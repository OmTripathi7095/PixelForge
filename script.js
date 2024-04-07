const images=document.querySelector(".images")
const loadMoreBtn=document.querySelector(".load-more")
const searchBtn=document.querySelector(".search-container input")
const lightbox = document.querySelector(".lightbox");
const closeImgBtn = lightbox.querySelector(".close-icon");
const downloadImgBtn = lightbox.querySelector(".uil-import");

const KEY=`fugvL9LWViqouQwchgppGO0eKK7Ruq0GfGOZUOzWgacuFEZ0QNHD2jAu`;
const perPage=15;
let page=1;
let searchTerm=null;
let pageURL=`https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`

const downloadImg = (url)=>{
    fetch(url).then(res=>res.blob()).then(blob=>
        {
            const a=document.createElement("a");
            a.href=URL.createObjectURL(blob)
            a.download=new Date().getTime();
            a.click();
        }
    ).catch(e=>{

        console.log(`Error : ${e}`)
        alert("COULD NOT DOWNLOAD FILE!!!")}
    )
    
}
const showLightbox = (name, img) => {
    lightbox.querySelector("img").src = img;
    lightbox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
}
const hideLightbox = () => {
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";
}
const htmlGenerator = (photos)=>{
    images.innerHTML += photos.map(photo=>
        ` <li class="card">
        <img onclick="showLightbox('${photo.photographer}', '${photo.src.large2x}')" src="${photo.src.large2x}" alt="image">
        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${photo.photographer}</span>
            </div>
            <button onclick="downloadImg('${photo.src.large2x}');" event.stopPropogation()><i class="uil uil-import"></i></button>
        </div>
    </li>`
    ).join("")
}
const imageGenerator = (pageURL)=>{
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(pageURL,{
        headers:{Authorization:KEY}
    }).then(res=>res.json()).then(data=>{
        console.log(data)
        htmlGenerator(data.photos);
        loadMoreBtn.innerText = "Load More";
    loadMoreBtn.classList.remove("disabled");
    }).catch(e=>
    console.log(`Error : ${e}`))
}
const loadMoreImages=()=>{
    page++;
    pageURL=searchTerm?`https://api.pexels.com/v1/search?query=${searchTerm}&page=${page}&per_page=${perPage}`:`https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`
    imageGenerator(pageURL);
}
const loadSearchImages=(e)=>{
    if (e.target.value==="")return searchTerm=null;
    if(e.key==="Enter")
    {
        page=1;
        searchTerm=e.target.value;
        images.innerHTML=``
        imageGenerator(`https://api.pexels.com/v1/search?query=${searchTerm}&page=1&per_page=${perPage}`);
    }
}

loadMoreBtn.addEventListener("click",loadMoreImages)
searchBtn.addEventListener("keyup",loadSearchImages)
closeImgBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));

imageGenerator(pageURL)