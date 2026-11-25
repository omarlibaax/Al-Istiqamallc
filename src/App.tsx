import { Link, useLocation } from 'react-router-dom'
import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Box, CalendarDays, Check, Compass, Mail, MapPin, Menu, MessageCircle, Minus, Plus, Package, Phone, Plane, ShieldCheck, Star, Ticket, X } from 'lucide-react'
import logo from './assets/logo.png'
import d3Logo from './assets/partners/D3.png'
import ekLogo from './assets/partners/EK.webp'
import eyLogo from './assets/partners/EY.png'
import fzLogo from './assets/partners/FZ.svg'
import msLogo from './assets/partners/MS.png'
import ovLogo from './assets/partners/OV.png'
import pkLogo from './assets/partners/PK.png'
import qrLogo from './assets/partners/QR.png'
import svLogo from './assets/partners/SV.png'
import tkLogo from './assets/partners/TK.png'
import somali from './somali'
import daLogo from './assets/partners/DA.png'
import etLogo from './assets/partners/ET.svg'
import mqLogo from './assets/partners/MQ.png'
import saLogo from './assets/partners/SA.png'
import sxLogo from './assets/partners/SX.png'
import './App.css'

type Language = 'en' | 'so'
const LanguageContext = createContext<Language>('en')

function translate(language: Language, text: string) {
  return language === 'so' && Object.hasOwn(somali, text) ? somali[text] : text
}

function useTranslation() {
  const language = useContext(LanguageContext)
  return (text: string) => translate(language, text)
}

const contact = {
  email: import.meta.env.VITE_CONTACT_EMAIL as string | undefined,
  phone: import.meta.env.VITE_CONTACT_PHONE as string | undefined,
  whatsapp: '+252 61 0755478',
}
const whatsappUrl = 'https://wa.me/252610755478'
const links = ['Home', 'About', 'Services', 'Destinations', 'Packages', 'Contact']
const services = [
  { title: 'Ticket Reservation', tab: 'Flight Tickets', icon: Plane, text: 'Find competitive fares for domestic and international flights that fit your plans.', fields: [['From', 'city'], ['To', 'city'], ['Departure date', 'date'], ['Passengers', 'count']], action: 'Search' },
  { title: 'Hajj & Umrah Packages', tab: 'Hajj & Umrah', icon: Box, text: 'All-inclusive pilgrimages with accommodation, transfers and guidance from experienced advisors.', fields: [['Travel dates', 'date'], ['Departure city', 'text', 'e.g. Nairobi'], ['Package', 'Economy', 'Standard', 'VIP'], ['Budget range', 'Under $1,500', '$1,500–$2,500', '$2,500+']], action: 'Search' },
  { title: 'Visa Application', tab: 'Visa', icon: Ticket, text: 'Get help preparing your documents and navigating the visa application process.', fields: [['Country', 'text', 'Destination country'], ['Visa type', 'Umrah', 'Tourist', 'Business', 'Transit'], ['Travel date', 'date']], action: 'Apply' },
  { title: 'Cargo Services', tab: 'Cargo', icon: Package, text: 'Send shipments locally or internationally with reliable, trackable delivery.', fields: [['Origin', 'text', 'Pickup city'], ['Destination', 'text', 'Delivery city'], ['Weight (kg)', 'number', 'e.g. 10']], action: 'Get quote' },
]

const homeUrl = import.meta.env.BASE_URL
const destinationsUrl = '/?page=destinations'
const bookingUrl = '/?page=booking'
const destinationGroups = [
  { type: 'Local', title: 'Local destinations', places: ['Kismaayo', 'Mogadishu', 'Hargeisa', 'Garowe', 'Baidoa', 'Dhusamreeb'] },
  { type: 'International', title: 'International destinations', places: ['Dubai', 'Malaysia', 'India', 'Turkey', 'Saudi Arabia', 'London'] },
] as const
const serviceIds = ['flights', 'pilgrimage', 'visa', 'cargo']

function navHref(link: string, search = '') {
  if (link === 'Contact') return '/' + search + '#contact'
  return link === 'Destinations' ? destinationsUrl : '/#' + link.toLowerCase()
}

const destinationScenes: Record<string, string> = {
  Kismaayo: 'Kismaayo, Somalia',
  Mogadishu: 'Lido Beach, Mogadishu',
  Hargeisa: 'Aerial view of Hargeisa',
  Garowe: 'Garowe cityscape',
  Baidoa: 'Baidoa, Somalia',
  Dhusamreeb: 'Dhusamreeb, Somalia',
  Dubai: 'Dubai Creek, Dubai',
  Malaysia: 'Kuala Lumpur, Malaysia',
  India: 'Taj Mahal, Agra',
  Turkey: 'Istanbul, Turkey',
  'Saudi Arabia': 'Riyadh, Saudi Arabia',
  London: 'London, United Kingdom',
}

function todayForInput() {
  const date = new Date()
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map(part => String(part).padStart(2, '0')).join('-')
}

function Destinations() {
  const t = useTranslation()
  const images = homeUrl + 'destinations/'
  return <div className="destinations">
    <header className="destination-hero">
      <img className="destination-hero-photo" src={images + 'hero.jpg'} alt={t('Waterfront and skyline of Dubai Marina')} fetchPriority="high" />
      <div className="shell destination-hero-content">
        <Link className="destinations-back" to="/"><ArrowLeft size={17} /> {t('Back to home')}</Link>
        <Tag>{t('Flight Tickets')}</Tag>
        <h1>{t('Explore our')} <em>{t('destinations')}</em></h1>
        <p>{t('Choose a local or international destination to start your flight inquiry.')}</p>
      </div>
    </header>
    <div className="shell destination-content">
      {destinationGroups.map(({ type, title, places }) => <section className="destination-group" key={type}>
        <h2>{t(title)}</h2>
        <ul className="destination-grid">
          {places.map(place => {
            const image = place.toLowerCase().replaceAll(' ', '-')
            return <li key={place}>
              <Link className="card destination-link" to={'/?' + new URLSearchParams({ destination: place }) + '#journey'}>
                <div className="destination-photo"><img src={images + image + '.jpg'} alt="" loading="lazy" decoding="async" /></div>
                <div className="destination-label">
                  <span><strong>{t(place)}</strong><small>{t(destinationScenes[place])}</small></span>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </div>
              </Link>
            </li>
          })}
        </ul>
      </section>)}
    </div>
  </div>
}

function ButtonLink({ children, href = bookingUrl, outline = false, showArrow = true }: { children: ReactNode; href?: string; outline?: boolean; showArrow?: boolean }) {
  const { search } = useLocation()
  const isBookingPage = new URLSearchParams(search).get('page') === 'booking'
  return <Link className={'pill' + (outline ? ' outline' : '')} to={href} aria-current={isBookingPage && href === bookingUrl ? 'page' : undefined}>{children}{showArrow && <span aria-hidden="true"><ArrowUpRight size={16} /></span>}</Link>
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="tag"><i />{children}</span>
}

function Reveal({ children, id, className = '' }: { children: ReactNode; id?: string; className?: string }) {
  const reduced = useReducedMotion()
  return <motion.section id={id} className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.section>
}

function Navbar({ language, onLanguageChange }: { language: Language; onLanguageChange: (value: Language) => void }) {
  const t = useTranslation()
  const { search } = useLocation()
  const isDestinationsPage = new URLSearchParams(search).get('page') === 'destinations'
  const [scrolled, setScrolled] = useState(false)
  const menu = useRef<HTMLDialogElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    if (!menuOpen) return
    const close = () => menu.current?.close()
    window.addEventListener('hashchange', close)
    return () => window.removeEventListener('hashchange', close)
  }, [menuOpen])

  return <header className={scrolled ? 'nav scrolled' : 'nav'}>
    <div className="shell nav-inner">
      <Link to={navHref('Home')} className="brand"><img src={logo} alt="Ali-Istiqama Travel Umrah & Hajj LLC" /></Link>
      <nav aria-label={t('Main navigation')}>{links.map(link => <Link key={link} to={navHref(link, search)} aria-current={isDestinationsPage && link === 'Destinations' ? 'page' : undefined}>{t(link)}</Link>)}</nav>
      <div className="nav-actions"><div className="language-switch" role="group" aria-label={language === 'so' ? 'Luqadda' : 'Language'}>
        <button type="button" lang="en" aria-label="English" aria-pressed={language === 'en'} onClick={() => onLanguageChange('en')}>EN</button>
        <span aria-hidden="true">|</span>
        <button type="button" lang="so" aria-label="Soomaali" aria-pressed={language === 'so'} onClick={() => onLanguageChange('so')}>SO</button>
      </div><ButtonLink showArrow={false}>{t('Book now')}</ButtonLink><button className="round menu-toggle" aria-label={t('Open navigation')} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => { menu.current?.showModal(); setMenuOpen(true) }}><Menu size={22} /></button></div>
    </div>
    <dialog id="mobile-navigation" ref={menu} className="drawer" onClose={() => setMenuOpen(false)} aria-label={t('Navigation menu')} onClick={event => { if (event.target === event.currentTarget) menu.current?.close() }}>
      <div className="drawer-content"><button className="round" aria-label={t('Close navigation')} onClick={() => menu.current?.close()}><X /></button>
        {links.map(link => <Link key={link} to={navHref(link, search)} aria-current={isDestinationsPage && link === 'Destinations' ? 'page' : undefined} onClick={() => menu.current?.close()}>{t(link)}</Link>)}
      </div>
    </dialog>
  </header>
}

const heroSlides = [
  { title: 'Flight', accent: 'Tickets', image: 'hero-flights.jpg', alt: 'A Somali Airlines airplane flying over a coastal landscape', description: 'Book local and international flights with help finding fares, routes and dates that fit your plans.' },
  { title: 'Hajj &', accent: 'Umrah', image: 'haram.jpg', alt: 'Pilgrims gathered around the Kaaba at night', description: 'Plan your pilgrimage with guided packages, accommodation, transport and support from departure to return.' },
  { title: 'Visa', accent: 'Applications', image: 'hero-visa.jpg', alt: 'Passports and travel documents ready for a trip', description: 'Get help preparing your documents and navigating the application process for your destination.' },
  { title: 'Cargo', accent: 'Services', image: 'hero-cargo.jpg', alt: 'Shipping containers at a cargo port', description: 'Arrange local or international shipping and request a quote for your route and shipment weight.' },
]

function Hero({ active, onSelect, children }: { active: number; onSelect: (index: number) => void; children: ReactNode }) {
  const t = useTranslation()
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const offset = useTransform(scrollY, [0, 750], [0, 125])
  const slide = heroSlides[active]

  return <section id="home" className="hero">
    <AnimatePresence initial={false}>
      <motion.img key={slide.image} className="hero-photo" src={import.meta.env.BASE_URL + slide.image}
        alt={t(slide.alt)} style={{ y: reduced ? 0 : offset }} fetchPriority={active === 0 ? 'high' : 'auto'}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.55 }} />
    </AnimatePresence>
    <div className="hero-shade" />
    <div className="hero-copy shell">
      <Tag>{t('Ali-Istiqama Travel Services')}</Tag>
      <div className="hero-message" aria-live="polite" aria-atomic="true">
        <motion.div key={slide.image} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}>
          <h1>{t(slide.title)} <em>{t(slide.accent)}</em></h1>
          <p>{t(slide.description)}</p>
        </motion.div>
      </div>
      <div className="hero-services" role="group" aria-label={t('Featured services')}>
        {services.map(({ tab, icon: Icon }, index) =>
          <button key={tab} type="button" aria-pressed={active === index} onClick={() => onSelect(index)}>
            <Icon size={16} aria-hidden="true" />{t(tab)}
          </button>
        )}
      </div>
    </div>
    <div className="shell hero-search">{children}</div>
    <div className="shell hero-notes"><Link to="/#services">{t('EXPLORE OUR SERVICES')} <ArrowDown size={14} /></Link></div>
  </section>
}

function CityField({ name, defaultValue = '', errorId, onChange }: { name: 'From' | 'To'; defaultValue?: string; errorId?: string; onChange?: () => void }) {
  const t = useTranslation()
  return <label className="field">
    <MapPin size={17} aria-hidden="true" /><span>{t(name)}
      <select name={name} required defaultValue={defaultValue} onChange={onChange} aria-invalid={errorId ? true : undefined} aria-describedby={errorId}>
        <option value="" disabled>{t(name === 'From' ? 'Departure city' : 'Destination city')}</option>
        {destinationGroups.map(group => <optgroup key={group.type} label={t(group.title)}>
          {group.places.map(place => <option key={place} value={place}>{t(place)}</option>)}
        </optgroup>)}
      </select>
    </span>
  </label>
}

function DateField({ name, min, value, onChange }: { name: string; min: string; value?: string; onChange?: (value: string) => void }) {
  const t = useTranslation()
  return <label className="field date-field">
    <span>{t(name)}
      <input type="date" name={name} required min={min} value={value} onChange={onChange && (event => onChange(event.currentTarget.value))} />
    </span>
  </label>
}

function PassengerField() {
  const t = useTranslation()
  const [count, setCount] = useState(1)
  return <div className="field passenger-field" role="group" aria-label={t('Passengers')}>
    <div className="passenger-row">
      <div>{t('Passengers')}</div>
      <div className="passenger-stepper">
        <button type="button" aria-label={t('Remove passenger')} disabled={count <= 1} onClick={() => setCount(current => Math.max(1, current - 1))}><Minus size={16} aria-hidden="true" /></button>
        <output aria-live="polite">{count}</output>
        <button type="button" aria-label={t('Add passenger')} onClick={() => setCount(current => current + 1)}><Plus size={16} aria-hidden="true" /></button>
      </div>
    </div>
    <input type="hidden" name="Passengers" value={count} />
  </div>
}

function SearchCard({ active, setActive, onInquiry, destination }: { active: number; setActive: (value: number) => void; onInquiry: (value: string) => void; destination: string | null }) {
  const t = useTranslation()
  const flightGroup = destinationGroups.find(group => group.places.some(place => place === destination))
  const service = services[active]
  const isFlight = service === services[0]
  const [error, setError] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    if ([...form.querySelectorAll<HTMLInputElement>('input[type="text"]')].some(input => !input.value.trim())) {
      setError('Complete all required fields.')
      return
    }
    const from = String(data.get('From') ?? '').trim()
    const to = String(data.get('To') ?? '').trim()
    if (isFlight && to === from) {
      setError('Enter two different cities.')
      return
    }
    const details = Array.from(data, ([label, value]) => {
      const isOption = label === 'Flight type' || form.elements.namedItem(label) instanceof HTMLSelectElement
      const text = typeof value === 'string' ? value.trim() : value.name
      return t(label) + ': ' + (isOption ? t(text) : text)
    })
    onInquiry([t(service.title), ...details].join('\n'))
  }
  const fields = service.fields.map(([label, kind, ...options], index) => {
  const Icon = [CalendarDays, MapPin, Ticket, Box][index]
  if (isFlight && (label === 'From' || label === 'To')) return <CityField key={label} name={label} defaultValue={label === 'To' && flightGroup ? destination ?? '' : ''} />
  if (isFlight && label === 'Passengers') return <PassengerField key={label} />
  if (kind === 'date') return <DateField key={label} name={label} min={todayForInput()} />
  const isInput = ['text', 'number'].includes(kind)
  return <label className="field" key={label}><Icon size={17} /><span>{t(label)}
    {isInput ? <input aria-label={t(label)} name={label} type={kind} placeholder={options[0] && t(options[0])} required min={kind === 'number' ? '0.01' : undefined} step={kind === 'number' ? '0.01' : undefined} /> :
      <select name={label} required defaultValue=""><option value="" disabled>{t('Select an option')}</option>{[kind, ...options].map(option => <option key={option} value={option}>{t(option)}</option>)}</select>}
  </span></label>
})

  return <div className="search-card" id="journey">
    <div className="search-top"><h2>{t('Start Your Journey')}</h2><span><Compass size={15} /> {t('TRAVEL PLANNER')}</span></div>
    <div className="service-tabs" role="group" aria-label={t('Travel service')}>
      {services.map(({ tab, icon: Icon }, index) => <button key={tab} type="button" aria-pressed={active === index} onClick={() => setActive(index)}><Icon size={16} />{t(tab)}</button>)}
    </div>
    <form key={service.tab} onSubmit={submit} onInput={() => setError('')} className="search-form" style={{ gridTemplateColumns: 'repeat(' + service.fields.length + ', minmax(0, 1fr)) auto' }}>
      {fields}
      {error && <p className="planner-error" role="alert">{t(error)}</p>}
      <button className="pill search-submit">{t(service.action)}<ArrowRight size={17} /></button>
      {isFlight && <fieldset className="flight-type"><legend className="sr-only">{t('Flight type')}</legend><label><input type="radio" name="Flight type" value="Local" defaultChecked={flightGroup?.type !== 'International'} /> {t('Local')}</label><label><input type="radio" name="Flight type" value="International" defaultChecked={flightGroup?.type === 'International'} /> {t('International')}</label></fieldset>}
    </form>
  </div>
}

function FlightBooking({ onInquiry }: { onInquiry: (value: string) => void }) {
  const t = useTranslation()
  const [trip, setTrip] = useState<'Round trip' | 'One way'>('Round trip')
  const [departure, setDeparture] = useState('')
  const [arrivalError, setArrivalError] = useState(false)
  const earliest = todayForInput()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const from = String(form.get('From') ?? '').trim()
    const to = String(form.get('To') ?? '').trim()
    if (!from || !to || from === to) {
      setArrivalError(true)
      return
    }

    const details = [
      [t('Trip type'), t(trip)],
      [t('From'), t(from)],
      [t('To'), t(to)],
      [t('Departure date'), form.get('Departure date')],
      [t('Passengers'), form.get('Passengers')],
      [t('Cabin class'), t(String(form.get('Cabin class')))],
    ]
    if (trip === 'Round trip') {
      details.splice(4, 0, [t('Return date'), form.get('Return date')])
    }
    onInquiry([t('Flight booking inquiry'), ...details.map(([label, value]) => label + ': ' + value)].join('\n'))
  }

  return <section className="booking-page" aria-labelledby="booking-title">
    <div className="shell booking-content">
      <Link className="destinations-back" to="/"><ArrowLeft size={17} aria-hidden="true" /> {t('Back to home')}</Link>
      <Tag>{t('Flight Tickets')}</Tag>
      <h1 id="booking-title">{t('Flight Search')}</h1>
      <p>{t('Enter your trip details to request flight options from our travel team.')}</p>
      <form className="card booking-form" onSubmit={submit}>
        <fieldset className="service-tabs">
          <legend className="sr-only">{t('Trip type')}</legend>
          {(['Round trip', 'One way'] as const).map(option => <label key={option}>
            <input type="radio" name="trip" checked={trip === option} onChange={() => setTrip(option)} /> {t(option)}
          </label>)}
        </fieldset>
        <div className="booking-fields">
          <CityField name="From" onChange={() => setArrivalError(false)} />
          <CityField name="To" onChange={() => setArrivalError(false)} errorId={arrivalError ? 'booking-route-error' : undefined} />
          <DateField name="Departure date" min={earliest} value={departure} onChange={setDeparture} />
          {trip === 'Round trip' && <DateField name="Return date" min={departure || earliest} />}
          <PassengerField />
          <label className="field"><Plane size={17} aria-hidden="true" /><span>{t('Cabin class')}
            <select name="Cabin class" defaultValue="Economy">
              {['Economy', 'Business', 'First class'].map(option => <option key={option} value={option}>{t(option)}</option>)}
            </select>
          </span></label>
        </div>
        {arrivalError && <p id="booking-route-error" role="alert">{t('Enter two different cities.')}</p>}
        <button type="submit" className="pill">{t('Request flight options')}</button>
      </form>
    </div>
  </section>
}

const airlinePartners = [
  [ekLogo, 'Emirates'],
  [qrLogo, 'Qatar Airways'],
  [svLogo, 'Saudia'],
  [eyLogo, 'Etihad Airways'],
  [tkLogo, 'Turkish Airlines'],
  [ovLogo, 'SalamAir'],
  [pkLogo, 'Pakistan International Airlines'],
  [fzLogo, 'flydubai'],
  [d3Logo, 'Daallo Airlines'],
  [msLogo, 'EgyptAir'],
  [mqLogo, 'Maandeeq Air'],
  [saLogo, 'Saacid Airlines'],
  [sxLogo, 'Salaam Air Express'],
  [daLogo, 'Dalsan Air'],
  [etLogo, 'Ethiopian Airlines'],
] as const

function AirlinePartners() {
  const t = useTranslation()
  return <section className="shell section airline-partners" aria-labelledby="airline-partners-title">
    <h2 id="airline-partners-title">{t('Our')} <em>{t('Airline Partners')}</em></h2>
    <ul className="partner-grid">
      {airlinePartners.map(([logoUrl, name]) => <li key={name}>
        <img src={logoUrl} alt={name} width={128} height={128} loading="lazy" decoding="async" />
      </li>)}
    </ul>
  </section>
}

function About() {
  const t = useTranslation()
  return <Reveal id="about" className="shell section about">
    <div><Tag>{t('About Us')}</Tag><h2>{t('Welcome To Our Travel Agency')}</h2><h3 className="about-company">Al Istiqama Travel Umrah &amp; Hajj LLC</h3><p className="about-intro">{t('At Al Istiqama Travel Umrah & Hajj LLC, we are devoted to offering spiritual journeys that touch the soul and inspire the heart. As a dedicated travel agency specializing in Umrah and Hajj services, we understand the significance of these sacred pilgrimages in the Islamic faith. Our mission is to facilitate a seamless and spiritually enriching experience for pilgrims as they undertake these profound acts of worship.')}</p><ButtonLink outline>{t('Book now')}</ButtonLink></div>
    <div className="about-photo"><img src={homeUrl + 'destinations/hero.jpg'} loading="lazy" alt={t('Waterfront and skyline of Dubai Marina')} /><blockquote>{t('From booking a flight and preparing a visa application to shipping cargo or planning Umrah and Hajj, our team helps you take the next step.')}</blockquote></div>
  </Reveal>
}

function Services() {
  const t = useTranslation()
  return <Reveal id="services" className="section shell">
    <div className="section-heading"><Tag>{t('What We Offer')}</Tag><h2>{t('Everything you need to')} <em>{t('travel with confidence')}</em></h2></div>
    <div className="service-grid">{services.map(({ title, text, icon: Icon }, index) => <article key={title} className="card service">
      <span className="tile-icon"><Icon aria-hidden="true" /></span><h3>{t(title)}</h3><p>{t(text)}</p>
      <Link to={'/?service=' + serviceIds[index] + '#journey'}>{t('Plan this service')} <ArrowUpRight size={16} aria-hidden="true" /></Link>
    </article>)}</div>
  </Reveal>
}

function InquirySteps() {
  const t = useTranslation()
  const steps = [
    ['Choose a service', 'Pick a service and enter the details of your trip or shipment.'],
    ['Review your inquiry', 'Check your dates, route and other details before sharing them.'],
    ['Send it to our team', 'Use WhatsApp or email to ask about options and next steps.'],
  ]
  return <section className="shell section inquiry-steps" aria-labelledby="inquiry-steps-title">
    <h2 id="inquiry-steps-title">{t('How to request a service')}</h2>
    <ol>{steps.map(([title, text]) => <li className="card" key={title}><h3>{t(title)}</h3><p>{t(text)}</p></li>)}</ol>
  </section>
}

const testimonialExamples = [
  { name: 'Amina Hassan', initials: 'AH', title: 'Flight booking customer', quote: 'I told the team my travel dates, and they helped me compare flight options and understand the baggage rules before I booked.' },
  { name: 'Mohamed Ali', initials: 'MA', title: 'Visa applicant', quote: 'Al Istiqama explained which documents I needed and helped me check what was missing before I submitted my application.' },
  { name: 'Fadumo Osman', initials: 'FO', title: 'Small business owner', quote: 'The team explained how to pack my shipment, what details to provide, and what to expect at each step.' },
  { name: 'Abdirahman Yusuf', initials: 'AY', title: 'Umrah traveler', quote: 'The team walked me through the itinerary, accommodation, and transfers. I felt better prepared for my pilgrimage.' },
  { name: 'Hodan Ahmed', initials: 'HA', title: 'Family traveler', quote: 'We were traveling with two children. The team helped us choose a flight with a connection that gave us enough time between gates.' },
  { name: 'Ismail Nur', initials: 'IN', title: 'Business traveler', quote: 'My meeting date changed, and the team explained the fare difference and change fee before I moved my return flight.' },
]
function CustomerFeedback() {
  const t = useTranslation()
  const [paused, setPaused] = useState(false)

  return <Reveal id="customer-feedback" className="section shell customer-feedback">
    <div className="feedback-heading">
      <div>
        <h2>{t('Customer Feedback')}</h2>
        <p>{t('Sample feedback')}</p>
      </div>
      <a className="pill outline" href={whatsappUrl + '?text=' + encodeURIComponent(t('I would like to share feedback about Ali-Istiqama Travel.'))} target="_blank" rel="noopener noreferrer">
        {t('Share your feedback')} <span><MessageCircle size={16} aria-hidden="true" /></span>
      </a>
    </div>
    <button className="feedback-toggle" type="button" aria-controls="feedback-profiles" onClick={() => setPaused(current => !current)}>
      {t(paused ? 'Resume scrolling' : 'Pause scrolling')}
    </button>
    <div id="feedback-profiles" className="feedback-viewport" data-paused={paused}>
      <div className="feedback-track">
        {[false, true].map(copy => <ul className={copy ? 'feedback-group feedback-copy' : 'feedback-group'} key={String(copy)} aria-hidden={copy || undefined} role="list">
          {testimonialExamples.map(({ name, initials, title, quote }) => <li className="card feedback-card" key={name}>
            <div className="feedback-profile">
              <span className="feedback-avatar" aria-hidden="true">{initials}</span>
              <div><h3>{name}</h3><p>{t(title)}</p></div>
            </div>
            <blockquote><p>{t(quote)}</p></blockquote>
          </li>)}
        </ul>)}
      </div>
    </div>
  </Reveal>
}

function PackageCard({ onInquiry }: { onInquiry: (value: string) => void }) {
  const t = useTranslation()
  return <Reveal id="packages" className="section shell"><div className="section-heading"><Tag>{t('Featured Package')}</Tag><h2> <em>{t('Umrah')}</em> {t('package')}</h2></div>
    <div className="card package-card"><div className="package-included"><h3>{t('Services Included')}</h3><ul>{['Round-trip flights', 'Hotel near the Haram', 'Umrah visa assistance', 'Airport and intercity transport', 'Guided ziyarat', '24/7 support'].map(item => <li key={item}><Check size={18} />{t(item)}</li>)}</ul></div>
      <div className="package-details"><div className="package-badges"><span className="stars" aria-label={t('Sample five-star rating')}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill="currentColor" />)}</span><span><ShieldCheck size={15} /> {t('7-Day Booking Assurance')}</span></div><p>{t('Example package price')}</p><strong>$1,999</strong><dl><div><dt>{t('Time Savings')}</dt><dd>{t('Travel arranged for you')}</dd></div><div><dt>{t('Expert Guidance')}</dt><dd>{t('On-ground support')}</dd></div><div><dt>{t('Reliable Solutions')}</dt><dd>{t('Coordinated stays and transfers')}</dd></div></dl><button className="pill" onClick={() => onInquiry(t('Featured All-in Umrah package'))}>{t('Get started')} <span><ArrowUpRight size={16} /></span></button></div>
    </div>
  </Reveal>
}

function Footer({ onContact }: { onContact: () => void }) {
  const t = useTranslation()
  const email = contact.email || 'info@alistiqama.com'
  const chatUrl = whatsappUrl + '?text=' + encodeURIComponent(t('General travel inquiry'))
  const socials = [
    ['Facebook', 'https://www.facebook.com/AlistiqamaLLC', <strong aria-hidden="true">f</strong>],
    ['Instagram', 'https://www.instagram.com/AlistiqamaLLC', <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.8" cy="6.2" r="1.25" fill="currentColor" />
    </svg>],
    ['WhatsApp', chatUrl, <MessageCircle size={19} aria-hidden="true" />],
  ] as const

  return <footer id="contact" className="footer">
    <div className="shell">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to={navHref('Home')} className="brand"><img src={logo} alt="Ali-Istiqama Travel Umrah & Hajj LLC" /></Link>
          <p>{t('Travel with confidence.')}</p>
          <address className="footer-contact">
            <span><MapPin size={17} aria-hidden="true" /> {t('Mogadishu, Somalia')}</span>
            <a target="_blank" rel="noopener noreferrer" href={chatUrl}><MessageCircle size={17} aria-hidden="true" /> {contact.whatsapp}</a>
            <a href={'mailto:' + email}><Mail size={17} aria-hidden="true" /> {email}</a>
            {contact.phone && <a href={'tel:' + contact.phone}><Phone size={17} aria-hidden="true" /> {contact.phone}</a>}
          </address>
          <div className="footer-socials">
            {socials.map(([title, href, icon]) => <a target="_blank" rel="noopener noreferrer" key={title} href={href} aria-label={title}>{icon}</a>)}
          </div>
        </div>
        <nav className="footer-column" aria-labelledby="footer-services">
          <h2 id="footer-services">{t('Services')}</h2>
          <ul>{services.map(({ title }, index) => <li key={title}><Link to={'/?service=' + serviceIds[index] + '#journey'}>{t(title)}</Link></li>)}</ul>
        </nav>
        <nav className="footer-column" aria-labelledby="footer-company">
          <h2 id="footer-company">{t('Company')}</h2>
          <ul>
            {['About', 'Destinations', 'Packages'].map(label => <li key={label}><Link to={navHref(label)}>{t(label)}</Link></li>)}
            <li><button type="button" onClick={onContact}>{t('Contact us')}</button></li>
          </ul>
        </nav>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Alistiqama LLC</p>
        <p>{t('Powered by Alistiqama LLC')}</p>
      </div>
    </div>
    <a target="_blank" rel="noopener noreferrer" className="floating-chat" href={chatUrl} aria-label={t('Chat on WhatsApp')}><MessageCircle aria-hidden="true" /></a>
  </footer>
}

function HomePage({ destination, service, onInquiry }: { destination: string | null; service: number; onInquiry: (value: string) => void }) {
  const [active, setActive] = useState(destination ? 0 : Math.max(0, service))
  return <>
    <Hero active={active} onSelect={setActive}>
      <SearchCard key={active} active={active} setActive={setActive} onInquiry={onInquiry} destination={destination} />
    </Hero>
    <About /><Services /><InquirySteps /><CustomerFeedback /><PackageCard onInquiry={onInquiry} />
  </>
}

export default function App() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const page = params.get('page')
  const isDestinationsPage = page === 'destinations'
  const isBookingPage = page === 'booking'
  const requestedDestination = params.get('destination')
  const destination = destinationGroups.some(group => group.places.some(place => place === requestedDestination)) ? requestedDestination : null
  const requestedService = serviceIds.indexOf(params.get('service') ?? '')
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem('alistiqama-language') === 'so' ? 'so' : 'en'
    } catch {
      return 'en'
    }
  })
  const t = (text: string) => translate(language, text)

  useEffect(() => {
    document.documentElement.lang = language
    document.title = isDestinationsPage
      ? translate(language, 'Flight Destinations') + ' | Ali-Istiqama Travel'
      : isBookingPage ? translate(language, 'Flight Search') + ' | Ali-Istiqama Travel' : 'Ali-Istiqama Travel Umrah & Hajj LLC'
    try {
      localStorage.setItem('alistiqama-language', language)
    } catch {
      // The language still changes for the current page.
    }
  }, [language, isDestinationsPage, isBookingPage])
  const [inquiry, setInquiry] = useState('')
  const [copyState, setCopyState] = useState('')
  const [contactError, setContactError] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const contactDialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const id = location.hash.slice(1)
      if (id) document.getElementById(id)?.scrollIntoView({ block: 'start' })
      else window.scrollTo({ top: 0, behavior: 'instant' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [location.key, location.hash])

  function openInquiry(value: string) {
    setInquiry(value)
    setCopyState('')
    dialog.current?.showModal()
  }
  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (!String(data.get('Message') ?? '').trim()) {
      setContactError(true)
      return
    }
    const details = ['Name', 'Phone', 'Service', 'Travelers', 'Travel month', 'Message'].flatMap(label => {
      const value = String(data.get(label) ?? '').trim()
      return value ? [t(label) + ': ' + (label === 'Service' ? t(value) : value)] : []
    })
    contactDialog.current?.close()
    openInquiry([t('General travel inquiry'), ...details].join('\n'))
  }

  async function copyInquiry() {
    try {
      await navigator.clipboard.writeText(inquiry)
      setCopyState('Inquiry copied.')
    } catch {
      setCopyState('Select the inquiry text to copy it manually.')
    }
  }
  return <LanguageContext.Provider value={language}>
    <a className="skip-link" href="#main-content">{t('Skip to content')}</a>
    <Navbar language={language} onLanguageChange={setLanguage} />
    <main id="main-content" tabIndex={-1}>
      {isBookingPage ? <FlightBooking onInquiry={openInquiry} /> : isDestinationsPage ? <Destinations /> :
        <HomePage key={location.search} destination={destination} service={requestedService} onInquiry={openInquiry} />}
      <AirlinePartners />
    </main>
    <Footer onContact={() => contactDialog.current?.showModal()} />
    <dialog ref={contactDialog} className="inquiry-dialog" onClose={() => setContactError(false)} aria-labelledby="contact-form-title">
      <div className="dialog-heading">
        <h2 id="contact-form-title">{t('Contact us')}</h2>
        <button type="button" className="round" aria-label={t('Close inquiry')} onClick={() => contactDialog.current?.close()}><X size={20} /></button>
      </div>
      <form className="contact-form" onSubmit={submitContact}>
        <label className="field"><span>{t('Name')} <input name="Name" autoComplete="name" required pattern=".*\S.*" /></span></label>
        <label className="field"><span>{t('Phone')}
          <input name="Phone" type="tel" autoComplete="tel" required pattern="(?=(?:[^0-9]*[0-9]){7,15}[^0-9]*$)\+?[0-9][0-9 \x28\x29\x2D]{5,18}[0-9]" title={t('Enter a phone number with 7 to 20 characters, including the country code when needed.')} />
        </span></label>
        <label className="field"><span>{t('Service')}
          <select name="Service" required defaultValue="">
            <option value="" disabled>{t('Select an option')}</option>
            {['Umrah', 'Hajj', 'Flight', 'Visa', 'Cargo'].map(service => <option key={service} value={service}>{t(service)}</option>)}
          </select>
        </span></label>
        <label className="field"><span>{t('Travelers')} <select name="Travelers" defaultValue=""><option value="">{t('Select an option')}</option>{['1', '2', '3', '4', '5+'].map(count => <option key={count} value={count}>{count}</option>)}</select></span></label>
        <label className="field"><span>{t('Travel month')} <input name="Travel month" type="month" /></span></label>
        <label className="contact-message">{t('Message')} <textarea name="Message" required rows={3} aria-invalid={contactError || undefined} aria-describedby={contactError ? 'contact-message-error' : undefined} onInput={() => setContactError(false)} /></label>
        {contactError && <p id="contact-message-error" role="alert">{t('Enter a message before continuing.')}</p>}
        <button type="submit" className="pill">{t('Review inquiry')}</button>
      </form>
    </dialog>
    <dialog ref={dialog} className="inquiry-dialog" aria-labelledby="inquiry-title"><div className="dialog-heading"><h2 id="inquiry-title">{t('Your travel inquiry')}</h2><button className="round" aria-label={t('Close inquiry')} onClick={() => dialog.current?.close()}><X size={20} /></button></div><p>{t('Review and copy your details, or send them to our travel team.')}</p><textarea aria-label={t('Inquiry details')} readOnly value={inquiry} rows={6} /><div className="inquiry-actions"><button className="pill" onClick={copyInquiry}>{t('Copy inquiry')}</button>{contact.email && <a className="pill outline" href={'mailto:' + contact.email + '?subject=' + encodeURIComponent(t('Travel inquiry')) + '&body=' + encodeURIComponent(inquiry)}>{t('Email inquiry')}</a>}{contact.whatsapp && <a target="_blank" rel="noopener noreferrer" className="pill outline" href={whatsappUrl + '?text=' + encodeURIComponent(inquiry)}>WhatsApp</a>}</div><p role="status">{t(copyState)}</p></dialog>
  </LanguageContext.Provider>
}



