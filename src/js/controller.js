import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if
// https://forkify-api.herokuapp.com/v2

/////////////////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // Update result view to mark selected search result
    resultView.update(model.getSearchResultsPage());
    //Updating bookmark view
    bookmarksView.update(model.state.bookmarks);
    //////////// Loading recipe////////////
    await model.loadRecipe(id);

    //////////// Rendering recipe/////////////
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    //get seach query
    const query = searchView.getQuery();

    if (!query) return;
    // load serach result
    await model.loadSearchResults(query);
    //render result

    resultView.render(model.getSearchResultsPage());

    //Render initial pagenation button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
controlPagination = function (goToPage) {
  //render New result

  resultView.render(model.getSearchResultsPage(goToPage));

  //Render New pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings(in state)
  model.updateServings(newServings);
  //Update the recipe view

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else model.deleteBookmark(model.state.recipe.id);
  //Update recipe View
  recipeView.update(model.state.recipe);
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBooksMark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading
    addRecipeView.renderSpinner();
    //Upload recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // render recipe view
    recipeView.render(model.state.recipe);
    //success message
    addRecipeView.renderMessage();
    // render bookmarkView
    bookmarksView.render(model.state.bookmarks);
    // change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();
    // Close window form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥💥💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBooksMark);
  recipeView.addHadlerRender(controlRecipe);
  recipeView.addHanddlerUpdateServing(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome!');
};
init();
