/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  var searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  switch(searchType){
    case 'yes':
    // TODO: search by name
    searchByName(people);
    break;
    case 'no':
    // TODO: search by traits
    searchByTraits(people);
    break;
    default:
    app(people); // restart app
    break;
  }
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  var displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch(displayOption){
    case "info":
    // TODO: get person's info
    displayPerson(person, people);
    break;
    case "family":
    // TODO: get person's family
    displayFamily(person, people);
    break;
    case "descendants":
    // TODO: get person's descendants
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

function searchByTraits(people) {

  var ageFiltered = searchByAge(people);

  var heightFiltered = searchByHeight(ageFiltered);

  //var height = parseInt(promptFor("What is the person's height", chars));
  //var weight = promptFor("What is the person's weight", chars);
  // var occupation = prompt("What is the person's occupation");
  // var eyeColor = prompt("What is the person's eye color?");

}

function searchByHeight(people) {
  var heightSearch = promptFor("Do you want to search by height? Enter yes or no.", yesNo).toLowerCase();
  switch(heightSearch) {
    case "yes":
    var findHeight = lookUpHeight(people);
    return findHeight;
    case "no" :
    return people;
    default:
    searchByHeight(people);
    break;
  }
}

function lookUpHeight(people) {
  var height = parseInt(promptFor("What is the person's height?", chars));
  var heightFilteredArray = people.filter(function(element) {
    if (element.height === height){
      return true;
    }
  });
  return heightFilteredArray;
}

function searchByAge(people){  
  var ageSearch = promptFor("Do you want to search by age? Enter yes or no.", yesNo).toLowerCase();
  switch(ageSearch){
    case "yes":
    changeDobToAge(people);
    //x = people;
    //findAge holds the filteredAge array
    var findAge = lookUpAge(people);
    return findAge;
    case "no":
    return people;
    default:
    searchByAge(people);
    break;
  }
}

function changeDobToAge(people) {
  var peopleAge = people.map(function(element) {
    var x = new Date(element.dob);
    var y = new Date();
    var result = y - x;
    var age = Math.floor(result/31536000000);
    return element.dob = age;
  });
}

function lookUpAge(people) {
  var age = parseInt(promptFor("What is the person's age?", chars));
  var ageFilteredArray = people.filter(function(element) {
    if (element.dob === age){
      return true;
      }
  });
  return ageFilteredArray;
}

function searchByName(people){
  var firstName = promptFor("What is the person's first name?", chars);
  var lastName = promptFor("What is the person's last name?", chars);
  var person;
  var personFoundArry = [];
  
  personFoundArry = people.filter(function(element){
    if(element.firstName === firstName && element.lastName === lastName){
      return true;
    }
  });

  person = personFoundArry.pop();

  mainMenu(person, people);
}

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person, people){
  var parent = getParents(person, people);
  var spouse = getSpouse(person, people);

  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  var personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Gender: " + person.gender + "\n";
  personInfo += "DOB: " + person.dob + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Eye Color: " + person.eyeColor + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  personInfo += "Parents: " + parent + "\n";
  personInfo += "Spouse: " + spouse;
  // TODO: finish getting the rest of the information to display
  alert(personInfo);
}

function displayFamily(person, people){
  var parent = getParents(person, people);
  var spouse = getSpouse(person, people);
  var siblings = getSiblings(person, people);

  var personFamily = "Parents: " + parent + "\n";
  personFamily += "Spouse: " + spouse + "\n";
  personFamily += "Siblings: " + siblings;

  alert(personFamily);
}

function getSiblings(person, people){
  var siblings = [];
  var siblingsToReturn = "";

  if(person.parents.length === 0){
    return "Siblings not in data set.";
  }
  else{
    siblings = people.filter(function(element){
      if(element.parents.length === 0){
        return false;
      }
      else if(element === person){
        return false;
      }
      else if(element.parents[0] === person.parents[0] || element.parents[0] === person.parents[1]){
        return true;
      }
      else if(element.parents[1] === person.parents[0] || element.parents[1] === person.parents[1]){
        return true;
      }
    });
  }

  for(var i = 0; i < siblings.length; i++){
  siblingsToReturn += siblings[i].firstName + " " + siblings[i].lastName + ". ";
  }

  return siblingsToReturn;
}

// function that prompts and validates user input
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input){
  return true; // default validation only
}

//find parents
function getParents(person, people){
  var parents = [];
  var parentsToReturn = "";

  if(person.parents.length === 0){
    return "Parents not in data set.";
  }
  else{
    parents = people.filter(function(element){
     if(element.id === person.parents[0] || element.id === person.parents[1]){
        return true;
     }
    });
  }

  // TODO: Fix ending of string.
  for(var i = 0; i < parents.length; i++){
    parentsToReturn += parents[i].firstName + ". " + parents[i].lastName + ". ";
  }

  return parentsToReturn;
}

//find Spouse
function getSpouse(person, people){
  var spouse;
  var spouseArray = [];
  var spouseToReturn = "";

  if(person.currentSpouse === null){
    return "Spouse not in data set.";
  }
  else{
    spouseArray = people.filter(function(element){
     if(element.id === person.currentSpouse){
        return true;
     }
    });
  }

  spouse = spouseArray.pop();

  spouseToReturn = spouse.firstName + " " + spouse.lastName;

  return spouseToReturn;
}
