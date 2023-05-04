const axios = require('axios').default;
import SimpleLightbox from "simplelightbox";
// Additional styles import
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix, { Notify } from 'notiflix';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let page = 1;
let search;
let totalHits;
loadMore.style.display = "none";
async function getImage(search1) {
    let url = `https://pixabay.com/api/?key=35985759-e1d6ff66bac9425b2a65b15e0&q=${search1}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=12`;    
    try {
        const response = await axios.get(url);  
        console.log(response.data); 
        console.log(response.data.totalHits);
        if(response.data.totalHits == 0){
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        } else{
            targetPrint(response.data); 
            loadMore.style.display = "block";
            page +=1;  
            totalHits = response.data.totalHits/12;        
        }
              
    } catch (error) {
        Notify.Notify.Notiflix(error);
    }
}

function targetPrint(data){
    let insertImage = "";
    deletechildrens(gallery);
    for (const dataImage of data.hits) {
        insertImage += `<div class="photo-card">
                            <a class="gallery__link" href="${dataImage.largeImageURL}">
                                <img class="gallery__image" src="${dataImage.webformatURL}" 
                                    alt="${dataImage.tags}" 
                                    data-source="${dataImage.largeImageURL}"  
                                    loading="lazy"                                                                       
                                />
                            </a>                           
                            <div class="info">
                            <p class="info-item">
                                <b>Likes</b><br>
                                <span>${dataImage.likes}</span>
                            </p>
                            <p class="info-item">
                                <b>Views</b><br>
                                ${dataImage.views}
                            </p>
                            <p class="info-item">
                                <b>Comments</b><br>
                                ${dataImage.comments}
                            </p>
                            <p class="info-item">
                                <b>Downloads</b><br>
                                ${dataImage.downloads}   
                            </p>
                            </div>
                        </div>`
    }
    gallery.insertAdjacentHTML('afterbegin', insertImage);
    let lightbox = new SimpleLightbox('.gallery a', {captionDelay:250, captionsData:'alt'});
}

function generarURL(string){
    let arrayUrl = string.split(" ");    
    let url = arrayUrl.join("+");   
    console.log(url);
    return url;
}

searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();    
    const{elements:{searchQuery}}= e.currentTarget;   
    if(searchQuery.value == ""){
        Notiflix.Notify.info('Inserte lo que desea buscar')
    }else{
        search = searchQuery.value;
        getImage(generarURL(searchQuery.value)); 
    }      
})

loadMore.addEventListener('click', (e)=>{
    e.preventDefault();
    if(page > totalHits){
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
    }else{
        getImage(search);
    }
    
   
})

function deletechildrens(element){
    while(element.hasChildNodes()){
        element.removeChild(element.firstChild);	
   }
}