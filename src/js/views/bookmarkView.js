import View from './view.js';
import previewView from './previewView.js'

import icons from 'url:../../img/icons.svg'


class BookMarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet'
    _message = ''


    addHandlerRender(handler){
        window.addEventListener('load',handler)
    }
    
  _generateMarkup() {
    return this._data.map(result => previewView.render(result , false)).join('');
  }

}

export default new BookMarksView();
