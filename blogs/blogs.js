const container = document.querySelector('#bl-container');
const list = document.querySelector('.blog-list');

async function getBlogs() {
    const data = await fetch("blogs.json");
    const blogs = await data.json();

    console.log("Blogs fetched from blogs/blogs.js");
    return blogs;
}


function getli(id, title, date, description, tags){
    const li = document.createElement("li");
    li.classList.add("blog-card");
    
    // Add click event to navigate to the blog template page with id query param
    li.addEventListener("click", () => {
        window.location.href = `blog.html?id=${encodeURIComponent(id)}`;
    });
    
    const blogInfo = document.createElement("div");
    blogInfo.classList.add("blog-info");
    
    // date
    const Date = document.createElement("span");
    Date.classList.add("blog-date");
    Date.textContent = date;
    
    // title
    const Title = document.createElement("h2");
    Title.classList.add("blog-title");
    Title.textContent = title;
    
    // description
    const Desc = document.createElement("p");
    Desc.classList.add("blog-description");
    Desc.textContent = description;
    
    // tags
    const Tags = document.createElement("div");
    Tags.classList.add("blog-tags");
    tags.forEach((tag) => {
        const span = document.createElement("span");
        span.classList.add("tag");
        span.textContent = tag;
        Tags.appendChild(span);
    })
    
    blogInfo.append(Date, Title, Desc, Tags);
    
    li.appendChild(blogInfo);
    return li;
}

function makeList(blogs){
    blogs.forEach((blog) => {
        list.append(
        getli(
            blog.id,
            blog.title,
            blog.date,
            blog.description,
            blog.tags
        )
        )
    })
}

getBlogs().then((blog) => {
    makeList(blog)
})