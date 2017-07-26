function app(people){
  var searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  switch(searchType){
    case 'yes':
      searchByName(people);
      break;
    case 'no':
       searchByTraits(people);
      break;
    default:
      app(people);
      break;
  }
}

function mainMenu(person, people){
  
  if(!person){
    alert("Could not find that individual.");
    return app(people);
  }

  var displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch(displayOption){
    case "info":
     displayPerson(person, people);
      break;
    case "family":
      displayFamily(person, people);
     break;
    case "descendants":
     displayDescendants(person, people);
     break;
    case "restart":
     app(people);
      break;
    case "quit":
      return;
    default:
      return mainMenu(person, people);
  }
}

function searchByTraits(people) {
  var listed = "";
  var filteredList;

  filteredList  = searchByAge(people);
  filteredList = searchByHeight(filteredList);
  
  if(filteredList.length === 22){
    alert("You said no to all filters, there is no one to display.");
    app(people);
  }
  else{
    for(var i = 0; i < filteredList.length; i++){
    listed += filteredList[i].firstName + " " + filteredList[i].lastName + ". ";
    alert(listed);
    app(people);  
    }
  }
}

function searchByHeight(people){
  var heightSearch = promptFor("Do you want to search by height? Enter yes or no.", yesNo).toLowerCase();

  switch(heightSearch){
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
    return element.age = age;
  });
}

function lookUpAge(people) {
  var age = parseInt(promptFor("What is the person's age?", chars));
  var ageFilteredArray = people.filter(function(element) {
    if (element.age === age){
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
    if(element.firstName.toLowerCase() === firstName.toLowerCase() && element.lastName.toLowerCase() === lastName.toLowerCase()){
      return true;
    }
  });

  person = personFoundArry.pop();

  mainMenu(person, people);
}

function displayPerson(person, people){
  var parent = getParents(person, people);
  var spouse = getSpouse(person, people);
  
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
  
  alert(personInfo);
  app(people);
}

function displayFamily(person, people){
  
  var parent = getParents(person, people);
  var spouse = getSpouse(person, people);
  var siblings = getSiblings(person, people);
  var children = getChildren(person, people);
  var personFamily = "Parents: " + parent + "\n";
  
  personFamily += "Spouse: " + spouse + "\n";
  personFamily += "Siblings: " + siblings + "\n";
  personFamily += "Children: " + children;

  alert(personFamily);
  app(people);
}

function displayDescendants(person, people){
  
  var descendants = findDescendants(person, people);

  if(descendants.length === 0){
    descendants = "Descendants not in data set."
  }

  alert(descendants);
  app(people);
}

function findDescendants(person, people){
  
  var descendant = getDescendants(person, people);
  var descendantsToReturn = "";

  for(var i = 0; i < descendant.length; i++){
    descendantsToReturn += descendant[i].firstName + " " + descendant[i].lastName + ". ";    
    
    if(i >= 0){
      var grandChildren = findDescendants(descendant[i], people);
      descendantsToReturn += grandChildren;
    }
  }

  return descendantsToReturn;
}

function getDescendants(person, people){
  
  var descendants = [];

  descendants = people.filter(function(element){
    if(element.parents.length === 0){
      return false;
    }
    else if(element.parents[0] === person.id || element.parents[1] === person.id){
      return true;
    }
  });

  return descendants;
}

function getChildren(person, people){
  
  var children = [];
  var childrenToReturn = "";

  children = people.filter(function(element){
    if(element.parents.length === 0){
      return false;
    }
    else if(element.parents[0] === person.id || element.parents[1] === person.id){
      return true;
    }
  });

  for(var i = 0; i < children.length; i++){
  childrenToReturn += children[i].firstName + " " + children[i].lastName + ". ";
  }

  if(children.length === 0){
    childrenToReturn = "Children not in data set.";
  }

  return childrenToReturn;
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

function promptFor(question, valid){
  
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
}

function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

function chars(input){
  return true;
}

function getParents(person, people){
  
  var parents = [];
  var parentsToReturn = "";

  if(person.parents.length === 0){
    return "Parents not in data set.";
  }
  else {
    parents = people.filter(function(element){
      if(element.id === person.parents[0] || element.id === person.parents[1]){
        return true;
     }
    });
  }

  for(var i = 0; i < parents.length; i++){
    parentsToReturn += parents[i].firstName + ". " + parents[i].lastName + ". ";
  }

  return parentsToReturn;
}

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