# File Storage Module/Service

This is a flexible file storage service wrapped as a NestJS module.
Simply import this module into your NestJS project and you should have everything you need to get file storage services up and running.



#### Scenarios of use (Uploading)

1. Upload an array of files (or just a single file) using service or controller


#### Scenarios of use (Retriving Files)

1. Retrive a file (single or more) using its URL(s)

If you already know the URL, then just access it, there is no need to contact this service

<!-- 2. Retrive a list of assets associated with objectUuid(s)

You can either:
(a) Use the fileService.getAssetsAssociatedWithUuids(uuids: string[])
(b) Or use the endpoint /get-associated-with-objects/{array-of-uuids}

=> Then directly request the object using it's URL -->



## Future Work
Private files
Files associated to object (decision was made to hold this logic elsewhere)
Meta data
