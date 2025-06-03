import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQs() {
    return (
        <section className="scroll-py-8 py-8 pb-16 md:scroll-py-16 md:py-16 md:pb-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid gap-y-12 lg:gap-x-16 px-2 lg:grid-cols-12">
                    <div className="text-center lg:text-left lg:col-span-5 xl:col-span-4">
                        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
                            Your Questions,
                            <br className="hidden lg:block" /> Answered
                        </h2>
                        <p>Find quick answers to common questions about Bean Journal and its features.</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full lg:col-span-7 xl:col-span-8">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-left font-medium hover:no-underline">
                                What makes Bean Journal different from other journaling apps?
                            </AccordionTrigger>
                            <AccordionContent className="text-[#99BC85] pt-2">
                                Bean Journal combines a flexible Notion-like editor for rich text journaling with a unique AI feature that can transform your written entries into beautiful video summaries. We also prioritize a clean, intuitive interface and robust data privacy.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-left font-medium hover:no-underline">
                                How does the AI diary-to-video feature work?
                            </AccordionTrigger>
                            <AccordionContent className="text-[#99BC85] pt-2">
                                Our AI analyzes the themes, emotions, and key moments in your journal entries to create a compelling visual narrative. You can guide the AI and customize the output to ensure the video truly reflects your memories.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-left font-medium hover:no-underline">
                                Is my journal data private and secure?
                            </AccordionTrigger>
                            <AccordionContent className="text-[#99BC85] pt-2">
                                Absolutely. We use end-to-end encryption and robust security measures to ensure your personal thoughts and memories remain private and protected. You have full control over your data.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger className="text-left font-medium hover:no-underline">
                                Can I import entries from another journaling app or export my data?
                            </AccordionTrigger>
                            <AccordionContent className="text-[#99BC85] pt-2">
                                We are actively working on import and export functionalities to make it easy for you to bring your existing journals into Bean Journal and to take your data with you if you choose. Stay tuned for updates!
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5" className="border-b-0">
                            <AccordionTrigger className="text-left font-medium hover:no-underline">
                                Is Bean Journal free to use? Are there any subscription plans?
                            </AccordionTrigger>
                            <AccordionContent className="text-[#99BC85] pt-2">
                                Bean Journal offers a free tier with core journaling features. We also have premium subscription plans that unlock advanced functionalities like unlimited AI video generations, more storage, and exclusive themes. You can find more details on our pricing page.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
