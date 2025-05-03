import { Logo } from './logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import React from 'react'
import { cn } from '@/utils/css'
import { Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'

const menuItems = [
    { name: 'Features', href: '/#link' },
    { name: 'Solution', href: '/#link' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/#link' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState ? 'active' : undefined}
                className="fixed z-20 w-full px-2">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                to="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu data-state={menuState ? 'active' : undefined} className="m-auto size-6 duration-200 data-[state=active]:rotate-180 data-[state=active]:scale-0 data-[state=active]:opacity-0" />
                                <X data-state={menuState ? 'active' : undefined} className="absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 data-[state=active]:rotate-0 data-[state=active]:scale-100 data-[state=active]:opacity-100" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-md font-publica-sans">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            to={item.href}
                                            className="text-foreground hover:text-primary block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <AnimatePresence>
                            {menuState && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className={cn("bg-background mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent", "block", "lg:hidden")}>
                                    <div className="lg:hidden">
                                        <ul className="space-y-6 text-base">
                                            {menuItems.map((item, index) => (
                                                <li key={index}>
                                                    <Link
                                                        to={item.href}
                                                        className="text-foreground hover:text-primary block duration-150">
                                                        <span>{item.name}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit font-publica-sans">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="default">
                                            <Link to="/login">
                                                <span>Login</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="default">
                                            <Link to="/sign-up">
                                                <span>Sign Up</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="hidden lg:flex lg:w-fit lg:gap-6 font-publica-sans">
                            <Button
                                asChild
                                variant="outline"
                                size="default"
                                className={cn(isScrolled && 'lg:hidden')}>
                                <Link to="/login">
                                    <span>Login</span>
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="default"
                                className={cn(isScrolled && 'lg:hidden')}>
                                <Link to="/sign-up">
                                    <span>Sign Up</span>
                                </Link>
                            </Button>
                            {isScrolled && (
                                <Button
                                    asChild
                                    size="default"
                                    className="lg:inline-flex">
                                    <Link to="/sign-up">
                                        <span>Get Started</span>
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
