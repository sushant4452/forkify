import * as modal from "./model.js"

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from "./views/recipeView.js"; 
import { async } from "regenerator-runtime";
import searchView from './views/searchview.js'
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarkview.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";
if(module.hot){
  module.hot.accept();
}

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function(){
  try{
    const id = window.location.hash.slice(1);
    if(!id) return;
    recipeView.renderSpinner();
    resultsView.update(modal.getSearchResultsPage());
    bookmarksView.update(modal.state.bookmarks);
    await modal.loadRecipe(id);
    recipeView.render(modal.state.recipe);
  //  const recipeView = new recipeView(modal.state.recipe);
   
        //recipeContainer.innerHTML = '';
       // recipeContainer.insertAdjacentHTML('afterbegin', markup);
  }
  catch(err){
    console.log(err);
    recipeView.renderError();
  }
}
const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();

    const query  = searchView.getQuery();
    if(!query) return;

    await modal.loadSearchResults(query);

   // console.log(modal.state.search.results);
    resultsView.render(modal.getSearchResultsPage(1));

    // render initial pagination view
    paginationView.render(modal.state.search);
  }
  catch(err){
    console.log(err);
  }
}
const controlPagination = function(goToPage){
  resultsView.render(modal.getSearchResultsPage(goToPage));

  // render initial pagination view
  paginationView.render(modal.state.search);
}
const controlServings = function(updateTo){
  modal.updateServings(updateTo);
   recipeView.update(modal.state.recipe);
}



const ControlAddBookmark = function(){
  if(!modal.state.recipe.bookmarked) {
    modal.addBookmark(modal.state.recipe);
  }
  else{
    
    modal.deleteBookmark(modal.state.recipe.id);
    

  }
  recipeView.update(modal.state.recipe);
  console.log(modal.state.bookmarks);
  bookmarksView.render(modal.state.bookmarks);
}
const controlBookmarks = function(){
  bookmarksView.render(modal.state.bookmarks);
}
const controlAddRecipe = async function(newRecipe){
  try{
   addRecipeView.renderSpinner();
   await modal.uploadRecipe(newRecipe);


  // addRecipeView.resetAddrecipe();
   recipeView.render(modal.state.recipe);
   addRecipeView.renderMessage();
   bookmarksView.render(modal.state.bookmarks);

   // change id in the url
   window.history.pushState(null , '' ,`#${modal.state.recipe.id}`);

   setTimeout(function(){
    addRecipeView.toggleWindow();
   }, MODAL_CLOSE_SEC * 1000);
  }
  catch(err){
    
    addRecipeView.renderError(err.message);
  }
}
const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addhandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(ControlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

}
// window.addEventListener('load', controlRecipes);
init();