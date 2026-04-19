import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'
import Image from './Image'

const Header = () => {
  return (
    <header className="sticky top-3 z-30 mb-8 mt-4 flex items-center justify-between rounded-2xl border border-primary-900 bg-[#030a1a]/95 px-4 py-3 shadow-sm backdrop-blur">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between gap-3">
            <Image
              src="/static/images/gsmg-logo.png"
              alt="Gracious Stone Men's Group"
              width={200}
              height={42}
              className=" h-auto w-auto pr-4 sm:block"
            />
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="md:hidden">
          <SearchButton />
        </div>
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="hidden rounded-md px-2 py-1 text-sm font-semibold text-gray-100 transition hover:bg-[#0f2347] hover:text-primary-200 md:block"
            >
              {link.title}
            </Link>
          ))}
        <div className="hidden md:block">
          <SearchButton />
        </div>
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
