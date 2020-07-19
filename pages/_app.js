import "../styles/global.css";

const App = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;

/** App
 * 
 * This App component is the top-level component which will be common across all the different pages.
 * You can use this App component to keep state when navigating between pages, for example.
 * In Next.js, you can add global CSS files by importing them from _app.js. You cannot import global CSS anywhere else.
 * The reason that global CSS can't be imported outside of _app.js is that global CSS affects all elements on the page.
 */

 /** CSS
  * 
  * To use CSS Modules, import a CSS file named *.module.css from any component.
  * To use global CSS, import a CSS file in pages/_app.js.
  */

/** Sass
 * 
 * Before you can use Next.js' built-in Sass support, be sure to install sass
 */