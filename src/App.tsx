import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, Box, CalendarDays, Check, ChevronDown, Compass, Camera, Headphones, Users, Mail, MapPin, Menu, MessageCircle, Moon, Sun, Music2, Package, Phone, Plane, ShieldCheck, Star, Ticket, X } from 'lucide-react'
import logo from './assets/logo.png'
import './App.css'

const photo = import.meta.env.BASE_URL + 'haram.jpg'
const contact = {
  email: import.meta.env.VITE_CONTACT_EMAIL as string | undefined,
  phone: import.meta.env.VITE_CONTACT_PHONE as string | undefined,
  whatsapp: import.meta.env.VITE_WHATSAPP as string | undefined,
}
const links = ['Home', 'About', 'Services', 'Destinations', 'Packages', 'Contact']
const services = [
  { title: 'Hajj & Umrah Packages', tab: 'Hajj & Umrah', icon: Box, text: 'All-inclusive pilgrimages with accommodation, transfers and guidance from experienced advisors.', fields: [['Travel dates', 'date'], ['Departure city', 'text', 'e.g. Nairobi'], ['Package', 'Economy', 'Standard', 'VIP'], ['Budget range', 'Under $1,500', '$1,500–$2,500', '$2,500+']], action: 'Search' },
  { title: 'Flight Ticket Booking', tab: 'Flight Tickets', icon: Plane, text: 'Find competitive fares for domestic and international flights that fit your plans.', fields: [['From', 'text', 'Departure city'], ['To', 'text', 'Destination city'], ['Departure date', 'date'], ['Passengers', '1 passenger', '2 passengers', '3 passengers', '4+ passengers']], action: 'Search' },
  { title: 'Visa Application', tab: 'Visa', icon: Ticket, text: 'Get help preparing your documents and navigating the visa application process.', fields: [['Country', 'text', 'Destination country'], ['Visa type', 'Umrah', 'Tourist', 'Business', 'Transit'], ['Travel date', 'date']], action: 'Apply' },
  { title: 'Cargo Services', tab: 'Cargo', icon: Package, text: 'Send shipments locally or internationally with reliable, trackable delivery.', fields: [['Origin', 'text', 'Pickup city'], ['Destination', 'text', 'Delivery city'], ['Weight (kg)', 'number', 'e.g. 10']], action: 'Get quote' },
]

const homeUrl = import.meta.env.BASE_URL
const destinationsUrl = homeUrl + '?page=destinations'
const pageParams = new URLSearchParams(window.location.search)
const isDestinationsPage = pageParams.get('page') === 'destinations'
const destinationGroups = [
  { type: 'Local', title: 'Local destinations', places: ['Kismaayo', 'Mogadishu', 'Hargeisa', 'Garowe', 'Baidoa'] },
  { type: 'International', title: 'International destinations', places: ['Dubai', 'Malaysia', 'India', 'Turkey', 'Saudi Arabia', 'London'] },
] as const
const requestedDestination = pageParams.get('destination')
const flightGroup = destinationGroups.find(group => group.places.some(place => place === requestedDestination))

function navHref(link: string) {
  return link === 'Destinations' ? destinationsUrl : (isDestinationsPage ? homeUrl : '') + '#' + link.toLowerCase()
}

const destinationScenes: Record<string, string> = {
  Kismaayo: 'Kismaayo, Somalia',
  Mogadishu: 'Lido Beach, Mogadishu',
  Hargeisa: 'Aerial view of Hargeisa',
  Garowe: 'Garowe cityscape',
  Baidoa: 'Baidoa, Somalia',
  Dubai: 'Dubai Creek, Dubai',
  Malaysia: 'Kuala Lumpur, Malaysia',
  India: 'Taj Mahal, Agra',
  Turkey: 'Istanbul, Turkey',
  'Saudi Arabia': 'Riyadh, Saudi Arabia',
  London: 'London, United Kingdom',
}

function Destinations() {
  const images = homeUrl + 'destinations/'
  return <div className="destinations">
    <header className="destination-hero">
      <img className="destination-hero-photo" src={images + 'hero.jpg'} alt="Waterfront and skyline of Dubai Marina" fetchPriority="high" />
      <div className="shell destination-hero-content">
        <a className="destinations-back" href={homeUrl}><ArrowLeft size={17} /> Back to home</a>
        <Tag>Flight Tickets</Tag>
        <h1>Explore our <em>destinations</em></h1>
        <p>Choose a local or international destination to start your flight inquiry.</p>
      </div>
    </header>
    <div className="shell destination-content">
      {destinationGroups.map(({ type, title, places }) => <section className="destination-group" key={type}>
        <h2>{title}</h2>
        <ul className="destination-grid">
          {places.map(place => {
            const image = place.toLowerCase().replaceAll(' ', '-')
            return <li key={place}>
              <a className="card destination-link" href={homeUrl + '?' + new URLSearchParams({ destination: place }) + '#journey'}>
                <div className="destination-photo"><img src={images + image + '.jpg'} alt="" loading="lazy" decoding="async" /></div>
                <div className="destination-label">
                  <span><strong>{place}</strong><small>{destinationScenes[place]}</small></span>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </div>
              </a>
            </li>
          })}
        </ul>
      </section>)}
      <a className="destination-credits" href={images + 'credits.html'}>Destination photo credits</a>
    </div>
  </div>
}

function ButtonLink({ children, href = (isDestinationsPage ? homeUrl : '') + '#journey', outline = false }: { children: ReactNode; href?: string; outline?: boolean }) {
  return <a className={'pill' + (outline ? ' outline' : '')} href={href}>{children}<span><ArrowUpRight size={16} /></span></a>
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="tag"><i />{children}</span>
}

function Reveal({ children, id, className = '' }: { children: ReactNode; id?: string; className?: string }) {
  const reduced = useReducedMotion()
  return <motion.section id={id} className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.section>
}

type Theme = 'dark' | 'light'

function Navbar({ theme, onThemeChange }: { theme: Theme; onThemeChange: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const menu = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <header className={scrolled ? 'nav scrolled' : 'nav'}>
    <div className="shell nav-inner">
      <a href={navHref('Home')} className="brand"><img src={logo} alt="Ali-Istiqama Travel Umrah & Hajj LLC" /></a>
      <nav aria-label="Main navigation">{links.map(link => <a key={link} href={navHref(link)} aria-current={isDestinationsPage && link === 'Destinations' ? 'page' : undefined}>{link}<ChevronDown size={12} /></a>)}</nav>
      <div className="nav-actions"><button type="button" className="round theme-toggle" aria-label="Light mode" aria-pressed={theme === 'light'} onClick={onThemeChange}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button><ButtonLink>Book now</ButtonLink><button className="round menu-toggle" aria-label="Open navigation" onClick={() => menu.current?.showModal()}><Menu size={22} /></button></div>
    </div>
    <dialog ref={menu} className="drawer" aria-label="Navigation menu" onClick={event => { if (event.target === event.currentTarget) menu.current?.close() }}>
      <div className="drawer-content"><button className="round" aria-label="Close navigation" onClick={() => menu.current?.close()}><X /></button>
        {links.map(link => <a key={link} href={navHref(link)} aria-current={isDestinationsPage && link === 'Destinations' ? 'page' : undefined} onClick={() => menu.current?.close()}>{link}<ArrowUpRight size={18} /></a>)}
      </div>
    </dialog>
  </header>
}

const heroSlides = [
  { title: 'Hajj &', accent: 'Umrah', image: 'haram.jpg', alt: 'Pilgrims gathered around the Kaaba at night', description: 'Plan your pilgrimage with guided packages, accommodation, transport and support from departure to return.' },
  { title: 'Flight', accent: 'Tickets', image: 'hero-flights.jpg', alt: 'An airplane wing above the clouds at sunset', description: 'Book local and international flights with help finding fares, routes and dates that fit your plans.' },
  { title: 'Visa', accent: 'Applications', image: 'hero-visa.jpg', alt: 'Passports and travel documents ready for a trip', description: 'Get help preparing your documents and navigating the application process for your destination.' },
  { title: 'Cargo', accent: 'Services', image: 'hero-cargo.jpg', alt: 'Shipping containers at a cargo port', description: 'Arrange local or international shipping and request a quote for your route and shipment weight.' },
]

function Hero({ active, onSelect, children }: { active: number; onSelect: (index: number) => void; children: ReactNode }) {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const offset = useTransform(scrollY, [0, 750], [0, 125])
  const slide = heroSlides[active]

  return <section id="home" className="hero">
    <AnimatePresence initial={false}>
      <motion.img key={slide.image} className="hero-photo" src={import.meta.env.BASE_URL + slide.image}
        alt={slide.alt} style={{ y: reduced ? 0 : offset }} fetchPriority={active === 0 ? 'high' : 'auto'}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.55 }} />
    </AnimatePresence>
    <div className="hero-shade" />
    <div className="hero-copy shell">
      <Tag>Ali-Istiqama Travel Services</Tag>
      <div className="hero-message" aria-live="polite" aria-atomic="true">
        <motion.div key={slide.image} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}>
          <h1>{slide.title} <em>{slide.accent}</em></h1>
          <p>{slide.description}</p>
        </motion.div>
      </div>
      <div className="hero-services" role="group" aria-label="Featured services">
        {services.map(({ tab, icon: Icon }, index) =>
          <button key={tab} type="button" aria-pressed={active === index} onClick={() => onSelect(index)}>
            <Icon size={16} aria-hidden="true" />{tab}
          </button>
        )}
      </div>
    </div>
    <div className="shell hero-search">{children}</div>
    <div className="shell hero-notes"><a href="#services">EXPLORE OUR SERVICES <ArrowDown size={14} /></a></div>
  </section>
}

function SearchCard({ active, setActive, onInquiry }: { active: number; setActive: (value: number) => void; onInquiry: (value: string) => void }) {
  const service = services[active]
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const details = [...new FormData(event.currentTarget)].map(([label, value]) => label + ': ' + value)
    onInquiry([service.title, ...details].join('\n'))
  }
  return <div className="search-card" id="journey">
    <div className="search-top"><h2>Start Your Journey</h2><span><Compass size={15} /> TRAVEL PLANNER</span></div>
    <div className="service-tabs" role="group" aria-label="Travel service">
      {services.map(({ tab, icon: Icon }, index) => <button key={tab} type="button" aria-pressed={active === index} onClick={() => setActive(index)}><Icon size={16} />{tab}</button>)}
    </div>
    <form key={service.tab} onSubmit={submit} className="search-form" style={{ gridTemplateColumns: 'repeat(' + service.fields.length + ', minmax(0, 1fr)) auto' }}>
      {service.fields.map(([label, kind, ...options], index) => {
        const Icon = [CalendarDays, MapPin, Ticket, Box][index]
        const isInput = ['text', 'date', 'number'].includes(kind)
        return <label className="field" key={label}><Icon size={17} /><span>{label}
          {isInput ? <input aria-label={label} name={label} type={kind} placeholder={options[0]} defaultValue={active === 1 && label === 'To' && flightGroup ? requestedDestination ?? undefined : undefined} required min={kind === 'number' ? '0.01' : undefined} step={kind === 'number' ? '0.01' : undefined} /> :
            <select name={label} required defaultValue=""><option value="" disabled>Select {label.toLowerCase()}</option>{[kind, ...options].map(option => <option key={option}>{option}</option>)}</select>}
        </span></label>
      })}
      <button className="pill search-submit">{service.action}<ArrowRight size={17} /></button>
      {active === 1 && <fieldset className="flight-type"><legend className="sr-only">Flight type</legend><label><input type="radio" name="Flight type" value="Local" defaultChecked={flightGroup?.type !== 'International'} /> Local</label><label><input type="radio" name="Flight type" value="International" defaultChecked={flightGroup?.type === 'International'} /> International</label></fieldset>}
    </form>
  </div>
}

const airlinePartners = [
  ['EK', 'Emirates'],
  ['QR', 'Qatar Airways'],
  ['SV', 'Saudia'],
  ['EY', 'Etihad Airways'],
  ['TK', 'Turkish Airlines'],
  ['OV', 'SalamAir'],
  ['PK', 'Pakistan International Airlines'],
  ['FZ', 'flydubai'],
  ['D3', 'Daallo Airlines'],
  ['MS', 'EgyptAir'],
] as const

function AirlinePartners() {
  return <section className="airline-partners" aria-labelledby="airline-partners-title">
    <h2 id="airline-partners-title">Our <em>airline partners</em></h2>
    <ul className="partner-grid">
      {airlinePartners.map(([code, name]) => <li key={code}>
        <img src={homeUrl + 'partners/' + code + '.png'} alt="" width={128} height={128} loading="lazy" decoding="async" />
        <span>{name}</span>
      </li>)}
    </ul>
  </section>
}

function About() {
  return <Reveal id="about" className="shell section about">
    <div><Tag>Who We Are</Tag><h2>Travel, pilgrimage and cargo, <em>planned with care.</em></h2><ButtonLink outline>Book now</ButtonLink></div>
    <div className="about-grid">
      <div className="about-photo"><img src={photo} loading="lazy" alt="The Kaaba in the courtyard of the Grand Mosque" /><p>We arrange Hajj and Umrah journeys, local and international flights, visa application support and cargo shipping. Our team helps you plan the details at every step.</p></div>
      <div className="stat stat-green"><strong>3k+</strong><span>Pilgrims guided</span><div className="avatars" aria-hidden="true"><span>AI</span><span>MH</span><span>+</span></div></div>
      <div className="stat"><strong>95%</strong><span>Pilgrims satisfied</span></div>
      <div className="stat"><strong>20+</strong><span>Years of experience</span></div>
    </div>
    <AirlinePartners />
  </Reveal>
}

function Services({ choose }: { choose: (index: number) => void }) {
  return <Reveal id="services" className="section shell"><div className="section-heading"><Tag>What We Offer</Tag><h2>Everything you need to <em>travel with confidence</em></h2></div>
    <div className="service-grid">{services.map(({ title, text, icon: Icon }, index) => <article key={title} className="card service"><span className="tile-icon"><Icon /></span><h3>{title}</h3><p>{text}</p><a href="#journey" onClick={() => choose(index)}>Learn more <ArrowUpRight size={16} /></a></article>)}</div>
  </Reveal>
}

const reviewPrompts = [
  ['Planning your journey', 'How did the team help you prepare for Hajj or Umrah?'],
  ['Arriving in the holy cities', 'How was your experience with accommodation and transfers?'],
  ['Guidance during your pilgrimage', 'What stood out about the on-ground support?'],
]
function Testimonials() {
  const [active, setActive] = useState(0)
  const move = (amount: number) => setActive((active + amount + reviewPrompts.length) % reviewPrompts.length)
  return <Reveal className="section shell"><div className="section-heading"><Tag>Pilgrim Experiences</Tag><h2>Stories from our <em>pilgrims</em></h2></div>
    <div className="reviews">
      <div className="stat card"><span>Facts & Numbers</span><strong>95%</strong><span>Pilgrim satisfaction</span></div>
      <div className="card quote" aria-live="polite"><span className="quote-mark">“</span><h3>{reviewPrompts[active][0]}</h3><p>{reviewPrompts[active][1]}</p><small>Verified pilgrim reviews coming soon</small></div>
      <div className="review-image"><img src={photo} loading="lazy" alt="Pilgrims at Masjid al-Haram" /></div>
    </div>
    <div className="carousel-controls"><button className="round" onClick={() => move(-1)} aria-label="Previous testimonial topic"><ArrowLeft size={19} /></button>{reviewPrompts.map(([title], index) => <button className="dot-control" key={title} aria-label={title} aria-pressed={active === index} onClick={() => setActive(index)} />)}<button className="round" onClick={() => move(1)} aria-label="Next testimonial topic"><ArrowRight size={19} /></button></div>
  </Reveal>
}

function PackageCard({ onInquiry }: { onInquiry: (value: string) => void }) {
  return <Reveal id="packages" className="section shell"><div className="section-heading"><Tag>Featured Package</Tag><h2>All-in <em>Umrah</em> package</h2></div>
    <div className="card package-card"><div className="package-included"><h3>Services Included</h3><ul>{['Round-trip flights', 'Hotel near the Haram', 'Umrah visa assistance', 'Airport and intercity transport', 'Guided ziyarat', '24/7 support'].map(item => <li key={item}><Check size={18} />{item}</li>)}</ul></div>
      <div className="package-details"><div className="package-badges"><span className="stars" aria-label="Sample five-star rating">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill="currentColor" />)}</span><span><ShieldCheck size={15} /> 7-Day Booking Assurance</span></div><p>Example package price</p><strong>$1,999</strong><dl><div><dt>Time Savings</dt><dd>Travel arranged for you</dd></div><div><dt>Expert Guidance</dt><dd>On-ground support</dd></div><div><dt>Reliable Solutions</dt><dd>Coordinated stays and transfers</dd></div></dl><button className="pill" onClick={() => onInquiry('Featured All-in Umrah package')}>Get started <span><ArrowUpRight size={16} /></span></button></div>
    </div>
  </Reveal>
}

function TrustBanner() {
  const values = [
    [BadgeCheck, 'Licensed & Accredited', 'Ask our team for licensing and accreditation details.'],
    [Compass, 'Expert Advisors', 'Get practical guidance before you depart and during your pilgrimage.'],
    [Headphones, 'Personalized Care', 'Plan around your needs, travel dates and budget.'],
  ] as const
  return <Reveal className="trust"><img src={photo} loading="lazy" alt="The illuminated courtyard at Masjid al-Haram" /><div className="shell trust-inner"><Tag>Why Travel With Us</Tag><h2>A journey <em>built on trust</em></h2><div className="trust-grid">{values.map(([Icon, title, text]) => <article key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>)}</div></div></Reveal>
}

function Footer({ onInquiry }: { onInquiry: (value: string) => void }) {
  const blocks = [[Phone, 'Call Today', contact.phone, 'tel:'], [Mail, 'Email', contact.email, 'mailto:'], [Headphones, 'Support', 'Prepare an inquiry', '']] as const
  const socials = [[Users, 'Facebook', import.meta.env.VITE_FACEBOOK_URL], [Camera, 'Instagram', import.meta.env.VITE_INSTAGRAM_URL], [MessageCircle, 'WhatsApp', contact.whatsapp && 'https://wa.me/' + contact.whatsapp.replace(/\D/g, '')], [Music2, 'TikTok', import.meta.env.VITE_TIKTOK_URL]] as const
  return <footer id="contact" className="shell footer">
    <div className="contact-grid">{blocks.map(([Icon, title, value, protocol]) => <div key={title}><Icon size={22} /><div><h3>{title}</h3>{value && protocol ? <a href={protocol + value}>{value}</a> : value ? <button onClick={() => onInquiry('Travel support inquiry')}>{value}</button> : <p>Details coming soon</p>}</div></div>)}</div>
    <button className="talk" onClick={() => onInquiry('General travel inquiry')}>Let's-<em>talk</em><ArrowUpRight /></button>
    <div className="footer-bottom"><p>© 2026 Ali-Istiqama Travel Umrah & Hajj LLC. All rights reserved.</p><div className="socials">{socials.map(([Icon, title, href]) => href ? <a key={title} href={href} className="round" aria-label={title}><Icon size={17} /></a> : <span key={title} className="round unavailable" title={title + ' link coming soon'} aria-label={title + ' link coming soon'}><Icon size={17} /></span>)}</div><div className="footer-links"><a href={navHref('Services')}>Style guide</a><a href="https://commons.wikimedia.org/wiki/File:Mecca.JPG">Photo license</a><button onClick={() => onInquiry('Booking terms inquiry')}>Terms</button></div></div>
    <p className="credit">Haram photography by <a href="https://commons.wikimedia.org/wiki/File:Mecca.JPG">Ariandra 03</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>.</p>
    {contact.whatsapp ? <a className="floating-chat" href={'https://wa.me/' + contact.whatsapp.replace(/\D/g, '')} aria-label="Chat on WhatsApp"><MessageCircle /></a> : <button className="floating-chat" aria-label="Prepare a WhatsApp inquiry" onClick={() => onInquiry('WhatsApp travel inquiry')}><MessageCircle /></button>}
  </footer>
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#f4f8f4' : '#07110c')
    setTheme(next)
    try {
      localStorage.setItem('alistiqama-theme', next)
    } catch {
      // The preference still works for the current page when storage is unavailable.
    }
  }
  const [active, setActive] = useState(flightGroup ? 1 : 0)
  const [inquiry, setInquiry] = useState('')
  const [copyState, setCopyState] = useState('')
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (isDestinationsPage) document.title = 'Flight Destinations | Ali-Istiqama Travel'
    if (!isDestinationsPage && flightGroup && window.location.hash === '#journey') {
      document.getElementById('journey')?.scrollIntoView({ behavior: 'instant' })
    }
  }, [])

  function openInquiry(value: string) {
    setInquiry(value)
    setCopyState('')
    dialog.current?.showModal()
  }
  async function copyInquiry() {
    try {
      await navigator.clipboard.writeText(inquiry)
      setCopyState('Inquiry copied.')
    } catch {
      setCopyState('Select the inquiry text to copy it manually.')
    }
  }
  return <>
    <Navbar theme={theme} onThemeChange={toggleTheme} />
    <main>{isDestinationsPage ? <Destinations /> : <>
      <Hero active={active} onSelect={setActive}><SearchCard active={active} setActive={setActive} onInquiry={openInquiry} /></Hero>
      <About /><Services choose={setActive} /><Testimonials /><PackageCard onInquiry={openInquiry} /><TrustBanner />
    </>}</main>
    <Footer onInquiry={openInquiry} />
    <dialog ref={dialog} className="inquiry-dialog" aria-labelledby="inquiry-title"><div className="dialog-heading"><h2 id="inquiry-title">Your travel inquiry</h2><button className="round" aria-label="Close inquiry" onClick={() => dialog.current?.close()}><X size={20} /></button></div><p>Review and copy your details{contact.email || contact.whatsapp ? ', or send them to our travel team.' : '.'}</p><textarea aria-label="Inquiry details" readOnly value={inquiry} rows={6} /><div className="inquiry-actions"><button className="pill" onClick={copyInquiry}>Copy inquiry</button>{contact.email && <a className="pill outline" href={'mailto:' + contact.email + '?subject=Travel inquiry&body=' + encodeURIComponent(inquiry)}>Email inquiry</a>}{contact.whatsapp && <a className="pill outline" href={'https://wa.me/' + contact.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent(inquiry)}>WhatsApp</a>}</div><p role="status">{copyState}</p></dialog>
  </>
}



