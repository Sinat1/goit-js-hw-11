import './sass/main.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './api/fetchImages';
import imageCardTpl from './templates/imageCard.hbs';
import { ITEMS_PER_PAGE } from './api/fetchImages';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryList: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionsDelay: 250,
});

let searchQuery = '';
let page = 1;

function showSuccessNotification({ data: { totalHits } }) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

async function onFormSubmit(event) {
  event.preventDefault();

  refs.galleryList.innerHTML = '';
  refs.loadMoreBtn.style.visibility = 'hidden';

  searchQuery = event.currentTarget.elements.searchQuery.value;
  page = 1;
  if (!searchQuery) {
    Notiflix.Notify.warning('Please type something');
    return;
  }

  const imagesResponse = await fetchImages(searchQuery, page);
  if (!imagesResponse.data.hits.length) {
    refs.loadMoreBtn.style.visibility = 'hidden';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (imagesResponse) {
    appendImagesMarkup(imagesResponse);
    showSuccessNotification(imagesResponse);
    refs.loadMoreBtn.style.visibility = 'visible';
  }

  if (page * ITEMS_PER_PAGE > imagesResponse.data.totalHits) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    refs.loadMoreBtn.style.visibility = 'hidden';
  }
}

async function onLoadMore() {
  page += 1;
  const imagesResponse = await fetchImages(searchQuery, page);
  appendImagesMarkup(imagesResponse);
  if (page * ITEMS_PER_PAGE > imagesResponse.data.totalHits) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    refs.loadMoreBtn.style.visibility = 'hidden';
  }
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function appendImagesMarkup({ data: { hits } }) {
  refs.galleryList.insertAdjacentHTML('beforeend', imageCardTpl(hits));
  lightbox.refresh();
}
