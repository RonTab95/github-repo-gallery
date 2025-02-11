//variables used in this project
const overView = document.querySelector(".overview");
const info = document.querySelector(".user-info");
const username = "rontab95";
const repoList = document.querySelector(".repo-list"); //<==repos list 
// where all the repo information appears 
const reposSection = document.querySelector(".repos");
// where the individual repo data will appear
const repoData = document.querySelector(".repo-data");
viewRepoButton = document.querySelector(".view-repos")
//filter-repos class
filterInputs = document.querySelector(".filter-repos");

//API function to fetch API JSON Data
const getRepos = async function () {
    const userRequest = await fetch(`https://api.github.com/users/${username}`);
    const jsonData = await userRequest.json();
    userInfo(jsonData);
};
// Callback to function 
getRepos();
//Function to append data to the html 
const userInfo = function (jsonData) {

    let div = document.createElement("div");
    div.classList.add("user-info"); //<==add user-info class
    div.innerHTML = //<==5 placeholders
        `<figure>
      <img alt="user avatar" src=${jsonData.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${jsonData.name}</p>
      <p><strong>Bio:</strong> ${jsonData.bio}</p>
      <p><strong>Location:</strong> ${jsonData.location}</p>
      <p><strong>Number of public repos:</strong> ${jsonData.public_repos}</p>
    </div>`;
    //Append the data 
    overView.append(div);
    // console.log(jsonData);
};

//Function to fetch user the repo data for the UL li
const fetchRepos = async function () {
    const userRequest = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await userRequest.json();
    // console.log(repoData);
    //Function callback to disp the repo list
    dispRepoInfo(repoData);
    filterInputs.classList.remove("hide"); //<==show search box
};
//Callback to function to fetch the repo data
fetchRepos();

//Display list items of the UL
const dispRepoInfo = function (repoData) {
    repoList.classList.remove("hide");
    for (let title of repoData) {
        let repoLists = document.createElement("li"); //<==create list item
        repoLists.classList.add("repo"); //<==add a class repo
        repoLists.innerHTML = `<h3>${title.name}</h3>`
        repoList.append(repoLists);
        console

    }
};

// Event listener for the unordered list
repoList.addEventListener("click", function (e) {
    e.preventDefault();
    // check if the h3 was clicked
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        // console.log(repoName); //<==test log the clicked li
        getSpecificRepo(repoName); //<==callback to get repo info
    }
});
//  function to get specific repo information
const getSpecificRepo = async function (repoName) {
    const repoRequest = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await repoRequest.json();
    //fetch data from language_url property
    const fetchLanguages = await fetch(
        repoInfo.languages_url //<==fetch from the repo the language info
    );
    // save the JSON response
    const languageData = await fetchLanguages.json();
    // console.log(repoInfo); //<==test log

    //Declare an empty array that will push the data from 
    //languageData into the array
    const repoLanguages = [];
    for (let elements in languageData) {
        repoLanguages.push(elements);
        // console.log(repoLanguages); //<<==test log the array
    }
    // console.log(languageData);
    dispSpecificRepoInfo(repoInfo, repoLanguages);
};
// function to get specific repo information
const dispSpecificRepoInfo = function (repoInfo, languages) {
    // empty the HTML of the section with a class of “repo-data”
    repoData.innerHTML = "";
    // console.log(repoData);//<==test log for the values we will use
    //create a div to append the innerHTML
    const infoRepodiv = document.createElement("div");
    // console.log(repoInfo);//<==where we will get the API endpoints
    repoData.innerHTML =
        `<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;
    repoData.append(infoRepodiv);
    // console.log(repoInfo);
    repoList.classList.add("hide");
    repoData.classList.remove("hide");
    filterInputs.classList.add("hide");
    viewRepoButton.classList.remove("hide");
};
//This is the back button
viewRepoButton.addEventListener("click", function () {
    repoList.classList.remove("hide");
    repoData.classList.add("hide");
    filterInputs.classList.remove("hide");
    viewRepoButton.classList.add("hide");
});
// Event Listener for the  search box
filterInputs.addEventListener("input", function (e) {
    e.preventDefault();
    let inputSearch = e.target.value; //<==search text
    const repos = document.querySelectorAll(".repo");
    lwrCase = inputSearch.toLowerCase(); //<==lowercase value of the input search 
    // console.log(lwrCase);
    // console.log('New text is "' + lwrCase + '"');//<==test log the input search
    for (let repo of repos) {
        let lwrInnerText = repo.innerText.toLowerCase();
        if (!lwrInnerText.includes(lwrCase)) { //<==if search text does
            // not match hide it.
            repo.classList.add("hide");
        } else {
            repo.classList.remove("hide"); //<else there it's match
            // show it.
        }
    }
});