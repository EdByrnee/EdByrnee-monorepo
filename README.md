# Ed Byrne Monorepo

This project hosts all projects and apps I am working on.

This is to encourage code reuse between all projects under my control, reducing the cognitive load and to reduce the amount of boilerplate code I have to write.

This can be personal projects, and commercial projects that are fully under my control.

However, any repos involving other people e.g. Ardanis, should be kept separate. This is to avoid any confusion over ownership of code.

Here are the projects I am currently working on (table):

Projects include multiple apps.

| Project Name | Description | Tech Stack | Status |
| ------------ | ----------- | ---------- | ------ |
| Local Shelf  | The aim of this is to launch an app that can later be sold. |            | In Development       |
| Sugar Rush   | The aim of this is to launch an app that can later be sold. |            | In Development       |
| Ed Byrne     | A collection of personal applications.                      |            | In Development       |


## Install nxtend for ionic-angular

nx g @nxext/ionic-angular:application
npm install --save-dev --exact @nxext/ionic-angular --legacy-peer-deps

nx generate @nxext/ionic-angular:application app --legacy-peer-deps

## Extensions used

@nxext (used to ge)
https://nxext.dev/docs/capacitor/generators.html

## Add capacitor to project

npm install --save @nxext/capacitor@14.0.0 --legacy-peer-deps

## Add capacitor to project

nx generate @nxext/capacitor:capacitor-project --project appacut-app

## Add native platforms

nx run appacut-app:add:ios
nx run appacut-app:add:android

## Add native platforms

nx run appacut-app:sync:ios
nx run appacut-app:sync:android

## Open native platforms

nx run appacut-app:open:ios
nx run appacut-app:open:android

## Capacitor plugins

Capacitor plugin dependencies must be added to the project-level package.json.

## Build and sync

nx build --configuration=--production && nx run appacut-app:sync:ios && nx run appacut-app:open:ios

nx build --configuration=--production && nx run appacut-app:sync:android && nx run appacut-app:open:android

## Environment vars

AWS_DEFAULT_REGION=eu-west-1

## GCP vars

You can use the GOOGLE_APPLICATION_CREDENTIALS environment variable to provide the location of a credential JSON file. This JSON file can be one of the following types of files:

1. A credential configuration file for workload identity federation
2. A service account key

npm uninstall --save @capacitor/google-maps --legacy-peer-deps
npm uninstall --save aws-sdk/client-s3 --legacy-peer-deps
npm uninstall --save @aws-sdk/s3-request-presigner --legacy-peer-deps

# Docker

## Build & run the image

docker-compose build && docker-compose up

## Tag and upload to container image registry

1. Tag with container reg path
   docker tag local-shelf-api gcr.io/localshelf/local-shelf-api

2. Push to container reg
   docker push gcr.io/localshelf/local-shelf-api

### Generating ios/Android resources (splash screen and icons)

## Android

There is currently a bug in cordova-res, where it does not support adaptive icons. The only reliable way to ensure icons are working on Android across all APIs is to generate the icons inside of Android studio itself.

To generate the required icons:

1. Convert your SVG to XML
   (SKIP: We have already save the foreground image xml inside of the repo) C:\Users\ed_b\Desktop\future-planet\apps\personal-carbon-footprint\src\resources\foreground.xml
   Do this inside Android Studio, right click on app-> res select 'New Vector Asset' and browse to your SVG, this will output XMl.
   This will attempt to save the XML file to your AS project.

2. Generate the icon set from the XML
   Browse to [app] -> [res] right click then select on 'New Image Asset'
   Foreground layer, select the .xml file
   Background select a hex color (#29434A)
   Options ensure legacy icons are created for backward compatability
   Click next -> next and confirm you wish to replace any pre-exisiting files

#### Keystore

Keystore file is available at:
apps/appacut-app/new-key-store

To view it's checksum:

keytool -list -v -keystore apps/appacut-app/new-key-store

play console
adb cert
local cert

#### Deep links

Open deep link on phone
adb shell am start -W -a android.intent.action.VIEW -d "https://localshelf.market/sell" market.localshelf

Check deep link verification state
adb shell pm get-app-links market.localshelf

# Google Analytics

Registered Events:

1. open app?
2. set_postcode
3. ALL PAGE CHANGES!!
4. login
5. logout
6. order_created

# Delli Scraping

export SCRAPE_JWT=eyJhbGciOiJSUzI1NiIsImtpZCI6IjM4NTU4RUMzNTVBMzg2NkIyM0E5N0U1NTNFQzkyNEZDM0Q5REY5NTMiLCJ0eXAiOiJKV1QifQ.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImZCZlZjQmEwWFUyYTE5OXEyZXprd0EiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJFRF9CQEhPVE1BSUwuQ08uVUsiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwibmJmIjoxNjc5MDk3NDA5LCJleHAiOjE2NzkxMDEwMDksImlzcyI6Imh0dHBzOi8vZGVsbGkubWFya2V0IiwiYXVkIjoiaHR0cHM6Ly9kZWxsaS5tYXJrZXQifQ.QaEZKOcxT9iyNLHYq2SkmZz74YMpcHwPhTOJpQlZrnH2MtLagxE5OaIiPXA7vuiaPhohJW-5kQfis9rsH77MePhYaQco8iV0LDiL7-I2Z3a7a37G5dsaOiD4z42JGsZ5BtkkjGD_CxM-uuyaHcvCETsIspKx4lFMBzVjzQlHSg-c8Xb9KP2G2u9QC3ZZH-iL7NGE5u7QMmMreaDMkPBuV5TfItOofBpc5IBrO4I4jM-LvvQ7wG5QCWJyirmJ94dsRqUQ6IwpMs3YfzvBee1ZcT-2CpC8XOEDnFVb0NZxM2LDiWCJHMuwWCahj5wYsAZxxrvUbCdL9HYCS8hmookDwg

export SCRAPE_REFRESH_TOKEN=8S7SVDgm25EfmbLQUzwBK_ZAHT7GYZQ53jILdMAxVY_ycK7fSEvAn6wtytKw52uQoCr_mJl84wUotcjxFTKRtw

export SCRAPE_MD5=7197458ea1141a923e3fb9f17a343fe5

export START_CURSOR="NA=="

printenv SCRAPE_MD5