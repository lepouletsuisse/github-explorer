# Labo01: Mining data in GitHub
Made by [Le Poulet Suisse](https://github.com/lepouletsuisse) for the course TWEB gave by [Olivier Liechti](https://github.com/wasadigi) and his assistants Simon Oulevay and Laurent Prévost.
##Purpose of the application
This application will show you a graphic with the commit over time of a repository that you have specified. The Y-Axe is the number of commit in one date and the X-Axe is the dates. I only display the date with a commit because date without commit are not really interesting.

##Technology used
- [GitHub Pages](https://pages.github.com/) for the landing page.
- [Heroku](https://www.heroku.com/) app to get my application on the Web.
- [Angular-JS](https://angularjs.org/) for the front-end.
- [NodeJS](https://nodejs.org/) for the backend.
- [Chart.js](http://www.chartjs.org/) for the graphic.
- [Request-Promise](https://www.npmjs.com/package/request-promise) for the request from the back-end.
- [$http](https://docs.angularjs.org/api/ng/service/$http) (from Angular-JS) for the request from the front-end.
- [Jekyll](https://jekyllrb.com/) only used for testing mechanics.
- [UI-Router](https://ui-router.github.io/docs/0.3.1/#/api/ui.router) for the routing service.

##Getting started
1. For using the application, simply go on the [Landing page](https://lepouletsuisse.github.io/github-explorer/) and click on the "Go to the App" green button on the top of the page.
2. When you are in the application, you can navigate on the second page (Page 2) with the top right menu icon.
3. Once you are in the application, you have different options:
	- Specify a owner and a repository to query on github.
	- Click on one of the link that is display (If queries has already be done only) to show a old query.
	- Delete all the precedent queries in the API (If you want to update them for exemple)

##Description
###Preamble
I'll explain the application part and not the Landing Pages because i only followed the well explained [tutorial on GitHub Pages](https://pages.github.com/) and used the base template of jekyll for this part.
So i'll explain the logic in the Page2 folder of my app and my API (Back-end).
###Logic of the application
Once the user did a request, the following schemes will be applied, depending if the data already exist in the DB or not and the type of request:
- When we enter something in the field and the data doesn't exists:
	1. HTML (The user do his query and send it to the controller)
	2. Controller (Ask to the service to give the data)
	3. Service (Ask the backend to give the data)
	4. API (Ask to GitHub API to get the data)
	5. GitHub API (Send the data to my API)
- When we enter something in the field and the data already exists:
	1. HTML (The user do his query and send it to the controller)
	2. Controller (Ask to the service to give the data)
	3. Service (Ask the backend to give the data)
	4. API (Look in the DB and respond to the service with the data stored)
- During the initialisation for the old queries:
	1. HTML (Ask the controller for the old queries)
	2. Controller (Ask the service for the old queries)
	3. Service (Ask the API for the old queries)
	4. API (Get the old queries in the DB and send them to the service)
- When we ask to delete the old queries:
	1. HTML (Ask the controller to delete the old queries)
	2. Controller (Ask the service to delete the old queries)
	3. Service (Ask the API to delete the old queries)
	4. API (Delete the old queries in the DB and send a response to the service 			including if it could be deleted or not)
- When we click on a old query:
	1. HTML(Get the id of the query and look in the dictionnary created previously during the initialisation phase for the right data)

When the old queries are initiate, i choosed to store them in a dictionnary on client side and to use them when i need them. A other possibility was to do a other request to the API to get this data and it would probably be better. I know that the solution i choosed could be a problem if we do a lot of different query without deleting them. The best solution would probably be to keep the data in the DB and only give the ID to the front-end during the initialisation. So when we click on a query, we just have to ask to the DB for the data with the given ID.

For all the request to the API, the server can respond by a 200 or a 500 depending if errors happened. If a 500 come from the API, we display the error message for the user (Error messages are create in my API, like "The owner/repo doesn't exist" or "Internal server error" if the probleme is due to something that the user has not to know).

###Front-End
#####HTML
The HTML part is using a simple HTML template [Spectral](https://html5up.net/spectral). This is the view of my application.
I had to create my own directive for beeing able to generate dynamic link for the old queries. In fact, the default directive "ng-html-bind" didn't accept the ng tag "ng-click" when i tried to generate my links, due to the fact that he doesn't consider it as a valid HTML attribute. So i had to search on google for a solution and found a solution on [Stack Overflow](http://stackoverflow.com/questions/17417607/angular-ng-bind-html-and-directive-within-it) with a custom directive. I juste copy/paste it with no change. The directive is called "compile" and i use it for the dynamic links and for the result message from the request to delete the old queries.
#####Controller
The Page2Ctrl will manage the HTML view by setting the variables of the view and call the appropriate service to get the correct information asked by the user.
#####Service
The Page2Service will do the link between my front-end and back-end by sending the request asked by the user to the back-end and get the response to send it again to the controller.
#####Route
Everything after "/#!/" URI is redirect on Page1, Page2 or Page3 if the URL is correct or Page1 otherwise.

###Back-end
#####API - Explication
My API is quite simple and has only 1 endpoint with 3 differents types of CRUD request on it. I choosed this method instead of having differents endpoints because the logic of my application allowed me to do it. I only need to POST an owner/repo on the server to get the data back, GET all the old queries and DELETE all the old queries. We can easily imagine other endpoints if we want to do a user system or to give the possibility to manage query.

#####API - Endpoint
Here it is a table about my API. The URI for my API is {baseURI}/api and only accept 3 type of CRUD operations:

|Endpoint|Description|Parameters|
|:---:|:---:|:---:|
|GET /api|Get all the old queries store in the DB|-|
|POST /api|Get the data for the combinaison owner/repo gave in the parameter|`?owner=<theOwner>&repo=<theRepo>`|
|DELETE /api|Delete the collection of old queries|-|