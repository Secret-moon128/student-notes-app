# Security Standards and Vulnerability Mitigations

This document outlines the security coding standards, policies, and guidelines established for developers contributing to the **student-notes-app** project.

---

## 🔒 Content Security Policy (CSP)

To mitigate Cross-Site Scripting (XSS) and data injection vulnerabilities, sub-projects must enforce a Content Security Policy (CSP) where applicable. 

If loading external resources or fonts, use the following meta-tag structure in your `<head>`:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data:; connect-src 'self';">
```

---

## 🛡️ Cross-Site Scripting (XSS) Prevention

When displaying user inputs, notes, tasks, or dynamic values, **never** insert them directly into the HTML using `.innerHTML`. Instead:

### Incorrect (Vulnerable)
```javascript
// A malicious user could enter <img src=x onerror=alert(1)> and execute arbitrary code
const notesContainer = document.getElementById("notes");
notesContainer.innerHTML = `<p>${userInput}</p>`;
```

### Correct (Safe)
Use `textContent`, `innerText`, or import the shared `global-security.js` library:

```html
<script src="../global-security.js"></script>
<script>
    const notesContainer = document.getElementById("notes");
    const safeText = Security.escapeHTML(userInput);
    notesContainer.innerHTML = `<p>${safeText}</p>`;
    
    // OR alternatively:
    const p = document.createElement("p");
    p.textContent = userInput;
    notesContainer.appendChild(p);
</script>
```

---

## 🔑 Secret and Token Handling

This is a static client-side web application.
- **NEVER** commit API keys, client secrets, passwords, or configuration tokens to source control.
- If using external APIs, proxy requests through a secure server or prompt the user to input their own personal token.
