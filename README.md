# Ali-Istiqama Travel

Ali-Istiqama Travel is a bilingual travel agency website for flight tickets, Hajj and Umrah, visa assistance, and cargo services. Visitors can explore destinations, prepare a trip inquiry, and send it to the Mogadishu travel team through WhatsApp or their email app.

## Run the website

Use Node.js 22.12 or newer. Node.js 20.19 or newer in the 20.x series also satisfies the installed Vite version.

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the versions in the lockfile |
| `npm run dev` | Start Vite for local development |
| `npm run lint` | Check the source with ESLint |
| `npm run build` | Run TypeScript checks and write the production site to `dist/` |
| `npm run preview` | Serve the production build locally for review |

Open the local URL printed by Vite. On Windows PowerShell, use `npm.cmd` in these commands if the system blocks `npm.ps1`.

## Pages and navigation

| URL relative to the site root | What it opens |
| --- | --- |
| `/` | Homepage, with Flight Tickets selected in the hero and travel planner |
| `/?page=destinations` | Local and international destination cards |
| `/?page=booking` | Flight Search, opened by **Book now** |
| `/?destination=Dhusamreeb#journey` | Homepage planner with the **To** field set to Dhusamreeb |
| `/destinations/credits.html` | Source credits for destination photography |

The home sections use the anchors `#home`, `#about`, `#services`, `#packages`, and `#journey`. The shared footer uses `#contact`. The navbar uses direct links on desktop and a modal drawer on smaller screens. React Router keeps internal links in the current tab and scrolls to section anchors. WhatsApp and social links open in a new tab, and telephone and email links open their respective apps. The drawer locks page scrolling while open and closes with Escape, the close button, a backdrop click, or navigation. **Skip to content** lets keyboard users go directly to the main content. The airline partner logos are shown above the footer on all three app pages.

## Homepage and travel planner

The Flight Tickets hero uses the supplied Somali Airlines image. Selecting a hero chip or a planner tab changes both the hero and the planner. The four service cards also select the corresponding planner and jump to it.

| Service | Planner fields |
| --- | --- |
| Flight tickets | Departure city, destination city, departure date, passenger count, and local or international flight type |
| Hajj and Umrah | Travel date, departure city, package tier, and budget range |
| Visa assistance | Country, visa type, and travel date |
| Cargo | Pickup city, delivery city, and shipment weight in kilograms |

The planner checks required fields and travel dates before opening an inquiry. Flight inquiries also require different departure and arrival cities. Footer service links open the relevant planner directly. The homepage also contains the agency overview, service cards, sample testimonials, and a featured Umrah package. Sample testimonials are labeled as examples until approved customer quotes are available. The package price is presented as an example. The business figures and booking assurance copy need confirmation from the agency before they are used as factual marketing claims.

## Destinations

Local destinations include Kismaayo, Mogadishu, Hargeisa, Garowe, Baidoa, and Dhusamreeb. International destinations include Dubai, Malaysia, India, Turkey, Saudi Arabia, and London.

Selecting a destination opens the homepage planner in the same tab. The link passes the city as a query parameter and points to `#journey`. A recognized city prefills the **To** field and selects the corresponding local or international flight type. These cards give visitors a starting point for asking about a route. Airline availability and prices are confirmed by the travel team.

## Flight Search

The **Book now** buttons open the dedicated booking page. Visitors can choose round trip or one way and enter the following details.

- **From** is required and lists the site's cities in local and international groups.
- **To** is a required dropdown using the same city list.
- **Departure date** accepts today or a future date. Round trips also require a return date on or after departure.
- **Passengers** starts at one and can be adjusted with plus and minus buttons.
- **Cabin class** offers Economy, Business, and First class as inquiry preferences.

The form rejects identical departure and arrival cities. **Request flight options** opens the inquiry preview with the trip details. The site currently supports requests to the travel team. Live inventory, fare lookup, payments, and ticket issuance would require a booking integration.

## Contact and inquiry delivery

**Contact us** in the footer opens a form. Name, phone, service, and message are required. Traveler count and travel month are optional. The phone field accepts 7 to 15 digits with common separators and an optional leading plus sign.

The travel planner, Flight Search, featured package, and contact form use the same inquiry dialog.

1. Review the prepared message.
2. Choose **Copy inquiry**, **WhatsApp**, or **Email inquiry** when an email address is configured.
3. Send the message in the selected app. The website prepares the draft. The visitor sends it.

The WhatsApp number is `+252 61 0755478`. Footer WhatsApp links start with a general inquiry message. The review dialog includes the visitor's actual trip or contact details in the message. The form uses in-memory React state. The language preference is the only value this application explicitly saves to local storage.

### Configure contact details

Create `.env.local` in the project root and set the values the agency wants to display.

```dotenv
VITE_CONTACT_EMAIL=your-inbox@example.com
VITE_CONTACT_PHONE=+252...
```

| Setting | What it affects |
| --- | --- |
| `VITE_CONTACT_EMAIL` | Footer email and the **Email inquiry** action. Without it, the footer displays the placeholder `info@alistiqama.com`. |
| `VITE_CONTACT_PHONE` | Optional telephone link in the footer. |
| WhatsApp, Facebook, Instagram | Maintained in [src/App.tsx](src/App.tsx). Change the displayed WhatsApp number and its `wa.me` URL together. |

Restart the dev server after changing environment values and rebuild before publishing. Vite embeds `VITE_*` values in the public bundle, so use them only for public information.

## Language and accessibility

English is the default. Choosing **so** in the **en | so** switch translates the React interface on the homepage, Destinations, Flight Search, and footer. The app sets the document language to `en` or `so` and stores the choice under `alistiqama-language`. Add new interface phrases to [src/somali.ts](src/somali.ts). Phrases without a Somali entry fall back to English. The standalone photo credits page uses English text.

The light palette is defined in [src/index.css](src/index.css). Component styles, layout breakpoints, and the frosted navigation are in [src/App.css](src/App.css).

The site uses labeled fields, visible focus outlines, native dialogs, descriptive image text where needed, and reduced-motion settings. The build can be checked with a keyboard and with either language enabled.

## Source map and routine updates

| File or directory | What to edit there |
| --- | --- |
| [src/main.tsx](src/main.tsx) | React entry point, React Router setup, and global CSS import |
| [src/App.tsx](src/App.tsx) | Page selection, navigation links, service data, hero slide text, cities, partner list, contact details, and inquiry handling |
| [src/somali.ts](src/somali.ts) | Somali translations for interface copy, labels, and destination names |
| [src/index.css](src/index.css) | Theme colors, typeface, global focus styles, and motion preferences |
| [src/App.css](src/App.css) | Responsive layouts and styles for page components |
| [index.html](index.html) | HTML shell and base page metadata |
| [public/](public/) | Hero backgrounds and other static assets |
| [public/destinations/](public/destinations/) | Destination photos and the standalone credit page |
| [src/assets/](src/assets/) | Agency logo and partner logos imported by React |
| [vite.config.ts](vite.config.ts) | Vite setup with the React and Tailwind plugins |

To add a destination, update `destinationGroups` and `destinationScenes` in `App.tsx`, add the image and credit, and update `somali.ts` where a translation is needed. The image filename is the lowercased city name with spaces replaced by hyphens, followed by `.jpg`. For example, `Saudi Arabia` uses `saudi-arabia.jpg`.

To replace a partner logo, update the imported image in `src/assets/partners/` and the corresponding entry in `App.tsx`. Logo images have accessible airline names. Vite processes imported logos as part of the build. Files in `public/` are copied as static assets.

## Publish and verify

The site is a static React and TypeScript app. Vite builds it, Framer Motion handles interface animation, and Lucide supplies icons. No application server or database is required to serve `dist/`.

1. Run lint and build, then use the preview command to inspect the production output.
2. Publish the contents of `dist/` to the static host. Configure Vite's base path before building if the site will live under a subdirectory.
3. Open the deployed homepage, Destinations, and Flight Search directly. Try a destination link, both trip types, an invalid phone number, and the inquiry preview.
4. Check the mobile drawer, keyboard focus, language persistence, and the footer and social links. Check that hero and destination photos load.
5. Confirm the contact inbox, example rates, business figures, booking assurance copy, and image credits against the agency's approved information.

React Router handles navigation in the browser while preserving the existing query parameters on the root document. The host needs to serve the built `index.html` for those URLs and retain their query parameters.
