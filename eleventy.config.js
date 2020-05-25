const htmlmin = require("html-minifier")
const markdownIt = require("markdown-it")
const markdownItFootnote = require("markdown-it-footnote")

module.exports = (eleventyConfig) => {
  // Add a readable date formatter filter to Nunjucks
  eleventyConfig.addFilter("dateDisplay", require("./filters/dates.js"))

  // Add a HTML timestamp formatter filter to Nunjucks
  eleventyConfig.addFilter("htmlDateDisplay", require("./filters/timestamp.js"))

  // Minify our HTML
  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      })
      return minified
    }
    return content
  })

  // Collections
  eleventyConfig.addCollection("blog", (collection) => {
    const blogs = collection.getFilteredByTag("blog")

    for (let i = 0; i < blogs.length; i++) {
      const prevPost = blogs[i - 1]
      const nextPost = blogs[i + 1]

      blogs[i].data["prevPost"] = prevPost
      blogs[i].data["nextPost"] = nextPost
    }

    return blogs.reverse()
  })

  // Layout aliases
  eleventyConfig.addLayoutAlias("default", "layouts/default.njk")
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk")
  eleventyConfig.addLayoutAlias("report", "layouts/report.njk")

  // Include our static assets
  eleventyConfig.addPassthroughCopy("css")
  eleventyConfig.addPassthroughCopy("js")
  eleventyConfig.addPassthroughCopy("images")
  eleventyConfig.addPassthroughCopy("robots.txt")

  let options = {
    html: true,
    breaks: false,
    linkify: true,
    typographer: true,
  }

  const markdownLib = markdownIt(options).use(markdownItFootnote)

  eleventyConfig.setLibrary("md", markdownLib)

  return {
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true,

    dir: {
      input: "site",
      output: "dist",
      includes: "includes",
      data: "globals",
    },
  }
}
