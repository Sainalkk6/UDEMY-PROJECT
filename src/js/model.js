import {async} from 'regenerator-runtime'
import {API_URL , KEY} from './config.js'
import { AJAX } from './helpers.js'
import { RES_PER_PAGE } from './config.js'
import { search } from 'core-js/./es/symbol'

export const state ={
    recipe:{},
    search: {
        query:'',
        result:[],
        resultPerPage : RES_PER_PAGE,
        page:1
    },
    bookmarks: []
}


const createRecipeObject = function(data){
    const recipe = data.data.recipe
    return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime : recipe.cooking_time,
    ingredients: recipe.ingredients,
   ...( recipe.key && {key:recipe.key})
    }
}

export const loadRecipe = async function(id){
    try{
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`)
        // console.log(data)
        state.recipe = createRecipeObject(data)
        
      
        
        if(state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true
        else
        state.recipe.bookmarked = false
        
    } catch(err){
        throw err
    }
}

export const loadSearchResults = async function(query){
    try{
        state.search.query = query
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)
        // console.log(data)
       state.search.result = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...( rec.key && {key:rec.key})

            }
        })
        state.search.page = 1

    } catch (err){
        throw err
    }
}



export const getSearchResultPage = function(page = state.search.page){
    state.search.page = page

    const start = (page -1) * state.search.resultPerPage
    const end = page* state.search.resultPerPage
    return state.search.result.slice(start,end)
}


export const updateServings = function (servings){
    state.recipe.ingredients.forEach(ing=>{
        ing.quantity = (ing.quantity * servings) / state.recipe.servings
    })

    state.recipe.servings = servings
}


export const addBookmark = function(recipe){
    state.bookmarks.push(recipe)

    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true
    persistBookmarks()
}


export const removeBookMark = function(id){
    const index = state.bookmarks.findIndex(el=> el.id === id)
    state.bookmarks.splice(index, 1)
    if(id === state.recipe.id) state.recipe.bookmarked = false
    persistBookmarks()    
}

const persistBookmarks = function(){
    localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks))
}

const init = function(){
    const storage = localStorage.getItem('bookmarks')
    if(storage) state.bookmarks = JSON.parse(storage)
}

init()
// console.log(state.bookmarks)

export const uploadRecipe = async function(newRecipe){
   try{ 
    const ingredients = Object.entries(newRecipe).filter(entry=> entry[0].startsWith('ingredient') && entry[1] !== '').map( ing=>{ 
        const ingArr = ing[1].split(',').map(el=> el.trim())
        if(ingArr.length !== 3) throw new Error('Wrong ingredient Format!')

        const  [quantity , unit, description ] = ingArr

        return {quantity: quantity ? +quantity : null , unit , description}  } 
         
    )
    console.log(ingredients)
    const recipe = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url : newRecipe.image,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients,
    }

    console.log(recipe)


    const data = await AJAX(`${API_URL}?key=${KEY}`,recipe)
    state.recipe = createRecipeObject(data)
    addBookmark(state.recipe)
    console.log(data)


    } catch(err){
        throw err
    }
}





























