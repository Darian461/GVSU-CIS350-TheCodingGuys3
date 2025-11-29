# Overview

This document is meant to store all of our functional and non-functional requirements for specific features within our application, Macal.
Any software artifacts (and their corresponding hyperlinks) created throughout production of this project will also be listed here.
Additionally, please see the <b>README.md</b> file located in our GitHub repository for instructions on how to set up, install, and run the project.

# Software Requirements
The purpose of this section is to store all of our functional and non-functional requirements for the features within Macal. <br>

This includes:
<ol>
 <li><b>Creation of Account</b></li>
 <li><b>Log into an Account</b></li>
 <li><b>Searching for Food</b></li>
 <li><b>Logging Food Entries</b></li>
 <li><b>Creation of New Food</b></li>
</ol>

Each feature's functional requirements will be listed first, followed by their corresponding non-functional requirements. Below each feature will be a table with columns corresponding to the ID of the requirement, followed by the written description of the requirement, respectively.

## Functional Requirements

### Creation of Account

| ID  | Requirement     | 
| :-------------: | :----------: | 
| FR1 | The user shall be presented with a landing page leading to a login prompt upon launching the application. | 
| FR2 | When the user clicks on the "Sign up" button from the "Login to your account" page, the user shall be routed to the account registration page. | 
| FR3 | The user shall be prompted to create a account with a "Username", "Email", and "Password". | 
| FR4 | Upon a successful account creation, the user shall receive an "Alert" pop-up informing the user, "Account created successfully. Please log in." |
| FR5 | Upon a successful account creation, the user shall be routed to the "Login to your account" page, where the user's username/email will be automatically filled with the email the user registered the account with. |

### Log into an Account

| ID  | Requirement     | 
| :-------------: | :----------: | 
| FR1 | The user shall be presented with a landing page leading to a login prompt upon launching the application. | 
| FR6 | When the user clicks on the "Log in" button from the "Create a new account" page, the user shall be routed to the login page. | 
| FR7 | When the user clicks the "Log In" button with invalid credentials, the user shall receive an "Alert" pop-up informing the user of "Invalid credentials". | 
| FR8 | When the user clicks the "Log In" button with a password and no email/username in the email/username input field, the user shall receive an "Alert" pop-up informing the user, "Please enter your email or username." |
| FR9 | When the user clicks the "Log in" button with a email/username with no password in the password input field, the user shall receive an "Alert" pop-up informing the user, "Please enter your password." |
| FR10 | Upon a successful login, the user shall be navigated to the "Home" page of the application. | 

### Searching for Food

| ID  | Requirement     | 
| :-------------: | :----------: | 
| FR11 | The user shall be navigated to the "Search Food" home page upon clicking the blue "+" button within the bottom navigation bar. | 
| FR12 | When the user types in the search field, an "X" button shall appear to the right side of the search field. | 
| FR13 | When the user clicks on the "X" button in the search field, the search field shall be cleared. | 
| FR14 | When the user types in a valid food within the USDA Food Database, results of the food shall populate the table below the search field. |
| FR15 | When the user types in an invalid food within the USDA Food Database, "No results found" will be populated within the table below the search field. |
| FR16 | When a valid food within the USDA Food Database is entered by the user, all food entries populated within the table shall be clickable by the user. |

### Logging Food Entries

| ID  | Requirement     | 
| :-------------: | :----------: | 
| FR17 | When the user clicks on a food entry within the table, on successful load of a food entry, a pop-up of nutrition facts shall populate. | 
| FR18 | When the user clicks on a food entry within the table, on unsuccessful load of a food entry, a pop-up notifying the user, "Failed to load nutrition information" will be displayed. | 
| FR19 | When the user clicks on a food entry within the table, on successful load of a food entry, if no nutrition facts are available, a pop-up notifying the user, "No nutrition information available" will be displayed. | 
| FR20 | When the user clicks on a food entry within the table, on successful load of a food entry, the user shall be able to scroll if the "Nutrition Facts" do not fit the entire phone screen. |
| FR21 | When the user clicks on the "Add to Log" button, on successful add of a food entry, the user shall be presented with a "Success" message and the food will be added to the user profile's database history. |
| FR22 | When the user clicks on the "Add to Log" button, on unsuccessful add of a food entry, the user shall be presented with an error message stating, "Failed to add food to log". | 

### Creation of New Food

| ID  | Requirement     | 
| :-------------: | :----------: | 
| FR23 | On navigation to the "Search Food" home page, the user shall have the ability to click on the buttons for "Search Food" and "Create New Food" in the top navigation bar. | 
| FR24 | When the user clicks the "Create New Food" button in the top navigation bar, the user shall be presented with a template to create a new food. | 
| FR25 | When the user clicks the "Create New Food" button in the top navigation bar, the user shall be able to enter the food name, energy (calories), total fat, trans fat, and other nutrients of the food. | 
| FR26 | When the user clicks on the "Add to Food Log" button, on successful add, the user shall be presented with a "Success" message and the food will be added to the user's database history. |
| FR27 | When the user clicks on the "Add to Food Log" button, on an unsuccessful add, the user shall be presented with an error message informing the user, "Failed to add food to log. Please try again". |

## Non-Functional Requirements

### Creation of Account

| ID  | Requirement     | 
| :-------------: | :----------: | 
| NFR1 | All user login information shall be encrypted in the PostgreSQL database. |
| NFR2 | Passwords shall not be viewable at any point. |
| NFR3 | When a user completes "Username", "Email", and "Password" fields, the complete account button shall become functional. |
| NFR4 | When a user enters a unique "Username" and "Email", with a password field, the account creation process shall become functional. | 
| NFR5 | When a user enters either username, email, or password and clicks the "Log in" button, any leading and trailing whitespace shall be removed from the fields. |
| NFR6 | When a user does not input a username, email, or password, the account creation process shall fail. | 
| NFR7 | When a user successfully creates an account, their account information shall be stored in the database. | 

### Log into an Account
| ID  | Requirement     | 
| :-------------: | :----------: | 
| NFR1 | All user login information shall be encrypted in the PostgreSQL database. |
| NFR2 | Passwords shall not be viewable at any point. |
| NFR8 | When a user completes the "Username or Email" and "Password" input fields, the login button shall become functional. |
| NFR9 | When a user does not input a username/email and/or password, the account login process shall fail. | 
| NFR10 | When a user enters either username/email or password and clicks the login button, any leading and trailing whitespace shall be removed from the fields. |
| NFR11 | When a user successfully logs into an account, their food history shall be processed within the backend database. |

### Searching for Food
| ID  | Requirement     | 
| :-------------: | :----------: | 
| NFR12 | Searching for a food shall call upon the USDA Food Database API and return the resulting food entries. |
| NFR13 | Upon failing a query, two more calls to the API shall be made until the call is successful or an error is triggered. |
| NFR14 | Querying shall attempt to match user input to results within the USDA Food Database even if it is not a full match. |
| NFR15 | If present, brand name shall populate within the food entry, else there will be no brand name. | 
| NFR16 | Searching for a food entry shall happen dynamically, allowing for incremental searching every 0.5 seconds. |

### Logging Food Entries
| ID  | Requirement     | 
| :-------------: | :----------: | 
| NFR17 | Adding food entries shall dynamically change the pie chart displaying the main calories and macronutrients selected on the "Home", and "Stats" screen. |
| NFR18 | Removing food entries shall dynamically change the pie chart displaying the main calories and macronutrients selected on the "Home", and "Stats" screen. |
| NFR19 | Resulting values for nutrients shall be limited to 2 decimal places. |
| NFR20 | Food entries within the USDA Food Database with units in Kilojoules shall be converted to Kilocalories. | 
| NFR21 | Food entry values shall be sorted in prioritizing order from "Calories", "Carbs", "Protein", and "Fat", with any other nutrient following after. |

### Creation of New Food
| ID  | Requirement     | 
| :-------------: | :----------: | 
| NFR22 | The "Food Name" entry shall be a required field. |
| NFR23 | All nutrition fact entries shall be error validated for integers less than zero. |
| NFR24 | All input fields shall be mapped to a "Nutrients" interface. |
| NFR25 | All nutrition fact entries shall be mapped with their corresponding unit of measurement. | 
| NFR26 | No nutrition values shall be required for submission to the database. |

# Software Artifacts

The purpose of this section is to showcase every software artifact, along with their corresponding hyperlink, created and utilized throughout the development process of Macal.

* [Use Case Diagram](https://github.com/Darian461/GVSU-CIS350-TheCodingGuys3/blob/main/artifacts/use_case_diagram/CIS350_Use_Case_Diagram.pdf) <br>
* [Use Case Description](https://github.com/Darian461/GVSU-CIS350-TheCodingGuys3/blob/main/artifacts/use_case_diagram/use_case_description.md) <br>
* [Low-fidelity prototype 1](https://github.com/Darian461/GVSU-CIS350-TheCodingGuys3/blob/main/artifacts/Low-fidelity%20Prototype%201.jpg)
* [Low-fidelity prototype 2](https://github.com/Darian461/GVSU-CIS350-TheCodingGuys3/blob/main/artifacts/Low-fidelity%20Prototype%202.jpg)
* [Low-fidelity prototype 3](https://github.com/Darian461/GVSU-CIS350-TheCodingGuys3/blob/main/artifacts/Low-fidelity%20Prototype%203.jpg)
* [High-fidelity prototype 1 (Figma)](https://www.figma.com/make/Dx9uUfryaGW98N1dnprNAn/Macro-Calorie-Tracker-Page?node-id=0-1&t=TYwmVP1irnCTCt7y-1)
* [High-fidelity prototype 2 (Figma)](https://www.figma.com/make/AfriNvkx11NLS3nsM2zQ3i/Fitness-Tracker-Page?node-id=0-1&t=W9dDNbAZk02a4FF1-1)
* [Project Proposal](https://github.com/Darian461/GVSU-CIS350-TheCodingGuys3/blob/main/docs/proposal-template.md)
* [Jira Board](https://thecodingguys3.atlassian.net/jira/software/projects/SCRUM/boards/1?sprintStarted=true)
* [Meeting Notes](https://github.com/Darian461/GVSU-CIS350-TheCodingGuys3/tree/main/meetings)
* [Burn-Down Chart](https://github.com/Darian461/GVSU-CIS350-TheCodingGuys3/blob/main/docs/Burn_Down_for_TheCodingGuys_1.png)
* [Mid-Semester Task Breakdown](https://github.com/Darian461/GVSU-CIS350-TheCodingGuys3/blob/main/docs/hw4_tasks.md)
* [Mid-semester Software Requirements](https://github.com/Darian461/GVSU-CIS350-TheCodingGuys3/blob/main/docs/software_requirements_specification.md)



