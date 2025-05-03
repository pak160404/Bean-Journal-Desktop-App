import { Cpu, Sparkles } from 'lucide-react'

const tableData = [
    {
        feature: 'Feature 1',
        free: true,
        pro: true,
        startup: true,
    },
    {
        feature: 'Feature 2',
        free: true,
        pro: true,
        startup: true,
    },
    {
        feature: 'Feature 3',
        free: false,
        pro: true,
        startup: true,
    },
    {
        feature: 'Tokens',
        free: '',
        pro: '20 Users',
        startup: 'Unlimited',
    },
    {
        feature: 'Video calls',
        free: '',
        pro: '12 Weeks',
        startup: '56',
    },
    {
        feature: 'Support',
        free: '',
        pro: 'Secondes',
        startup: 'Unlimited',
    },
    {
        feature: 'Security',
        free: '',
        pro: '20 Users',
        startup: 'Unlimited',
    },
]

export default function PricingComparator() {
    return (
        <section className="pb-8 md:pb-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
                {/* Mobile view (card-based layout) */}
                <div className="flex flex-col gap-6 md:hidden">
                    {/* Free Plan */}
                    <div className="rounded-lg border shadow-sm">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold mb-3">Free</h3>
                        </div>
                        <div className="p-4 border-b">
                            <div className="flex items-center gap-2 font-medium mb-3">
                                <Cpu className="size-4" />
                                <span>Features</span>
                            </div>
                            {tableData.slice(-4).map((row, index) => (
                                <div key={index} className="flex justify-between py-2 border-b last:border-none">
                                    <span className="text-muted-foreground text-sm">{row.feature}</span>
                                    <span>
                                        {row.free === true ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            row.free || '—'
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-2 font-medium mb-3">
                                <Sparkles className="size-4" />
                                <span>AI Models</span>
                            </div>
                            {tableData.map((row, index) => (
                                <div key={index} className="flex justify-between py-2 border-b last:border-none">
                                    <span className="text-muted-foreground text-sm">{row.feature}</span>
                                    <span>
                                        {row.free === true ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            row.free || '—'
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="rounded-lg border shadow-sm bg-muted">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold mb-3">Pro</h3>
                        </div>
                        <div className="p-4 border-b">
                            <div className="flex items-center gap-2 font-medium mb-3">
                                <Cpu className="size-4" />
                                <span>Features</span>
                            </div>
                            {tableData.slice(-4).map((row, index) => (
                                <div key={index} className="flex justify-between py-2 border-b last:border-none">
                                    <span className="text-muted-foreground text-sm">{row.feature}</span>
                                    <span>
                                        {row.pro === true ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            row.pro || '—'
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-2 font-medium mb-3">
                                <Sparkles className="size-4" />
                                <span>AI Models</span>
                            </div>
                            {tableData.map((row, index) => (
                                <div key={index} className="flex justify-between py-2 border-b last:border-none">
                                    <span className="text-muted-foreground text-sm">{row.feature}</span>
                                    <span>
                                        {row.pro === true ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            row.pro || '—'
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Startup Plan */}
                    <div className="rounded-lg border shadow-sm">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold mb-3">Startup</h3>
                        </div>
                        <div className="p-4 border-b">
                            <div className="flex items-center gap-2 font-medium mb-3">
                                <Cpu className="size-4" />
                                <span>Features</span>
                            </div>
                            {tableData.slice(-4).map((row, index) => (
                                <div key={index} className="flex justify-between py-2 border-b last:border-none">
                                    <span className="text-muted-foreground text-sm">{row.feature}</span>
                                    <span>
                                        {row.startup === true ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            row.startup || '—'
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-2 font-medium mb-3">
                                <Sparkles className="size-4" />
                                <span>AI Models</span>
                            </div>
                            {tableData.map((row, index) => (
                                <div key={index} className="flex justify-between py-2 border-b last:border-none">
                                    <span className="text-muted-foreground text-sm">{row.feature}</span>
                                    <span>
                                        {row.startup === true ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            row.startup || '—'
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desktop view (table layout) */}
                <div className="hidden md:block">
                    <div className="w-full overflow-auto lg:overflow-visible">
                        <table className="w-full border-separate border-spacing-x-3 dark:[--color-muted:var(--color-zinc-900)]">
                            <thead className="bg-background sticky top-0">
                                <tr className="*:py-4 *:text-left *:font-medium">
                                    <th className="lg:w-2/5"></th>
                                    <th className="space-y-3">
                                        <span className="block">Free</span>

                                    </th>
                                    <th className="bg-muted rounded-t-(--radius) space-y-3 px-4">
                                        <span className="block">Pro</span>
                                    </th>
                                    <th className="space-y-3">
                                        <span className="block">Startup</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-caption text-sm">
                                <tr className="*:py-3">
                                    <td className="flex items-center gap-2 font-medium">
                                        <Cpu className="size-4" />
                                        <span>Features</span>
                                    </td>
                                    <td></td>
                                    <td className="bg-muted border-none px-4"></td>
                                    <td></td>
                                </tr>
                                {tableData.slice(-4).map((row, index) => (
                                    <tr key={index} className="*:border-b *:py-3">
                                        <td className="text-muted-foreground">{row.feature}</td>
                                        <td>
                                            {row.free === true ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                row.free || '—'
                                            )}
                                        </td>
                                        <td className="bg-muted border-none px-4">
                                            <div className="-mb-3 border-b py-3">
                                                {row.pro === true ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    row.pro || '—'
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {row.startup === true ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                row.startup || '—'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="*:pb-3 *:pt-8">
                                    <td className="flex items-center gap-2 font-medium">
                                        <Sparkles className="size-4" />
                                        <span>AI Models</span>
                                    </td>
                                    <td></td>
                                    <td className="bg-muted border-none px-4"></td>
                                    <td></td>
                                </tr>
                                {tableData.map((row, index) => (
                                    <tr key={index} className="*:border-b *:py-3">
                                        <td className="text-muted-foreground">{row.feature}</td>
                                        <td>
                                            {row.free === true ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                row.free || '—'
                                            )}
                                        </td>
                                        <td className="bg-muted border-none px-4">
                                            <div className="-mb-3 border-b py-3">
                                                {row.pro === true ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    row.pro || '—'
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {row.startup === true ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                row.startup || '—'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="*:py-6">
                                    <td></td>
                                    <td></td>
                                    <td className="bg-muted rounded-b-(--radius) border-none px-4"></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}
