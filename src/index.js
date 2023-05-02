import { fetchSearchResult } from './js/fetch-search-result';
import { fetchDownloadMore } from './js/fetch-search-result';
import { createSearchSubjectMarkup } from './js/create-murkup';
import { createArrayElementsMarkup } from './js/create-murkup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  inputSearchItem: document.querySelector('input'),
  buttonSearch: document.querySelector('.search-form__btn'),
  searchSubjectContainer: document.querySelector(
    '.search-subject-container'
  ),
  gallery: document.querySelector('.gallery'),
  buttonDownloadMore: document.querySelector('.download-more'),
};

let page = 1;
let itemForSearch = '';

refs.buttonSearch.addEventListener('click', readingInputField);
refs.buttonDownloadMore.addEventListener('click', downloadMore);

function readingInputField(e) {
  e.preventDefault();
  removeMarkup(refs.gallery, refs.searchSubjectContainer);
  refs.buttonDownloadMore.classList.add('is-hidden');

  itemForSearch = refs.inputSearchItem.value;
  console.log(itemForSearch);
  page = 1;

  fetchSearchResult(itemForSearch, page)
    .then(arrayElements => {
      Notify.success(
        `Hooray! We found ${arrayElements.totalHits} images.`
      );

      addMarkup(
        refs.searchSubjectContainer,
        createSearchSubjectMarkup(itemForSearch)
      );
      console.log(arrayElements);

      addMarkup(
        refs.gallery,
        createArrayElementsMarkup(arrayElements.hits)
      );

      refs.buttonDownloadMore.classList.remove('is-hidden');
    })
    .catch(() => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });

  refs.inputSearchItem.value = '';
}

function downloadMore() {
  page = page + 1;

  fetchDownloadMore(itemForSearch, page).then(arrayElements => {
    console.log(arrayElements);
    addMarkup(refs.gallery, createArrayElementsMarkup(arrayElements.hits));
  });
}

function addMarkup(ref, markup) {
  ref.insertAdjacentHTML('beforeend', markup);
}

function removeMarkup(...refs) {
  refs.forEach(ref => {
    ref.innerHTML = '';
  });
}
