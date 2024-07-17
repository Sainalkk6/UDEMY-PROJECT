import * as model from './model.js'
import { MODALCLOSETIME } from './config.js';
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import bookMarkView from './views/bookmarkView.js'
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js'
import 'core-js/stable'
import bookmarkView from './views/bookmarkView.js';


// if(module.hot){
//   module.hot.accept()
// }



// https://forkify-api.herokuapp.com/v2

const controlRecipe = async function(){
  try{

    const id = window.location.hash.slice(1)
    if(!id) return

    // Loading recipe
    recipeView.renderSpinner()

    resultView.update(model.getSearchResultPage())


    await model.loadRecipe(id);

    // renedering recipe
    
    recipeView.render(model.state.recipe) 
    bookMarkView.update(model.state.bookmarks)


  } catch (err){
    // recipeView.rendorMessage()
    console.error(err)
    recipeView.renderError()
  }
}

const controlSearchResults = async function(){
  try{

    resultView.renderSpinner()
    const query = searchView.getQuery()
    if(!query) return

    await model.loadSearchResults(query)

    resultView.render(model.getSearchResultPage())

    paginationView.render(model.state.search)


  } catch(err){
    console.log(err)
  }
}

const controlPagination = function(goToPage){
  resultView.render(model.getSearchResultPage(goToPage))

    paginationView.render(model.state.search)
}

const controlServings = function(servings){
  model.updateServings(servings)
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function(){
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
    else{
      model.removeBookMark(model.state.recipe.id)
    }
    
    recipeView.update(model.state.recipe)

    bookMarkView.render(model.state.bookmarks)
}

const controlBookmarks = function(){
  bookMarkView.render(model.state.bookmarks)
}


const controlAddRecipe = async function(newRecipe){
  try{

    addRecipeView.renderSpinner()

    await model.uploadRecipe(newRecipe)

    recipeView.render(model.state.recipe)

    addRecipeView.rendorMessage()

    bookmarkView.render(model.state.bookmarks)

    // change id in URL

    window.history.pushState(null,'',`#${model.state.recipe.id}`)

    setTimeout(function(){
      addRecipeView.toggleWindow()
    },MODALCLOSETIME * 1000)

    
  } catch(err){
    console.log(err)
    addRecipeView.renderError(err.message)
  }
}


const init = function(){
  recipeView.addHandlerUpdateServing(controlServings)
  recipeView.addHandlerRender(controlRecipe)
  searchView.addHAndlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  recipeView.addHandlerAddBookMark(controlAddBookmark)
  bookMarkView.addHandlerRender(controlBookmarks)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}

init()

const clearBookMarks = function(){
  localStorage.clear('bookmarks')
}






















