const favoritesDropdown=document.getElementById("favouritesDropdown");
const mealBodyEL=document.querySelector(".meal-body")
const inputEl= document.getElementById("inputText");
const searchBtn=document.getElementById("searchBtn");
const resultBox=document.querySelector(".result-box");
const mealContEl=document.querySelector(".meal-Container")
let result=[];
let mealss=[];
let favitems = JSON.parse(localStorage.getItem('favitems')) || [];
let isfavourite=false;
inputEl.oninput = async function(){
    let input=inputEl.value;
    console.log("searchValue:",input)
    let meals= await getDetails(input)
    // if(input.length){
    //     result=meals.filter((meal)=>{
    //         return meal.strMeal.toLowerCase().includes(input.toLowerCase());
    //     });     
    //     console.log(result)   
    // }

    if (!meals) {
        displayErrorMessage("Meal not found !", true);
    } else {
        result = [...meals];
        displayErrorMessage("", false);
        displayResult(result);
    }
    // console.log(result,input);
    if(!input){
        resultBox.innerHTML="";
    }
}
function displayErrorMessage(message, showError) {
    const errorMessageDiv = document.querySelector(".error-message");
    if (showError) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display="block";
        resultBox.innerHTML="";
    } else {
        errorMessageDiv.textContent = "";
    }
}
let searchresult=[];
async function getDetails(i){
    let meal= await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${i}`);
    meal= await meal.json();
    console.log(meal);
    meal=meal.meals;
    console.log(meal);
    // searchresult=[...meal]
    // console.log(searchresult);
    return meal
}
function displayResult(result){
    const content =result.map((meal)=>{
        return `<li onclick=selectInput(this)>${meal.strMeal}</li>`;
    });
    resultBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}

async function selectInput(list) {
    inputEl.value = list.innerText;
    resultBox.innerHTML="";
    let meals= await getDetails(inputEl.value);
    resultBox.innerHTML="";
    mealContEl.innerHTML="";
    const mealCards=meals.map((meal,i)=>{
        // meals[i]=meal
        return  `<div class="meal-Card">
        <img src="${meal.strMealThumb}" alt="Meal-Image"/>
        <h3>${meal.strMeal}</h3>
        <div class="btn-cont">
            <button type="button" class="more-details" onclick="moreDetails(${i},event)">More Details..</button>
            <button type="button" class="fav" onclick="AddtoFav(${i},event)">Add to fav</button>
        </div>
    </div>`
    });
    mealContEl.innerHTML=mealCards.join('');

}
searchBtn.addEventListener("click", async function(event){
    event.preventDefault();
    result = await getDetails(inputEl.value);
    console.log(result);
    if (!result) {
        displayErrorMessage("Oops The Meal you are searching is not found ! Please search another meal ", true);
    }
    else {
        resultBox.innerHTML="";
    const mealCards=result.map((meal,i)=>{
        mealss[i]=meal
        return  `<div class="meal-Card">
        <img src="${meal.strMealThumb}" alt="Meal-Image"/>
        <h3>${meal.strMeal}</h3>
        <div class="btn-cont">
            <button type="button" class="more-details" onclick="moreDetails(${i},event)">More Details..</button>
            <button type="button" class="fav" onclick="AddtoFav(${i},event)">Add to fav</button>
        </div>
    </div>`
    });
    mealContEl.innerHTML=mealCards.join('');
    }
});
inputEl.addEventListener("onkeydown",function(event){
    event.preventDefault();
    console.log(result);
    resultBox.innerHTML="";
    const mealCards=result.map((meal,i)=>{
        mealss[i]=meal
        return  `<div class="meal-Card">
        <img src="${meal.strMealThumb}" alt="Meal-Image"/>
        <h3>${meal.strMeal}</h3>
        <div class="btn-cont">
            <button type="button" class="more-details" onclick="moreDetails(${i},event)">More Details..</button>
            <button type="button" class="fav" onclick="AddtoFav(${i},event)">Add to fav</button>
        </div>
    </div>`
    });
    mealContEl.innerHTML=mealCards.join('');
});

function moreDetails(i,event){
    let meal=result[i];
    console.log(meal);
    mealBodyEL.style.display="none";
    const mealPopup=document.getElementById('mealPopup');
    let popupcard =`<span class="close" onclick="closePopup()">&times;</span>
            <img id="popup-image" src="${meal.strMealThumb}" alt="Meal Image">
            <h3 id="popup-mealname">${meal.strMeal}</h3>
            <p id="popup-instructions">${meal.strInstructions}</p>
            <button type="button" class="youtube" onclick="window.open('${meal.strYoutube}', '_blank')">View Recipe On YouTube</button>
            `
    console.log(meal.strYoutube);
    mealPopup.innerHTML=popupcard;
    mealPopup.style.display="block";
}
function closePopup() {
    const mealPopup = document.getElementById("mealPopup");
    mealBodyEL.style.display="block";
    mealPopup.style.display = "none";
}

function AddtoFav(i,event){
    let meal=result[i];   
    console.log(meal);
    const foundIndex=favitems.findIndex(fmeal=>fmeal.idMeal==meal.idMeal);
    const favBtn=event.target;
    if(foundIndex !==-1){
        favitems.splice(foundIndex,1);
        isfavourite=false;
    }else{
        favitems.push(meal);
        isfavourite=true;
    }
    localStorage.setItem('favitems', JSON.stringify(favitems));

    if (isfavourite) {
        favBtn.classList.add("favremove");
        favBtn.innerText="Remove fav"
    } else {
        favBtn.classList.remove("favremove");
        favBtn.innerText="Add to fav"
    }
    console.log(favitems);

}

// adding dropdown
let isDropdownOpen=false;

function toggleDropdown(event){
    if(isDropdownOpen){
        event.target.parentElement.classList.add('dropdown');
        event.target.parentElement.classList.remove('dropdownclose');
        favoritesDropdown.style.display="none";
        location.reload();
    }else{
            event.target.parentElement.classList.remove('dropdown');
            event.target.parentElement.classList.add('dropdownclose');
            displayFav();
        }
    isDropdownOpen = !isDropdownOpen;
    }
function displayFav(){
    const favCards=favitems.map((meal,i)=>{
        return  `<div class="fav-Card">
            <img src="${meal.strMealThumb}" alt="Meal-Image"/>
            <h3>${meal.strMeal}</h3>
            <div class="fav-cont">
                <button type="button" class="remfav" onclick="removeFav(${i},event)">Remove from fav</button>
            </div>
        </div>`
    });
    favoritesDropdown.innerHTML=favCards.join('');
    favoritesDropdown.style.display = "block";
}

function removeFav(findex,event){
    favitems.splice(findex,1);
    localStorage.setItem('favitems', JSON.stringify(favitems));
    displayFav();
}

    // window.onclick = function(event) {
    //     if (!event.target.matches('.dropbtn'||'.dropdown-content') ) {
    //         if (isDropdownOpen) {
    //             favoritesDropdown.style.display = "none";
    //             isDropdownOpen = false;
    //         }
    //     }
    // }

    document.getElementById("homelink").addEventListener("click", function(event){
        event.preventDefault();
        location.reload();
    });

