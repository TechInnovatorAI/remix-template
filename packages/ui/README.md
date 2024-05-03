# UI - @kit/ui

This package is responsible for managing the UI components and styles across the app.

This package define two sets of components:

- `shadn-ui`: A set of UI components that can be used across the app using shadn UI
- `makerkit`: Components specific to MakerKit

## Installing a Shadcn UI component

To install a Shadcn UI component, you can use the following command in the root of the repository:

```bash
npx shadcn-ui@latest add <component> --path=packages/ui/src/shadcn
```

For example, to install the `Button` component, you can use the following command:

```bash
npx shadcn-ui@latest add button --path=packages/ui/src/shadcn
```

We pass the `--path` flag to specify the path where the component should be installed.