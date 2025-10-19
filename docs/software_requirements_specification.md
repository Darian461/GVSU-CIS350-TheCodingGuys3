# Overview

This document is meant to store all our functional and non functional requirements for specific features within our applicaiton. 

# Functional Requirements

1. Creation of account
	R1: When the user clicks on the "Register" button, the user shall be routed to a registration page.
	R2: Account shall be created with user, email, and password.

2. Logging Food 
	R3: The user shall be able to log food entries within the "Macros" page by clicking the "+" button in the bottom navigation bar. 
	R4: The user shall be able to see table of food macros and micronutrients in a table. 
	R5: The user shall be able to remove food entries.

# Non-Functional Requirements

1. Creation of account
	NR1: When user completes user, email, and password fields, the complete account button shall become functional.
	NR2: When user and email is unique, the complete account shall become functional.
	NR3: All user login information shall be encrypted in the PostgreSQL database. 
	NR4: Passwords shall not be viewable at any point. 

2. Logging Food
	NR5: Adding or removing food entries shall dynamically change the pie chart displaying the main calories or macronutrient selected on the "Macros" screen.
	NR6: Adding or removing food entries shall dynamically change the protein bar chart on macro home page.
	NR7: Adding or removing food entries shall dynamically change the carb bar chart on macro home page.
	NR8: Adding or removing food entries shall dynamically change the fat bar chart on macro home page.
