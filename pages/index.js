import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";

import Link from "next/link";
import Date from "../components/date";

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          Hello, I'm Victoria. I'm a web developer currently looking for work.
        </p>
        <p>
          (This is a sample website - you’ll be building a site like this on{" "}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href="/posts/[id]" as={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

/** Link Component
 *
 * Enables client-side navigation between two pages in the same Next.js app
 * Client-side navigation means that the page transition happens using JavaScript, which is faster than the default navigation done by the browser.
 * Browser does NOT load the full page
 * If you’ve used <a href="…"> instead of <Link href="…"> and did this, the background color will be cleared on link clicks because the browser does the full refresh.
 */

/** Code Splitting and Prefetching
 *
 * Next.js does code splitting automatically, so each page only loads what’s necessary for that page.
 * That means when the homepage is rendered, the code for other pages is not served initially.
 * Only loading the code for the page you request also means that pages become isolated.
 *   > If a certain page throws an error, the rest of the application would still work.
 *
 * Link
 *
 * Furthermore, in a production build of Next.js, whenever Link components appear in the browser’s viewport, Next.js automatically prefetches the code for the linked page in the background.
 * By the time you click the link, the code for the destination page will already be loaded in the background, and the page transition will be near-instant!
 */

/** Summary
 *
 * Next.js automatically optimizes your application for the best performance by code splitting, client-side navigation, and prefetching (in production).
 * You create routes as files under pages and use the built-in Link component. No routing libraries are required.
 * Note: If you need to link to an external page outside the Next.js app, just use an <a> tag without Link.
 * If you need to add attributes like, for example, className, add it to the a tag, not to the Link tag.
 */

/** Pre-rendering
 *
 * Before we talk about data fetching, let’s talk about one of the most important concepts in Next.js: Pre-rendering.
 * By default, Next.js pre-renders every page.
 * This means that Next.js generates HTML for each page in advance, instead of having it all done by client-side JavaScript.
 * Pre-rendering can result in better performance and SEO.
 * Each generated HTML is associated with minimal JavaScript code necessary for that page.
 * When a page is loaded by the browser, its JavaScript code runs and makes the page fully interactive. (This process is called hydration.)
 * You should see that your app is rendered without JavaScript.
 * That’s because Next.js has pre-rendered the app into static HTML, allowing you to see the app UI without running JavaScript.
 */

/** Pre-rendering vs. No Pre-rendering
 *
 * Pre-rendering (Using Next.js)
 *
 * Initial Load:
 *  > Pre-rendered HTML is displayed
 *
 * JS loads v
 *
 * Hydration
 *  > React components are initialized and App becomes interactive
 *  > If your app has interactive components like <Link />, they'll be active after JS loads
 *
 * No Pre-rendering (Plain React.js app)
 *
 * Initial Load:
 *  > App is not rendered
 *
 * JS loads v
 *
 * Hydration
 *  > React components are initialized and App becomes interactive
 */

/** Two Forms of Pre-rendering
 *
 * Next.js has two forms of pre-rendering:
 *   > Static Generation
 *   > Server-side Rendering
 * The difference is in WHEN it generates the HTML for a page
 *
 * Static Generation
 *
 * Pre-rendering method that generates the HTML at build time.
 *   > The pre-rendered HTML is then reused on each request.
 *
 * Server-side Rendering
 *
 * Pre-rendering method that generates the HTML on each request.
 *
 * Per-page Basis
 *
 * Importantly, Next.js lets you choose which pre-rendering form to use for each page.
 * You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.
 */

/** When to Use Static Generation v.s. Server-side Rendering
 *
 * We recommend using Static Generation (with and without data) whenever possible because your page can be built once and served by CDN, which makes it much faster than having a server render the page on every request.
 * You can use Static Generation for many types of pages, including:
 *  > Marketing pages
 *  > Blog posts
 *  > E-commerce product listings
 *  > Help and documentation
 *
 * You should ask yourself: "Can I pre-render this page ahead of a user's request?" If the answer is yes, then you should choose Static Generation.
 *
 * On the other hand, Static Generation is not a good idea if you cannot pre-render a page ahead of a user's request.
 *  > Maybe your page shows frequently updated data, and the page content changes on every request.
 *
 * In that case, you can use Server-Side Rendering.
 *  > It will be slower, but the pre-rendered page will always be up-to-date.
 *  > Or you can skip pre-rendering and use client-side JavaScript to populate data.
 */

/** Static Generation with and without Data
 *
 * Static Generation can be done with and without data.
 *
 * However, for some pages, you might not be able to render the HTML without first fetching some external data.
 *  > Maybe you need to access the file system, fetch external API, or query your database at build time.
 *  > Next.js supports this case — Static Generation with data — out of the box.
 */

/** Static Generation with Data using `getStaticProps`
   * 
   * How does it work? Well, in Next.js, when you export a page component, you can also export an async function called getStaticProps. If you do this, then:
   *  > getStaticProps runs at build time in production, and…
   *  > Inside the function, you can fetch external data and pass that as the props of the page.

   export default function Home(props) { ... }

   export async function getStaticProps() {
     // Get external data from the file system, API, DB, etc.
     const data = ...

     // THe value of the `props` key will be passed to the `Home` component
     return {
       props: ...
     }
   }

   * Essentially, getStaticProps allows you to tell Next.js:
   * “Hey, this page has some data dependencies — so when you pre-render this page at build time, make sure to resolve them first!”
   * Note: In development mode, getStaticProps runs on each request instead.
   */

/** Parsing the Blog Data on `getStaticProps`
 *
 * Now, let’s update our index page (pages/index.js) using this data. We’d like to:
 *   > Parse each markdown file and get title, date, and file name (which will be used as id for the post URL).
 *   > List the data on the index page, sorted by date.
 * To do this on pre-render, we need to implement getStaticProps.
 */

/** Page Path Depends on External Data
 *
 * Next.js allows you to statically generate pages with paths that depend on external data.
 * This enables dynamic URLs in Next.js.
 */

/** How to Statically Generate Pages with Dynamic Routes
 *
 * In our case, we want to create dynamic pages for blog posts:
 *  > We want each post to have the path /posts/<id>, where <id> is the name of the markdown file under the top-level posts directory.
 *  > Since we have ssg-ssr.md and pre-rendering.md, we’d like the paths to be /posts/ssg-ssr and /posts/pre-rendering.
 */

/** Overview of the Steps
 *
 * We can do this by taking the following steps.
 *
 * First, we’ll create a page called [id].js under pages/posts.
 *  > Pages that begin with [ and end with ] are dynamic pages in Next.js.
 * In pages/posts/[id].js, we’ll write code that will render a post page — just like other pages we’ve created.
 */

/*
import Layout from '../../components/layout;

export default function Post() {
  return <Layout>...</Layout>
}
*/

/** getStaticPaths
 *
 * Now, here’s what’s new: We’ll export an async function called getStaticPaths from this page.
 * In this function, we need to return a list of possible values for id.
 */

/*
import Layout from '../../components/layout'

export default function Post() {
  return <Layout>...</Layout>
}

export async function getStaticPaths() {
  // Return a list of possible value for id
}
*/

/** Implementing getStaticProps
 *
 * Finally, we need to implement getStaticProps again - this time, to fetch necessary data for the blog post with a given id.
 * getStaticProps is given params, which contains id.
 */

/*
import Layout from '../../components/layout'

export default function Post() {
  return <Layout>...</Layout>
}

export async function getStaticPaths() {
  // Return a list of possible value for id
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
}
*/