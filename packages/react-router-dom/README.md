## Usage

> ⚠️ Requires [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) to work.

Simply specify the directory containing your routes using the macro like so `<FileBasedRoutes path="./pages" />`. Do note that the actual name of the folder will not be included in the route path. For example the file `pages/user/profile.tsx` will result in the route path `user/profile`. Regarding index routes, route-nesting and dynamic route segments the aim is to follow the [NextJs Routing](https://nextjs.org/docs/routing/introduction) as closely as possible. See below for further explanation

### Index routes

- `pages/index.js` → `/`
- `pages/blog/index.js` → `blog`

### Nested routes

- `pages/blog/first-post.js` → `/blog/first-post`
- `pages/dashboard/settings/username.js` → `/dashboard/settings/username`

### Dynamic route segments

- `pages/blog/[slug].js` → `/blog/:slug`
- `pages/[username]/settings.js` → `/:username/settings`
- `pages/post/[...all].js` → `/post/*`

## API

| Property  | Description                                                                           | Type    | Default |
| --------- | ------------------------------------------------------------------------------------- | ------- | ------- |
| path      | Relative path to the folder you want to have the routes based out from                | string  | -       |
| logRoutes | Will output the routes that have been made along with their components to the console | boolean | false   |

---

## Examples

```TypeScript
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes } from "react-router-dom";
import FileBasedRoutes from "@react-file-based-routing/react-router-dom/macro";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <FileBasedRoutes path="./pages" />
        <FileBasedRoutes path="./some-other-folder" logRoutes />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

```
