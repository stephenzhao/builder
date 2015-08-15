<% doc.javadoc.forEach(function(comment) { %>
    <% if (comment.ignore) return%>
    <% if (comment.name) { %>
        <% if (comment.isClass) { %>
            # <%= comment.name %>(<%= comment.paramStr %>)
        <% } else if (comment.isFunction) { %>
            ## <%= comment.name %>(<%= comment.paramStr %>)
        <% } else if (comment.isMethod) { %>
            ### <%= comment.name %>(<%= comment.paramStr %>)
        <% } %>
    <% } %>

    <%= comment.description %>
    <% if (comment.example) { %>
        **Example:**
        ```javascript
        <%= comment.example %>
        ```
    <% } %>

    <% if (comment.deprecated) { %>
      **Deprecated**
    <% } %>

    <% if (comment.author) { %>
      Author: <%- comment.author %>
    <% } %>

    <% if (comment.version) { %>
      Version: <%= comment.version %>
    <% } %>

    <% if (comment.see) { %>
      See: <%= comment.see %>
    <% } %>

    <% if (comment.paramTags.length > 0) { %>
    **Params:**
        <% comment.paramTags.forEach(function(paramTag) { %>
            * <*<%= paramTag.joinedTypes %>*>  **<%= paramTag.name %>** <%= paramTag.description %>
        <% }) %>
    <% } %>

    <% if (comment.returnTags.length > 0) { %>
    **Return:**
        <% comment.returnTags.forEach(function(returnTag) { %>
            * <*<%= returnTag.joinedTypes %>*> <%= returnTag.description %>
        <% }) %>
    <% } %>
    ----
<% }) %>