import fs from "fs";
import path from "path";
import matter from "gray-matter";

import remark from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]

  /**
   * Important: The returned list is not just an array of strings — it must be an array of objects that look like the comment above.
   * Each object must have the params key and contain an object with the id key (because we’re using [id] in the file name).
   * Otherwise, getStaticPaths will fail.
   */

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

/** Fetch External API or Query Database
 *
 * In our lib/posts.js, we’ve implemented getSortedPostsData which fetches data from the file system.
 * But you can fetch the data from other sources, like an external API endpoint, and it’ll work just fine:
 */

/**
 import fetch from 'node-fetch'

 export async function getSortedPostsData() {
   // Instead of the file system, fetch post data from an external API endpoint
   const res = await fetch('..');
   return res.json()
 }
 */

// Can also query the database directly

/*
 import someDatabaseSDK from 'someDatabaseSDK'
 
 const databaseClient = someDatabaseSDK.createClient(...)

 export async function getSortedPostsData() {
   // Instead of the file system, fetch post data from a database
   return databaseClient.query('SELECT posts...')
 }
 */

/** This is possible because getStaticProps runs only on the server-side.
 *
 * It will never be run on the client-side.
 * It won’t even be included in the JS bundle for the browser.
 * That means you can write code such as direct database queries without them being sent to browsers.
 */

/** Development vs. Production
 *
 * In development (npm run dev or yarn dev), getStaticProps runs on every request.
 * In production, getStaticProps runs at build time.
 *  > Because it’s meant to be run at build time, you won’t be able to use data that’s only available during request time, such as query parameters or HTTP headers.
 */

/** Only Allowed in a Page
 *
 * getStaticProps can only be exported from a page. You can’t export it from non-page files.
 * One of the reasons for this restriction is that React needs to have all the required data before the page is rendered.
 */

/** What If I Need to Fetch Data at Request Time?
 *
 * Static Generation is not a good idea if you cannot pre-render a page ahead of a user's request.
 * Maybe your page shows frequently updated data, and the page content changes on every request.
 *  > In cases like this, you can try Server-side Rendering or skipping pre-rendering.
 */

/** Fetching Data at Request Time
 *
 * If you need to fetch data at request time instead of at build time, you can try Server-side Rendering:
 * To use Server-side Rendering, you need to export getServerSideProps instead of getStaticProps from your page.
 */

/** Using getServerSideProps
 *
 * Here’s the starter code for getServerSideProps.
 */

/**
 export async function getServerSideProps(context) {
   return {
     props: {
       // props for your component
     }
   }
 }
 */

// Because getServerSideProps is called at request time, its parameter (context) contains request specific parameters.

/** When to use?
 *
 * You should use getServerSideProps only if you need to pre-render a page whose data must be fetched at request time.
 * Time to first byte (TTFB) will be slower than getStaticProps because the server must compute the result on every request, and the result cannot be cached by a CDN without extra configuration.
 */

/** Client-side Rendering
 *
 * If you do not need to pre-render the data, you can also use the following strategy (called Client-side Rendering):
 *  > Statically generate (pre-render) parts of the page that do not require external data.
 *  > When the page loads, fetch external data from the client using JavaScript and populate the remaining parts.
 *
 * This approach works well for user dashboard pages, for example.
 *  > Because a dashboard is a private, user-specific page, SEO is not relevant, and the page doesn’t need to be pre-rendered.
 *  > The data is frequently updated, which requires request-time data fetching.
 */

/** SWR
 *
 * The team behind Next.js has created a React hook for data fetching called SWR.
 * We highly recommend it if you’re fetching data on the client side.
 * It handles caching, revalidation, focus tracking, refetching on interval, and more.
 * https://swr.vercel.app/
 */

/*
import useSWR from 'swr'

function Profile() {
  const { data, error } = useSWR('/api/user', fetch);

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
*/

// Dynamic Routes Details

/** Fetch External API or Query Database
 *
 * Like getStaticProps, getStaticPaths can fetch data from any data source.
 * In our example, getAllPostIds (which is used by getStaticPaths) may fetch from an external API endpoint:
 */

/**
 export async function getAllPostIds() {
   // Instead of the file system, fetch post data from an external API endpoint
   const res = await fetch('..);
   const posts = await res.json();
   return posts.map(post => {
     return {
       params: {
         id: post.id
       }
     }
   })
 }
 */

/** Development vs. Production
 *
 * In development (npm run dev or yarn dev), getStaticPaths runs on every request.
 * In production, getStaticPaths runs at build time.
 */

/** Fallback
 *
 * Recall that we returned fallback: false from getStaticPaths. What does this mean?
 * If fallback is false, then any paths not returned by getStaticPaths will result in a 404 page.
 *
 * If fallback is true, then the behavior of getStaticProps changes:
 *   > The paths returned from getStaticPaths will be rendered to HTML at build time.
 *   > The paths that have not been generated at build time will not result in a 404 page. Instead, Next.js will serve a “fallback” version of the page on the first request to such a path.
 *   > In the background, Next.js will statically generate the requested path. Subsequent requests to the same path will serve the generated page, just like other pages pre-rendered at build time.
 */

/** Catch-all Routes
 *
 * Dynamic routes can be extended to catch all paths by adding three dots (...) inside the brackets. For example:
 *  > pages/posts/[...id].js matches /posts/a, but also /posts/a/b, /posts/a/b/c and so on.
 * If you do this, in getStaticPaths, you must return an array as the value of the id key like so:
 */

/**
 return [
  {
    params: {
      // Statically Generates /posts/a/b/c
      id: ['a', 'b', 'c']
    }
  }
  //...
]
 */

// And params.id will be an array in getStaticProps:

/**
 export async function getStaticProps({ params }) {
   // params.id will be like ['a', 'b', 'c']
 }
 */

/** Router
 *
 * If you want to access the Next.js router, you can do so by importing the useRouter hook from next/router.
 */

/** 404 Pages
 *
 * To create a custom 404 page, create pages/404.js.
 * This file is statically generated at build time.
 */

/**
  // pages/404.js
  export default function Custom404() {
    return <h1>404 - Page Not Found</h1>
  }
 */

 /** getStaticProps and getStaticPaths Examples
  * 
  * Blog Starter using markdown files
  *   > https://github.com/vercel/next.js/tree/canary/examples/blog-starter
  *   > https://next-blog-starter.now.sh/
  * 
  * DatoCMS
  *   > https://github.com/vercel/next.js/tree/canary/examples/cms-datocms
  *   > https://next-blog-datocms.now.sh/
  * 
  * TakeShape
  *   > https://github.com/vercel/next.js/tree/canary/examples/cms-takeshape
  *   > https://next-blog-takeshape.now.sh/
  * 
  * Sanity
  *   > https://github.com/vercel/next.js/tree/canary/examples/cms-sanity
  *   > https://next-blog-sanity.now.sh/
  */