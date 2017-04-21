# assemble-s3-boilerplate

A boilerplate for building static sites using assemble for s3 deployment. 
Includes browsersync, sass compiling, js concatenation/minification and most importantly favicon generation.

```bash
npm install && grunt syncwatch
```

And when your ready to deploy to S3

```bash
grunt deploy
```