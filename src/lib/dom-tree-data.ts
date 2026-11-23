export type DomKind = "document" | "element" | "text" | "attr";

export type DomNode = {
  tag: string;
  kind?: DomKind;
  attrs?: string;
  text?: string;
  note?: string;
  children?: DomNode[];
};

/** Structural DOM map of Bisma & Asma Cosmetics (store + admin shells). */
export const WEBSITE_DOM_TREE: DomNode = {
  tag: "document",
  kind: "document",
  children: [
    {
      tag: "html",
      attrs: 'lang="en"',
      children: [
        {
          tag: "head",
          children: [
            { tag: "meta", attrs: "charset" },
            { tag: "meta", attrs: "viewport" },
            {
              tag: "title",
              children: [{ tag: "#text", kind: "text", text: "Bisma & Asma Cosmetics" }],
            },
            { tag: "link", attrs: "fonts · Playfair + Jakarta" },
            { tag: "style", children: [{ tag: "#text", kind: "text", text: "(globals.css · theme)" }] },
          ],
        },
        {
          tag: "body",
          attrs: "antialiased · fonts",
          children: [
            {
              tag: "div.min-h-screen",
              note: "Store layout",
              children: [
                {
                  tag: "header.sticky",
                  children: [
                    {
                      tag: "div.PromoMarquee",
                      children: [
                        { tag: "p", children: [{ tag: "#text", kind: "text", text: "promo banners…" }] },
                      ],
                    },
                    {
                      tag: "div.nav-bar",
                      children: [
                        { tag: "a.SiteLogo", children: [{ tag: "#text", kind: "text", text: "Bisma & Asma" }] },
                        {
                          tag: "nav",
                          children: [
                            { tag: "a", children: [{ tag: "#text", kind: "text", text: "Lips" }] },
                            { tag: "a", children: [{ tag: "#text", kind: "text", text: "Cheeks" }] },
                            { tag: "a", children: [{ tag: "#text", kind: "text", text: "Complexion" }] },
                            { tag: "a", children: [{ tag: "#text", kind: "text", text: "Shop All" }] },
                          ],
                        },
                        {
                          tag: "form",
                          attrs: 'action="/shop"',
                          children: [
                            { tag: "input", attrs: 'name="q" · search' },
                          ],
                        },
                        { tag: "a", attrs: "Account" },
                        { tag: "button", attrs: "Log out" },
                        { tag: "a", attrs: "Cart" },
                      ],
                    },
                  ],
                },
                {
                  tag: "main",
                  note: "Homepage sections",
                  children: [
                    {
                      tag: "section.HomeHero",
                      children: [
                        { tag: "h1", children: [{ tag: "#text", kind: "text", text: "Brand + product hero" }] },
                        { tag: "p", children: [{ tag: "#text", kind: "text", text: "supporting copy" }] },
                        { tag: "img", attrs: "hero product" },
                        { tag: "button", attrs: "Add to cart" },
                      ],
                    },
                    {
                      tag: "section.HomeSlider",
                      children: [
                        { tag: "div.slide", children: [{ tag: "img" }, { tag: "h2" }, { tag: "a", attrs: "Shop now" }] },
                        { tag: "div.dots", children: [{ tag: "button" }, { tag: "button" }] },
                      ],
                    },
                    {
                      tag: "section.Trending",
                      children: [
                        { tag: "h2", children: [{ tag: "#text", kind: "text", text: "Trending now" }] },
                        {
                          tag: "div.grid",
                          children: [
                            { tag: "article.ProductCard", children: [{ tag: "img" }, { tag: "h3" }, { tag: "button" }] },
                            { tag: "article.ProductCard", note: "×12" },
                          ],
                        },
                      ],
                    },
                    { tag: "section.ShadeDiagnostic" },
                    { tag: "section.RoutineKit" },
                    { tag: "section.Reviews" },
                    { tag: "section.TrustStrip" },
                  ],
                },
                {
                  tag: "footer",
                  children: [
                    { tag: "a.SiteLogo" },
                    { tag: "nav", children: [{ tag: "a", note: "shop links" }] },
                    { tag: "div.SocialLinks", children: [{ tag: "a", attrs: "Facebook" }, { tag: "a", attrs: "Instagram" }] },
                  ],
                },
              ],
            },
            {
              tag: "div.admin-shell",
              note: "Admin layout · /admin",
              children: [
                {
                  tag: "aside.sidebar",
                  children: [
                    { tag: "a.SiteLogo" },
                    {
                      tag: "nav",
                      children: [
                        { tag: "a", children: [{ tag: "#text", kind: "text", text: "Dashboard" }] },
                        { tag: "a", children: [{ tag: "#text", kind: "text", text: "Categories" }] },
                        { tag: "a", children: [{ tag: "#text", kind: "text", text: "Products" }] },
                        { tag: "a", children: [{ tag: "#text", kind: "text", text: "Orders" }] },
                        { tag: "a", children: [{ tag: "#text", kind: "text", text: "Customers" }] },
                        { tag: "a", children: [{ tag: "#text", kind: "text", text: "Banners" }] },
                        { tag: "a", children: [{ tag: "#text", kind: "text", text: "Slides" }] },
                        { tag: "a", children: [{ tag: "#text", kind: "text", text: "DOM Tree" }] },
                        { tag: "a", children: [{ tag: "#text", kind: "text", text: "Settings" }] },
                        { tag: "a", children: [{ tag: "#text", kind: "text", text: "Profile" }] },
                      ],
                    },
                    { tag: "button", attrs: "Log out" },
                  ],
                },
                {
                  tag: "div.admin-main",
                  children: [
                    {
                      tag: "header",
                      children: [
                        { tag: "p", children: [{ tag: "#text", kind: "text", text: "Store Status · Live" }] },
                        { tag: "a", attrs: "admin avatar · profile" },
                      ],
                    },
                    {
                      tag: "div.content",
                      children: [
                        { tag: "h1", children: [{ tag: "#text", kind: "text", text: "Page title" }] },
                        { tag: "table / forms / grids", note: "CRUD pages" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              tag: "div.account",
              note: "Customer dashboard · /account",
              children: [
                { tag: "h1", children: [{ tag: "#text", kind: "text", text: "Welcome back" }] },
                { tag: "button", attrs: "Log out" },
                { tag: "section", attrs: "Active order · OrderStepper" },
                { tag: "section", attrs: "Order history table" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
