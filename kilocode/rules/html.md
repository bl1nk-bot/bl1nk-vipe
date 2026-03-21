# KiloCode Rules for HTML

## Document Structure

- **Semantic HTML**: Use semantic elements (`<article>`, `<section>`, `<nav>`, `<header>`, `<main>`, `<aside>`, `<footer>`)
- **Accessibility First**: Add ARIA attributes, alt text, proper heading hierarchy
- **Progressive Enhancement**: HTML works without CSS/JS
- **Performance**: Minimize DOM size, use resource hints

## Boilerplate Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description for SEO">
  <title>Page Title</title>
  <!-- Resource hints for performance -->
  <link rel="dns-prefetch" href="//fonts.googleapis.com">
  <link rel="preconnect" href="//fonts.gstatic.com" crossorigin>
  <!-- Styles -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h1>Main heading</h1>
    <p>Content...</p>
  </main>

  <footer>
    <p>© 2026 Company</p>
  </footer>

  <!-- Scripts -->
  <script src="main.js" defer></script>
</body>
</html>
```

## Semantic HTML Elements

### Sectioning Content

```html
<!-- ✅ Good: semantic structure -->
<article>
  <header>
    <h1>Article Title</h1>
    <time datetime="2026-03-09">March 9, 2026</time>
  </header>
  <section>
    <h2>Introduction</h2>
    <p>Article content...</p>
  </section>
  <section>
    <h2>Conclusion</h2>
    <p>Final thoughts...</p>
  </section>
</article>

<!-- ❌ Bad: div soup -->
<div class="article">
  <div class="header">
    <h1>Article Title</h1>
    <span>March 9</span>
  </div>
  <div class="section">
    <p>Content...</p>
  </div>
</div>
```

### Text-Level Semantics

```html
<!-- ✅ Good: semantic text elements -->
<p>The <strong>important</strong> part is highlighted,
while the <em>emphasized</em> words are special.
The <code>console.log()</code> function is used for debugging,
and abbreviations like <abbr title="HyperText Markup Language">HTML</abbr>
are explained.</p>

<ul>
  <li>First item</li>
  <li>Second item</li>
</ul>

<ol>
  <li>Step 1</li>
  <li>Step 2</li>
</ol>

<figure>
  <img src="diagram.png" alt="Process flow diagram">
  <figcaption>Figure 1: Process flow</figcaption>
</figure>
```

## Form Elements

### Accessible Forms

```html
<form action="/submit" method="post">
  <!-- ✅ Grouping related fields -->
  <fieldset>
    <legend>Personal Information</legend>

    <div>
      <label for="name">Full Name</label>
      <input
        type="text"
        id="name"
        name="name"
        required
        autocomplete="name"
        aria-describedby="name-help"
      >
      <small id="name-help">Enter your full legal name</small>
    </div>

    <div>
      <label for="email">Email Address</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        autocomplete="email"
        pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
        placeholder="user@example.com"
      >
    </div>
  </fieldset>

  <!-- ✅ Clear call-to-action -->
  <button type="submit">
    Create Account
  </button>
</form>
```

### Form Validation

```html
<!-- ✅ Client-side validation -->
<input
  type="password"
  name="password"
  minlength="8"
  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
  title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
  required
>

<!-- ✅ Custom validation messages -->
<input
  type="number"
  id="age"
  name="age"
  min="13"
  max="150"
  oninvalid="this.setCustomValidity('Age must be between 13 and 150')"
  oninput="this.setCustomValidity('')"
>
```

## Accessibility (a11y)

### ARIA Attributes

```html
<!-- ✅ Good: appropriate ARIA usage -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="#content" aria-label="Skip to main content">
      Skip to content
    </a></li>
  </ul>
</nav>

<main id="content">
  <button
    aria-expanded="false"
    aria-controls="menu"
    aria-describedby="menu-button-description"
    onclick="toggleMenu()"
  >
    Menu
  </button>

  <ul id="menu" role="menu" aria-label="User menu">
    <li role="menuitem">
      <a href="/profile">Your Profile</a>
    </li>
    <li role="menuitem">
      <a href="/settings">Settings</a>
    </li>
  </ul>

  <span id="menu-button-description" class="sr-only">
    Opens the user menu with account options
  </span>
</main>
```

### Screen Reader Support

```html
<!-- ✅ Semantic headings for navigation -->
<h1>Page Title</h1>
<h2>Section Heading</h2>
<h3>Subsection</h3>

<!-- ✅ Descriptive alt text -->
<img
  src="logo.png"
  alt="Company Name - Home"
  role="presentation"
/>

<!-- ✅ Screen reader only content -->
<span class="sr-only">Loading...</span>

<!-- ✅ Live regions for dynamic content -->
<div
  aria-live="polite"
  aria-atomic="true"
  id="status-message"
></div>
```

## Web Standards and Best Practices

### HTML5 Features

```html
<!-- ✅ Use modern input types -->
<input type="date" name="birthdate">
<input type="email" name="useremail">
<input type="url" name="website">
<input type="tel" name="phone">

<!-- ✅ Data attributes for custom behavior -->
<button
  data-toggle="modal"
  data-target="#myModal"
>
  Open Modal
</button>

<!-- ✅ Native validation -->
<form novalidate></form>
```

### Performance Optimization

```html
<!-- ✅ Resource hints -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- ✅ Lazy loading images -->
<img
  src="placeholder.jpg"
  data-src="actual-image.jpg"
  loading="lazy"
  alt="Description"
/>

<!-- ✅ Minimize DOM size -->
<!-- Use fewer containers, CSS for layout -->
<div class="grid">
  <!-- Limit nesting depth to 4 levels max -->
</div>
```

## HTML Validation

### Valid HTML5

```html
<!DOCTYPE html> <!-- ✅ Required -->
<html lang="en">  <!-- ✅ Language attribute -->

<head>
  <meta charset="UTF-8">     <!-- ✅ First meta tag -->
  <meta name="viewport"     <!-- ✅ Responsive design -->
        content="width=device-width, initial-scale=1.0">
  <title>Descriptive Title</title> <!-- ✅ Unique, descriptive -->
</head>

<body>
  <!-- Content structure -->
  <header><!-- Navigation --></header>
  <main><!-- Primary content --></main>
  <aside><!-- Secondary content --></aside>
  <footer><!-- Site info --></footer>
</body>
</html>
```

## Custom Elements and Web Components

```html
<!-- ✅ Define custom elements -->
<template id="user-card-template">
  <style>
    :host {
      display: block;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 1rem;
    }

    .avatar {
      border-radius: 50%;
    }
  </style>

  <div class="user-card">
    <img class="avatar" src="" alt="" />
    <h3 class="name"></h3>
    <p class="bio"></p>
  </div>
</template>

<!-- Usage -->
<user-card user-id="123"></user-card>

<script>
class UserCard extends HTMLElement {
  constructor() {
    super()
    const template = document.getElementById('user-card-template').content
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template.cloneNode(true))
  }

  connectedCallback() {
    // Component connected to DOM
    this.loadUserData()
  }
}

customElements.define('user-card', UserCard)
</script>
```

## HTML Security

### Content Security Policy

```html
<!-- ✅ CSP headers (should be set server-side) -->
<meta
  http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
  "
>
```

### XSS Prevention

```html
<!-- ❌ Bad: Direct injection -->
<div id="content"></div>
<script>
  document.getElementById('content').innerHTML = userSuppliedData // XSS Risk!
</script>

<!-- ✅ Good: Sanitization and safe APIs -->
<div id="content"></div>
<script>
  const sanitized = DOMPurify.sanitize(userSuppliedData)
  document.getElementById('content').innerHTML = sanitized
</script>
```

## Internationalization (i18n)

```html
<!DOCTYPE html>
<html lang="th" dir="ltr"> <!-- ✅ Proper language and text direction -->
<head>
  <meta charset="UTF-8">
  <title>หัวเรื่องหน้า</title>
  <!-- Include locale-specific styles if needed -->
  <link rel="alternate" hreflang="en" href="/en/page">
</head>
<body>
  <!-- Use Unicode characters properly -->
  <p lang="ja">こんにちは世界</p>

  <!-- Date/time with proper formatting -->
  <time datetime="2026-03-09T15:00:00+07:00">
    วันที่ 9 มีนาคม 2569 เวลา 15:00
  </time>
</body>
</html>
```

## Development Workflow

### HTML Debugging

```html
<!-- ✅ Validation -->
<!DOCTYPE html>
<html lang="en" class="debug">

<head>
  <meta charset="UTF-8">
  <title>Debug Mode</title>
  <!-- Debug styles -->
  <style>
    .debug [data-debug] { border: 1px solid red; }
    .debug [hidden] { display: block !important; background: yellow; }
  </style>
</head>

<body data-debug>
  <!-- Content -->
</body>
```

### Testing Checklist

- [ ] HTML validates without errors (W3C Validator)
- [ ] Semantic structure is correct
- [ ] Images have alt text
- [ ] Form inputs are properly labeled
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works
- [ ] Screen reader accessibility tested
- [ ] Page works without CSS
- [ ] Page works without JavaScript
- [ ] Page loads under 3 seconds on 3G
- [ ] Search engine optimization elements present