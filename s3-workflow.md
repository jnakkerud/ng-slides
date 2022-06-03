# Workflow for serving photos from amazon s3

## Prerequisites

- Amazon s3 account
- aws cli installed https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
- Create a photos project folder, i.e. `~/Downloads/my-slideshow`
- `../slides-upload` directory exists from git project root

## Workflow

1. Use a photo editing app (i.e. Mac photos app) to edit photo to have an aspect ratio 16:9. Add a Title, Description in the Info for the photo (or save the file in format x-x.jpeg). Export to a project folder  (quality high, size large)
2. Create a project bucket in s3:
```
aws s3 mb s3://<project>
```
3. Set the bucket CORS in the bucket permissions. i.e. :
```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "POST",
            "HEAD"
        ],
        "AllowedOrigins": [
            "https://jnakkerud.github.io"
        ],
        "ExposeHeaders": []
    }
]
```
4. Upload files (aws s3 sync)  from project folder (current directory) to s3 bucket and photos folder - make sure has public read access:
```
aws s3 sync . s3://<project>/photos --acl public-read
```
5. Run config generation tool from git project root which should create `../slides-upload/config.json` 
```
node ./scripts/image-config.js ~/Downloads/my-slideshow https://<project>.s3-us-west-1.amazonaws.com/photos/
```
6. Test locally using the config.json.   
7. cd to `../slides-upload` then Upload the config.json to s3:
```
aws s3 cp config.json s3://<project> --acl public-read
```