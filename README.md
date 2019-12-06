# Create your own BERT web app — End-to-end tutorial

This is the repo for the Peltarion Platform tutorial [Create your own BERT web app](https://peltarion.com/knowledge-center/tutorials/pop-or-rock). We will show you how to build an app that use a pretrained and fine tuned BERT model to classify lyrics as pop or rock. 

You could use this demo for similar problems, like for important things like joke classifiers.

**Tutorial steps**

This tutorial will show you the three main steps of a data science workflow:
1. Preprocess a dataset to make it fit your model in a Jupyter Notebook.
1. Build, train and deploy a BERT model in the Peltarion Platform.
1. Create a web app that will be able to determine if a song lyric is pop or rock.

### Clone and download this repository

Start by cloning and download this repo to your computer.

## Preprocess data in a notebook

Every deep learning project start with finding and preprocessing the data. For this tutorial tutorial we have created the [pop_rock_classifier.ipynb](data_preparation/pop_rock_classifier.ipynb) notebook. Follow the instructions in the notebook to create a well balanced dataset that is fit for the platform.

### Open the notebook

In a terminal navigate to the _/demo-pop-or-rock/data_preparation/_ directory and run:

`jupyter notebook pop_rock_classifier.ipynb`

## Build, train, and deploy model on the Peltarion Platform

If you don't have an account yet, [here's where you sign up](https://peltarion.com/signup). It's all free, and you get instant access.

Navigate to the the tutorial "[Pop or rock? Create your own app and let BERT decide](https://peltarion.com/knowledge-center/tutorials)" on the Peltarion Knowledge center. Follow the instructions on how to:
* Import the dataset you created in the [pop_rock_classifier.ipynb](data_preparation/pop_rock_classifier.ipynb) notebook
* Quickly and effortlessly create a text _pop or rock_ model using our prebuilt BERT snippet
* Deploy the trained model.

# Create a web app with the content in this repo

Once you have deployed your trained _pop or rock_ model follow the instructions below to create a web app that uses the model.

## Set up the configuration first

**Create app-config.json**

Create a configuration file based on our example config file: [`sample-config.json`](sample-config.json). Name this file `app-config.json` (it must be this name).

**Create a config-folder**

Create a `config/`folder and save your new configuration file there. We have entered the folder `config/` in `.gitignore` so it's safe to put config files there. 

![Location of app-config.json](docs/appConfigJsonPlacement.png)

### Copy and paste deployment URL and token

Go to the Deployment view of your project and find the deployment's URL and Token.

![Deployment URL and token](docs/DeploymentURL_token.png)

Copy the deployment URL and token and paste them in the newly created configuration file `app-config.json`.

### Get an API key from Giphy

_Note: This is obviously only needed if you want to use Giphy, it should be easy to remove the to getResponseImage and the code that shows the image from main.js._

 - Go to [https://developers.giphy.com/docs/sdk](https://developers.giphy.com/docs/sdk)
 - Click "Create an App" and follow the instructions
 - Copy the ApiKey and paste it into the configuration file

## Start the app with npm

In a terminal navigate to the directory where you cloned this repository.

Run:

`npm install` _(if needed)_

`npm start` (_will use the app-config.json you created above_)

## Test the classifier in a browser

Open a browser and enter the address the [https://127.0.0.1:3000](https://127.0.0.1:3000). 

Go search the internet for your favourite pop or rock lyric. Copy paste in the web app and hit the submit button. Is your model correct?

![Lyrics web app](docs/PopOrRockGif.gif)

## Additional info

### Docker

We have provided a [dockerfile](Dockerfile) that is useful if you prefer to run the application without installing node or to host it in the cloud using services like e.g., [Google Cloud Run](https://cloud.google.com/run/) or similar.

In the packacge.json there are a few commands that will help you with various Docker tasks.

### Service description

Since the app integrate with other services that requires secret tokens, we cannot call these services directly from the frontend. 
Therefore, we need a dedicated API for the service. This is also good because we can manage some degree of pre/post-processing and optimizations if needed (e.g., truncation of the text, caching of results, etc.).

There are two components:
1. API
2. Client HTML & Javascript code

Currently both components will be served by NodeJS. In a live scenario you may consider using a high performant web server like nginx for the static files. (Aesthetically it may also be a prettier solution this way because we separate the concerns - UI vs API). Anyway, we keep it simple for now. One service it is. 

### Differences from original version

The version in this repository has the following differences from the  [original version](https://pop-or-rock.demo.peltarion.com/):

- Background images from the Noun project has been replaced with single-color placeholder images since we cannot redistribute these files
- All share-links have been removed (but by all means, please add your own :) )
- The top bar has been removed 