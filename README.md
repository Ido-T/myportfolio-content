Automated Portfolio Deployment Documentation

1. Project Overview

I have built a static portfolio website hosted on an Amazon S3 bucket. To ensure fast, secure, and global delivery, I configured Amazon CloudFront as the CDN. Updates to my site are automated through GitHub Actions, so every push to my repository triggers a deployment pipeline that:

    a. Syncs files to S3.

    b. Invalidates CloudFront cache.

    c. Ensures users always see the latest version of my site.

2. IAM User Setup.

a. Created an IAM user: github-s3-cloudf....

b. Attached a custom policy granting:

    + S3 permissions: PutObject, GetObject, ListBucket, DeleteObject for my bucket (myportfolio-website-jeffiberdothomas).

    + CloudFront permission: cloudfront:CreateInvalidation for my distribution (distributionName).

c. Stored the IAM user’s Access Key ID and Secret Access Key as GitHub repository secrets.

3. GitHub Repository

a.  Created a GitHub repository to store my website source code (index.html, CSS, images, etc.).

b.  Connected VS Code to GitHub (via Git integration).

c.  Workflow: edit locally → commit → push to main → GitHub Actions deploys automatically.

4. GitHub Actions Workflow (deploy.yml)

a.  Located in .github/workflows/deploy.yml:
    that is the content in the .yml file in the workfols folder.
        name: Deploy Portfolio to AWS

        on:
        push:
            branches:
            - main

        jobs:
        deploy:
            runs-on: ubuntu-latest

            steps:
            - name: Checkout repository
                uses: actions/checkout@v3

            - name: Configure AWS credentials
                uses: aws-actions/configure-aws-credentials@v4
                with:
                aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
                aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
                aws-region: ${{ secrets.AWS_REGION }}

            - name: Sync files to S3
                run: aws s3 sync . s3://${{ secrets.S3_BUCKET }} --delete --exclude ".git/*" --exclude ".github/*"

            - name: Invalidate CloudFront cache
                run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DIST_ID }} --paths "/*"



Explanation:

Checkout repository: Pulls my code from GitHub.

Configure AWS credentials: Uses secrets to authenticate with AWS.

Sync files to S3: Uploads my latest files to the bucket, deleting outdated ones.

Invalidate CloudFront cache: Clears cached files so users see updates immediately.     

5. GitHub Secrets

I added the following secrets in my repo:

AWS_ACCESS_KEY_ID → IAM user key.

AWS_SECRET_ACCESS_KEY → IAM user secret.

AWS_REGION → the region that my bucket is.

S3_BUCKET → myS3BucketName.

CLOUDFRONT_DIST_ID → The ID of my distribution.

6. Local Testing with AWS CLI

Before automation, I verified manually:

    Upload files to S3:

        aws s3 sync . s3://myportfolio-website-jeffiberdothomas --delete

    Invalidate CloudFront cache:

        aws cloudfront create-invalidation --distribution-id E1H46KDGTDFK68 --paths "/*"

    Confirmed updates in the S3 console and CloudFront invalidations tab.

7. Deployment Flow

    1. Edit files in VS Code.

    2. Commit and push to GitHub (main branch).

    3. GitHub Actions runs automatically:

        a. Syncs files to S3.

        b. Invalidates CloudFront cache.

    4.  CloudFront serves the updated site globally.

    5. Users see the latest version when visiting my CloudFront domain or custom domain.

✅ Summary of Achievements

Built a static portfolio site hosted on S3.

Secured and accelerated delivery with CloudFront.

Created a dedicated IAM user with least–privilege permissions.

Automated deployment pipeline using GitHub Actions.

Verified everything locally with AWS CLI.

Connected VS Code → GitHub → AWS for seamless updates.

Also

This project hosts **jeffiberdothomas.com** on AWS with a fully automated CI/CD pipeline (VS Code → GitHub → Actions → S3 → CloudFront).  
A key part of the setup is enforcing a **canonical redirect** so that all traffic resolves to the root domain:

- ✅ `http://jeffiberdothomas.com` → `https://jeffiberdothomas.com`
- ✅ `http://www.jeffiberdothomas.com` → `https://jeffiberdothomas.com`
- ✅ `https://www.jeffiberdothomas.com` → `https://jeffiberdothomas.com`


---

## Steps Taken for Canonical Redirect

1. **Created S3 Buckets**
   - `jeffiberdothomas.com` → Primary hosting bucket (static site hosting disabled, used only with CloudFront).
   - `www.jeffiberdothomas.com` → Redirect bucket configured to forward all requests to the root domain.

2. **Configured Redirect Bucket**
   - Enabled static website hosting on the `www` bucket.
   - Set redirect rules to forward all traffic to `https://jeffiberdothomas.com`.

3. **Set Up Route 53 Records**
   - Added `A` and `AAAA` records for both root and `www` domains.
   - Pointed them to the CloudFront distribution.

4. **Provisioned SSL Certificates (ACM)**
   - Requested certificates for both `jeffiberdothomas.com` and `www.jeffiberdothomas.com`.
   - Validated via DNS in Route 53.

5. **Deployed CloudFront Distribution**
   - Origin: S3 bucket (`jeffiberdothomas.com`).
   - Alternate domain names: `jeffiberdothomas.com`, `www.jeffiberdothomas.com`.
   - Attached ACM certificate for HTTPS.
   - Configured default behavior to enforce HTTPS.

6. **Verified Redirects**
   - Used `curl -I http://www.jeffiberdothomas.com` → Confirmed `301 Moved Permanently` to `https://jeffiberdothomas.com`.
   - Tested in browser to ensure seamless redirect.

---

## Result

All traffic, whether typed with or without `www`, is redirected to the secure root domain:

**👉 https://jeffiberdothomas.com**

This guarantees a single canonical URL and it is AWS best practices.
