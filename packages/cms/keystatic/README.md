# CMS/Keystatic - @kit/keystatic

Implementation of the CMS layer using the Keystatic library.

This implementation is used when the host app's environment variable is set as:

```
CMS_CLIENT=keystatic
KEYSTATIC_PATH=content
```

Additionally, the following environment variables may be required:

```
KEYSTATIC_STORAGE_KIND=local # local, cloud, github
KEYSTATIC_PATH=
```

You can also use Keystatic Cloud or GitHub as the storage kind as remote storage.

If `KEYSTATIC_STORAGE_KIND` is set to `cloud`, the following environment variables are required:

```
KEYSTATIC_STORAGE_KIND=cloud
KEYSTATIC_STORAGE_PROJECT=project-id
```

If `KEYSTATIC_STORAGE_KIND` is set to `github`, the following environment variables are required:

```
KEYSTATIC_STORAGE_KIND=github
KEYSTATIC_STORAGE_REPO=makerkit/next-supabase-saas-kit-turbo-demo
KEYSTATIC_GITHUB_TOKEN=github_*****************************************************
KEYSTATIC_PATH_PREFIX=apps/web
```

Of course, you need to replace the `KEYSTATIC_STORAGE_REPO` and `KEYSTATIC_GITHUB_TOKEN` with your own values.

GitHub mode requires the installation of a GitHub app for displaying the admin.

Please refer to the [Keystatic documentation](https://keystatic.com/docs/github-model) for more information.

If your content folder is not at `content`, you can set the `KEYSTATIC_CONTENT_PATH` environment variable to the correct path. For example, if your content folder is at `data/content`, you can set the `KEYSTATIC_CONTENT_PATH` environment variable as:

```
KEYSTATIC_CONTENT_PATH=data/content
```