import View from './view.js';
import icons from 'url:../../img/icons.svg'

class AddRecipeView extends View {
    _parentEl = document.querySelector('.upload')
    _message = 'Recipe has been succesfully added'

    _window = document.querySelector('.add-recipe-window')
    _overlay = document.querySelector('.overlay')
    _btnOpen = document.querySelector('.nav__btn--add-recipe')
    _btnClose = document.querySelector('.btn--close-modal')

    constructor(){
        super()
        this._addHandlerShowModal()
        this._addHandlerHideModal()
    }

    toggleWindow(){
        this._overlay.classList.toggle('hidden')
            this._window.classList.toggle('hidden')
    }

    _addHandlerShowModal(){
        this._btnOpen.addEventListener('click',this.toggleWindow.bind(this))
    }
    _addHandlerHideModal(){
        this._btnClose.addEventListener('click',this.toggleWindow.bind(this))
        this._overlay.addEventListener('click',this.toggleWindow.bind(this))
    }

    addHandlerUpload(handler){
        this._parentEl.addEventListener('submit',function(e){
            e.preventDefault()
            const dataArr = [...new FormData(this)]
            const data = Object.fromEntries(dataArr)
            handler(data)
        })
    }

    _generateMarkup(){
      
    }
}
export default new AddRecipeView()