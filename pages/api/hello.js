// req = request data, res = response data
export default (req, res) => {
  res.status(200).json({ text: "Hello" });
};

/** Creating API Routes
 *
 * API Routes let you create an API endpoint inside a Next.js app.
 * You can do so by creating a function inside the pages/api directory that has the above format
 * They can be deployed as Serverless Functions (also known as Lambdas).
 */

/** Note that:
 * 
 * req is an instance of http.IncomingMessage, plus some pre-built middlewares
 * res is an instance of http.ServerResponse, plus some helper functions
 */

// API Routes Details

/** Do Not Fetch an API Route from getStaticProps or getStaticPaths
 * 
 * You should not fetch an API Route from getStaticProps or getStaticPaths.
 * Instead, write your server-side code directly in getStaticProps or getStaticPaths (or call a helper function).
 * 
 * Here's why:
 *  > getStaticProps and getStaticPaths runs only on the server-side.
 *  > It will never be run on the client-side.
 *  > It won’t even be included in the JS bundle for the browser.
 *  > That means you can write code such as direct database queries without them being sent to browsers.
 */

/** A Good Use Case: Handling Form Input
 * 
 * A good use case for API Routes is handling form input.
 * For example, you can create a form on your page and have it send a POST request to your API Route.
 * You can then write code to directly save it to your database.
 * The API Route code will not be part of your client bundle, so you can safely write server-side code.
 */

export default (req, res) => {
  const email = req.body.email;
  // Then save email to your database, etc...
}