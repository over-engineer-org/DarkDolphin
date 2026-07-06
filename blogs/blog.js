async function loadBlogPost() {
    const loadingEl = document.getElementById('blog-loading');
    const errorEl = document.getElementById('blog-error');
    const errorMessageEl = document.getElementById('error-message');
    const articleEl = document.getElementById('blog-article');

    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (!blogId) {
        loadingEl.style.display = 'none';
        errorMessageEl.textContent = 'No blog ID was provided in the address bar.';
        errorEl.style.display = 'block';
        return;
    }

    try {
        // Step 1: fetch the index
        const indexRes = await fetch('blogs.json');
        if (!indexRes.ok) throw new Error('Failed to fetch blog index.');
        const blogs = await indexRes.json();

        const blog = blogs.find(b => b.id === blogId);
        if (!blog) {
            loadingEl.style.display = 'none';
            errorMessageEl.textContent = `No blog post found with ID "${blogId}".`;
            errorEl.style.display = 'block';
            return;
        }

        // Step 2: fetch the .md file
        const mdRes = await fetch(blog.file);
        if (!mdRes.ok) throw new Error(`Could not load post file: ${blog.file}`);
        const markdown = await mdRes.text();

        // Populate metadata
        document.title = `${blog.title} | Dark Dolphin`;
        document.getElementById('post-title').textContent = blog.title;
        document.getElementById('post-date').textContent = blog.date || 'Unknown date';

        // Read time from the fetched markdown
        const wordCount = markdown.trim().split(/\s+/).length;
        const readMins = Math.max(1, Math.ceil(wordCount / 200));
        document.getElementById('post-read-time').textContent = `${readMins} min read`;

        // Tags
        const tagsContainer = document.getElementById('post-tags');
        tagsContainer.innerHTML = '';
        if (Array.isArray(blog.tags)) {
            blog.tags.forEach(tag => {
                const span = document.createElement('span');
                span.classList.add('tag');
                span.textContent = tag;
                tagsContainer.appendChild(span);
            });
        }

        // Cover image (optional field)
        const coverContainer = document.getElementById('post-cover-container');
        const coverImg = document.getElementById('post-cover');
        if (blog.coverImage) {
            coverImg.src = blog.coverImage;
            coverImg.alt = blog.title;
            coverContainer.style.display = 'block';
        }

        // Render markdown → HTML
        const contentContainer = document.getElementById('post-content');
        if (typeof marked !== 'undefined') {
            marked.use({ gfm: true, breaks: true });
            contentContainer.innerHTML = marked.parse(markdown);
        } else {
            // plain fallback
            contentContainer.innerHTML = `<pre>${markdown}</pre>`;
        }

        // Show article
        loadingEl.style.display = 'none';
        articleEl.style.display = 'block';

    } catch (err) {
        console.error('Error loading blog post:', err);
        loadingEl.style.display = 'none';
        errorMessageEl.textContent = 'An error occurred while loading the post. Please try again later.';
        errorEl.style.display = 'block';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlogPost);
} else {
    loadBlogPost();
}
