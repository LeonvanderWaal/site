document.addEventListener("DOMContentLoaded", () => {
    const blogList = document.getElementById("blog-list");
    const postContent = document.getElementById("post-content");
    const contentDiv = document.getElementById("content");
    const backButton = document.getElementById("back-button");

    const username = "LeonvanderWaal";
    const repo = "site";
    const branch = "main";
    const folder = "blog";

    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${folder}?ref=${branch}`;

    // Fetch blog posts using GitHub's API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                if (item.name.endsWith(".md")) {
                    const postLink = document.createElement("li");
                    postLink.innerHTML = `<a href="#" data-url="${item.download_url}">${item.name.replace(/-/g, ' ').replace('.md', '')}</a>`;
                    blogList.appendChild(postLink);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching blog posts:", error);
            blogList.innerHTML = "<li>Failed to load blog posts.</li>";
        });

    // Event listener to fetch and display blog post content
    blogList.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
            e.preventDefault();
            const url = e.target.getAttribute("data-url");
            fetch(url)
                .then(response => response.text())
                .then(markdown => {
                    const htmlContent = parseMarkdown(markdown);
                    contentDiv.innerHTML = htmlContent;
                    blogList.classList.add("hidden");
                    postContent.classList.remove("hidden");

                    // Render LaTeX using KaTeX
                    renderMathInElement(contentDiv, {
                        delimiters: [
                            { left: "$$", right: "$$", display: true },
                            { left: "$", right: "$", display: false },
                            { left: "\\[", right: "\\]", display: true },
                            { left: "\\(", right: "\\)", display: false }
                        ],
                        // Add custom options to support multiline LaTeX blocks
                        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"]
                    });
                })
                .catch(error => {
                    console.error("Error fetching post content:", error);
                    contentDiv.innerHTML = "<p>Failed to load post content.</p>";
                });
        }
    });

    // Back button functionality
    backButton.addEventListener("click", () => {
        postContent.classList.add("hidden");
        blogList.classList.remove("hidden");
    });

    // Simple markdown parser (basic formatting)
    function parseMarkdown(text) {
        return text
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')        // H1 headers
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')       // H2 headers
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')      // H3 headers
            .replace(/\*\*(.*?)\*\*/gm, '<strong>$1</strong>') // Bold text
            .replace(/\*(.*?)\*/gm, '<em>$1</em>')       // Italics
            .replace(/\[([^\]]+)\]\(([^)]+)\)/gm, '<a href="$2" target="_blank">$1</a>') // Links
            .replace(/\n/gm, '<br>');                     // Line breaks
    }
});
