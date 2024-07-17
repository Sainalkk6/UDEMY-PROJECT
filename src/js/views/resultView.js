import View from './view.js';
import icons from 'url:../../img/icons.svg'
import previewView from './previewView.js'



class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'We couldnt find what you are looking for . Try again'
    _message = ''

    _generateMarkup() {
        return this._data.map(result => previewView.render(result , false)).join('');
      }
}

export default new ResultsView();
